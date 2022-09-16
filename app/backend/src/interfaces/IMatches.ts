import Team from '../database/models/Team';
import Match from '../database/models/Match';

interface IMatches extends Match {
  teamHome: Team,
  teamAway: Team
}

export default IMatches;
