import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IPayloadMatch from '../interfaces/IPayloadMatch';
import TeamService from './TeamService';

export default class MatchService {
  public getAll = async () => {
    const matches = await Match.findAll({ include: [
      { model: Team, as: 'teamHome', attributes: ['teamName'] },
      { model: Team, as: 'teamAway', attributes: ['teamName'] },
    ] });

    if (matches.length > 0) {
      return { statusCode: 200, message: matches };
    } return { statusCode: 400, message: { message: 'Bad request' } };
  };

  public getByStatus = async (status: boolean) => {
    const matches = await Match.findAll({
      where: { inProgress: status },
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    return { statusCode: 200, message: matches };
  };

  public create = async (match: IPayloadMatch) => {
    if (match.homeTeam === match.awayTeam) {
      return { statusCode: 401,
        message: { message: 'It is not possible to create a match with two equal teams' } };
    }
    const validHomeTeam = await new TeamService().getOne(match.homeTeam);
    const validAwayTeam = await new TeamService().getOne(match.awayTeam);

    if (validHomeTeam.statusCode === 200 && validAwayTeam.statusCode === 200) {
      const newMatch = await Match.create(match);

      return { statusCode: 201, message: newMatch };
    } return { statusCode: 404, message: { message: 'There is no team with such id!' } };
  };
}
