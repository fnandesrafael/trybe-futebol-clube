import { Router } from 'express';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';

const router = Router();

const leaderboardHomeController = new LeaderboardHomeController();

router.get('/home', leaderboardHomeController.getAllHome);

export default router;
