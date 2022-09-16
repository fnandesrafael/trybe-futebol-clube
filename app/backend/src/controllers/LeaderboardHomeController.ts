import { Request, Response } from 'express';
import LeaderboardHomeService from '../services/LeaderboardHomeService';

export default class LeaderboardController {
  constructor(public service = new LeaderboardHomeService()) {}

  public getAllHome = async (req: Request, res: Response) => {
    const response = await this.service.getAllHome();

    return res.status(response.statusCode).json(response.message);
  };
}
