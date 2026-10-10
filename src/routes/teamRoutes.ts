import { Router } from 'express';
import { createNewTeam, inviteMember } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeTeamRole } from '../middleware/rbacMiddleware.js';

const router = Router();

// All team routes require authentication
router.use(protect);

router.post('/', createNewTeam);
router.post('/:teamId/invite', authorizeTeamRole(['ADMIN']), inviteMember);

export default router;