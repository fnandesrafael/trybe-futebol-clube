import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(public service = new MatchService()) {}

  public getAll = async (req: Request, res: Response) => {
    const response = await this.service.getAll();

    return res.status(response.statusCode).json(response.message);
  };
}
