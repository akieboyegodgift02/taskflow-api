import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { createTeamSchema, inviteMemberSchema } from '../schemas/teamSchema.js';
import * as teamService from '../services/teamService.js';
import { AppError } from '../errors/appError.js';


export const createNewTeam = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const validatedData = createTeamSchema.parse(req.body);
    const team = await teamService.createTeam(userId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.teamId as string;

    const validatedData = inviteMemberSchema.parse(req.body);

    const result = await teamService.inviteMemberToTeam(teamId, validatedData);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
