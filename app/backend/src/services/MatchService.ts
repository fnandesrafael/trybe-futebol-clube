import Team from '../database/models/Team';
import Match from '../database/models/Match';

export default class MatchService {
  public getAll = async () => {
    try {
      const matches = await Match.findAll({ include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ] });
      return { statusCode: 200, message: matches };
    } catch (err) {
      console.log(err);
      return { statusCode: 400, message: { message: 'Bad request' } };
    }
  };
}
