import { Router } from 'express';
import { createNewTask, getTasks, updateStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeTeamRole } from '../middleware/rbacMiddleware.js';

const router = Router({ mergeParams: true });

router.use(protect);

// View tasks (Any team member)
router.get('/', authorizeTeamRole(['ADMIN', 'MANAGER', 'MEMBER']), getTasks);

// Create task (ADMIN, MANAGER)
router.post('/', authorizeTeamRole(['ADMIN', 'MANAGER']), createNewTask);

// Update task status (ADMIN, MANAGER, MEMBER)
router.patch('/:taskId/status', authorizeTeamRole(['ADMIN', 'MANAGER', 'MEMBER']), updateStatus);

export default router;