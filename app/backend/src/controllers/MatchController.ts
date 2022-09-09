import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(public service = new MatchService()) {}

  public getAll = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    if (inProgress && inProgress === 'true') {
      const responseWithQuery = await this.service.getByStatus(true);

      return res.status(responseWithQuery.statusCode).json(responseWithQuery.message);
    } if (inProgress && inProgress === 'false') {
      const responseWithQuery = await this.service.getByStatus(false);

      return res.status(responseWithQuery.statusCode).json(responseWithQuery.message);
    }
    const response = await this.service.getAll();

    return res.status(response.statusCode).json(response.message);
  };

  public create = async (req: Request, res: Response) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
    const payloadMatch = {
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    };

    const response = await this.service.create(payloadMatch);

    return res.status(response.statusCode).json(response.message);
  };
}
