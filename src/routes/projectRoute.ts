import { Router } from 'express';
import { createNewProject, getProjects } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeTeamRole } from '../middleware/rbacMiddleware.js';

const router = Router({ mergeParams: true });

// All project routes require authentication
router.use(protect);

// Any team member can view projects
router.get('/', authorizeTeamRole(['ADMIN', 'MANAGER', 'MEMBER']), getProjects);

// Only ADMIN or MANAGER can create projects
router.post('/', authorizeTeamRole(['ADMIN', 'MANAGER']), createNewProject);

export default router;