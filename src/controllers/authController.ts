import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import * as authService from '../services/authService.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body using Zod
    const validatedData = registerSchema.parse(req.body);

    // Call service
    const { user, token } = await authService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body using Zod
    const validatedData = loginSchema.parse(req.body);

    // Call service
    const { user, token } = await authService.loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};