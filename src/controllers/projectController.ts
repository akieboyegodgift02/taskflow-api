import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createProjectSchema } from '../schemas/projectSchema.js';
import * as projectService from '../services/projectService.js';

export const createNewProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.teamId as string;
    const validatedData = createProjectSchema.parse(req.body);

    const project = await projectService.createProject(teamId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.teamId as string;
    const projects = await projectService.getTeamProjects(teamId);

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};
