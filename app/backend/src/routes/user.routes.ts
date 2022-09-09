import { Router } from 'express';
import Jwt from '../utils/Jwt';
import UserController from '../controllers/UserController';

const router = Router();

const userController = new UserController();

router.post('/', userController.login);

router.get('/validate', Jwt.authJwt, userController.validate);

export default router;
