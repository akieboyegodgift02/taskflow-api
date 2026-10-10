import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';
import { pool } from '../config/database.js';
import { AppError } from '../errors/appError.js';

export const authorizeTeamRole = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const teamId = req.params.teamId || req.body.teamId;

      if (!userId) {
        throw new AppError('Unauthorized request', 401);
      }

      if (!teamId) {
        throw new AppError('Team ID is required to verify permissions', 400);
      }

      // Check user membership and role in the team
      const result = await pool.query(
        'SELECT role FROM team_members WHERE user_id = $1 AND team_id = $2',
        [userId, teamId]
      );

      if (result.rows.length === 0) {
        throw new AppError('Access denied: You are not a member of this team', 403);
      }

      const userRole = result.rows[0].role;

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(`Access denied: Requires one of the following roles: ${allowedRoles.join(', ')}`, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};