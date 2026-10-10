import { pool } from '../config/database.js';
import { CreateProjectInput } from '../schemas/projectSchema.js';

export const createProject = async (teamId: string, input: CreateProjectInput) => {
  const { title, description } = input;
  const result = await pool.query(
    `INSERT INTO projects (team_id, title, description) 
     VALUES ($1, $2, $3) 
     RETURNING id, team_id, title, description, status, created_at`,
    [teamId, title, description || null]
  );
  return result.rows[0];
};

export const getTeamProjects = async (teamId: string) => {
  const result = await pool.query(
    `SELECT id, team_id, title, description, status, created_at 
     FROM projects 
     WHERE team_id = $1 
     ORDER BY created_at DESC`,
    [teamId]
  );
  return result.rows;
};