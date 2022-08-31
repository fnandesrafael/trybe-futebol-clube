import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router()

const userController = new UserController()

router.post('/', userController.login)

router.get('/validate', userController.validate)

export default router