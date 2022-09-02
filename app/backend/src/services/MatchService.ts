import Team from '../database/models/Team';
import Match from '../database/models/Match';

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
}
