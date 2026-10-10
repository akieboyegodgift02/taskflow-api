import { pool } from '../config/database.js';
import { AppError } from '../errors/appError.js';
import { CreateTaskInput, UpdateTaskStatusInput } from '../schemas/taskSchema.js';

export const createTask = async (projectId: string, teamId: string, input: CreateTaskInput) => {
  const { title, description, assigned_to, priority } = input;

  // 1. Verify project belongs to the team
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND team_id = $2',
    [projectId, teamId]
  );
  if (projectCheck.rows.length === 0) {
    throw new AppError('Project not found in this team', 404);
  }

  // 2. If assigned_to is provided, verify user is a member of the team
  if (assigned_to) {
    const memberCheck = await pool.query(
      'SELECT user_id FROM team_members WHERE user_id = $1 AND team_id = $2',
      [assigned_to, teamId]
    );
    if (memberCheck.rows.length === 0) {
      throw new AppError('Assigned user is not a member of this team', 400);
    }
  }

  // 3. Insert task
  const result = await pool.query(
    `INSERT INTO tasks (project_id, title, description, assigned_to, priority)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, project_id, title, description, assigned_to, status, priority, created_at`,
    [projectId, title, description || null, assigned_to || null, priority]
  );

  return result.rows[0];
};

export const getProjectTasks = async (projectId: string, teamId: string, status?: string) => {
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND team_id = $2',
    [projectId, teamId]
  );
  if (projectCheck.rows.length === 0) {
    throw new AppError('Project not found in this team', 404);
  }

  let query = `SELECT * FROM tasks WHERE project_id = $1`;
  const params: any[] = [projectId];

  if (status) {
    query += ` AND status = $2`;
    params.push(status);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

export const updateTaskStatus = async (taskId: string, projectId: string, teamId: string, input: UpdateTaskStatusInput) => {
  const projectCheck = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND team_id = $2',
    [projectId, teamId]
  );
  if (projectCheck.rows.length === 0) {
    throw new AppError('Project not found in this team', 404);
  }

  const result = await pool.query(
    `UPDATE tasks SET status = $1 
     WHERE id = $2 AND project_id = $3 
     RETURNING id, title, status`,
    [input.status, taskId, projectId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Task not found', 404);
  }

  return result.rows[0];
};