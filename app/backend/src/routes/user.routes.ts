import { Router } from "express";
import UserController from "../controllers/UserController";
import * as cors from 'cors'

const router = Router()

const userController = new UserController()

router.post('/', cors(), userController.login)

export default router