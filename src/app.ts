import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './errors/appError.js';

// Routes
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js"
import projectRoutes from "./routes/projectRoute.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use("/api/v1/teams/:teamId/projects", projectRoutes);
app.use("/api/v1/teams/:teamId/projects/:projectId/tasks", taskRoutes);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is up and running!',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route for undefined endpoints
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware (Must be registered last)
app.use(errorHandler);

export default app;