import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  constructor(public service = new UserService()) {}

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response = await this.service.login({ email, password });

    return res.status(response.statusCode).json(response.message);
  };

  public validate = async (req: Request, res: Response) => {
    const { decode } = res.locals;

    const response = await this.service.validate(decode);

    return res.status(response.statusCode).json(response.message);
  };
}
