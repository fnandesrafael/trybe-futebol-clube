import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(public service = new LeaderboardService()) {}

  public getAllHome = async (req: Request, res: Response) => {
    const response = await this.service.getAllHome();

    return res.status(response.statusCode).json(response.message);
  };

  public getAllAway = async (req: Request, res: Response) => {
    const response = await this.service.getAllAway();

    return res.status(response.statusCode).json(response.message);
  };
}
