import { Router } from 'express';
import Jwt from '../utils/Jwt';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const router = Router();

router.get('/', matchController.getAll);

router.post('/', Jwt.authJwt, matchController.create);

export default router;
