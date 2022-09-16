import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IMatches from '../interfaces/IMatches';
import ILeaderboard from '../interfaces/ILeaderboard';

const AUX: string[] = [];

const calcVictories = (acc: ILeaderboard) => ({
  ...acc,
  totalPoints: acc.totalPoints + 3,
  totalVictories: acc.totalVictories + 1,
  totalGames: acc.totalGames + 1,
});

const calcDraws = (acc: ILeaderboard) => ({
  ...acc,
  totalPoints: acc.totalPoints + 1,
  totalDraws: acc.totalDraws + 1,
  totalGames: acc.totalGames + 1,
});

const calcLosses = (acc: ILeaderboard) => ({
  ...acc,
  totalLosses: acc.totalLosses + 1,
  totalGames: acc.totalGames + 1,
});

const calcGoalsFavor = (acc: ILeaderboard, cur: Match) => ({
  goalsFavor: acc.goalsFavor + cur.homeTeamGoals,
});

const calcGoalsOwn = (acc: ILeaderboard, cur: Match) => ({
  goalsOwn: acc.goalsOwn + cur.awayTeamGoals,
});

const calcTotalResults = (teamId: number, matches: Match[]) => matches.reduce((acc, cur) => {
  if (teamId === cur.homeTeam) {
    if (cur.homeTeamGoals > cur.awayTeamGoals) {
      return { ...calcVictories(acc), ...calcGoalsFavor(acc, cur), ...calcGoalsOwn(acc, cur) };
    } if (cur.homeTeamGoals === cur.awayTeamGoals) {
      return { ...calcDraws(acc), ...calcGoalsFavor(acc, cur), ...calcGoalsOwn(acc, cur) };
    } return { ...calcLosses(acc), ...calcGoalsFavor(acc, cur), ...calcGoalsOwn(acc, cur) };
  }
  return acc;
}, {
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
});

const sortLeaderboard = (result: ILeaderboard[]) => result.sort((b, a) => {
  let sort = a.totalPoints - b.totalPoints;
  if (sort === 0) {
    sort = a.totalVictories - b.totalVictories;
    if (sort === 0) {
      sort = a.goalsBalance - b.goalsBalance;
      if (sort === 0) {
        sort = a.goalsFavor - b.goalsFavor;
        if (sort === 0) {
          sort = a.goalsOwn - b.goalsOwn;
        }
      }
    }
  } return sort;
});

const filterLeaderboard = (homeTeams: Team[]) => homeTeams.filter((team) => {
  const teamAlreadyExists = AUX.includes(team.teamName);

  if (!teamAlreadyExists) {
    AUX.push(team.teamName);
    console.log(AUX);
    return true;
  }
  return false;
});

export default class LeaderboardService {
  public getAllHome = async () => {
    const matches = await Match.findAll({ where: { inProgress: false },
      include: [{ model: Team, as: 'teamHome' }, { model: Team, as: 'teamAway' }],
    });
    const homeTeams = matches.map((match) => {
      const curMatch = match as IMatches;
      return { id: curMatch.homeTeam, teamName: curMatch.teamHome.teamName } as Team;
    });
    const filteredHomeTeams = filterLeaderboard(homeTeams);
    const result = filteredHomeTeams.map((homeTeam) => {
      const homeResults = calcTotalResults(homeTeam.id, matches);
      return { name: homeTeam.teamName,
        ...homeResults,
        goalsBalance: (homeResults.goalsFavor - homeResults.goalsOwn),
        efficiency: Number(((homeResults.totalPoints / (homeResults.totalGames * 3)) * 100)
          .toFixed(2)),
      };
    });
    return { statusCode: 200, message: sortLeaderboard(result) };
  };
}
