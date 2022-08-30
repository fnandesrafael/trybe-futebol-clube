import { Request, Response } from "express";
import UserService from "../services/UserService";

export default class UserController {
  constructor(public service = new UserService()) {}

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const response = await this.service.login({ email, password })

    return res.status(response.statusCode).json(response.message)
  }
}