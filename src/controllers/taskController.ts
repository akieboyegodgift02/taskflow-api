import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createTaskSchema, updateTaskStatusSchema } from '../schemas/taskSchema.js';
import * as taskService from '../services/taskService.js';

export const createNewTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.teamId as string;
    const projectId = req.params.projectId as string;
    
    const validatedData = createTaskSchema.parse(req.body);

    const task = await taskService.createTask(projectId, teamId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Explicitly cast parameters to string
    const teamId = req.params.teamId as string;
    const projectId = req.params.projectId as string;
    const { status } = req.query;

    const tasks = await taskService.getProjectTasks(projectId, teamId, status as string);

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.teamId as string;
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    
    const validatedData = updateTaskStatusSchema.parse(req.body);

    const task = await taskService.updateTaskStatus(taskId, projectId, teamId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};
