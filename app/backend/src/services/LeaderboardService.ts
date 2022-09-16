import Team from '../database/models/Team';
import Match from '../database/models/Match';
import IMatches from '../interfaces/IMatches';
import ILeaderboard from '../interfaces/ILeaderboard';

let HOME_AUX: string[] = [];
let AWAY_AUX: string[] = [];

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

const calcHomeGP = (acc: ILeaderboard, cur: Match) => ({
  goalsFavor: acc.goalsFavor + cur.homeTeamGoals,
});

const calcAwayGP = (acc: ILeaderboard, cur: Match) => ({
  goalsFavor: acc.goalsFavor + cur.awayTeamGoals,
});

const calcHomeGC = (acc: ILeaderboard, cur: Match) => ({
  goalsOwn: acc.goalsOwn + cur.awayTeamGoals,
});

const calcAwayGC = (acc: ILeaderboard, cur: Match) => ({
  goalsOwn: acc.goalsOwn + cur.homeTeamGoals,
});

const calcTotalHomeResults = (teamId: number, matches: Match[]) => matches.reduce((acc, cur) => {
  if (teamId === cur.homeTeam) {
    if (cur.homeTeamGoals > cur.awayTeamGoals) {
      return { ...calcVictories(acc), ...calcHomeGP(acc, cur), ...calcHomeGC(acc, cur) };
    } if (cur.homeTeamGoals === cur.awayTeamGoals) {
      return { ...calcDraws(acc), ...calcHomeGP(acc, cur), ...calcHomeGC(acc, cur) };
    } return { ...calcLosses(acc), ...calcHomeGP(acc, cur), ...calcHomeGC(acc, cur) };
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

const calcTotalAwayResults = (teamId: number, matches: Match[]) => matches.reduce((acc, cur) => {
  if (teamId === cur.awayTeam) {
    if (cur.awayTeamGoals > cur.homeTeamGoals) {
      return { ...calcVictories(acc), ...calcAwayGP(acc, cur), ...calcAwayGC(acc, cur) };
    } if (cur.awayTeamGoals === cur.homeTeamGoals) {
      return { ...calcDraws(acc), ...calcAwayGP(acc, cur), ...calcAwayGC(acc, cur) };
    } return { ...calcLosses(acc), ...calcAwayGP(acc, cur), ...calcAwayGC(acc, cur) };
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
  }
  HOME_AUX = [];
  AWAY_AUX = [];
  return sort;
});

const filterLeaderboardHome = (teams: Team[]) => teams.filter((team) => {
  const teamAlreadyExists = HOME_AUX.includes(team.teamName);

  if (!teamAlreadyExists) {
    HOME_AUX.push(team.teamName);
    return true;
  }
  return false;
});

const filterLeaderboardAway = (teams: Team[]) => teams.filter((team) => {
  const teamAlreadyExists = AWAY_AUX.includes(team.teamName);

  if (!teamAlreadyExists) {
    AWAY_AUX.push(team.teamName);
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
    const filteredHomeTeams = filterLeaderboardHome(homeTeams);
    const result = filteredHomeTeams.map((homeTeam) => {
      const homeResults = calcTotalHomeResults(homeTeam.id, matches);
      return { name: homeTeam.teamName,
        ...homeResults,
        goalsBalance: (homeResults.goalsFavor - homeResults.goalsOwn),
        efficiency: Number(((homeResults.totalPoints / (homeResults.totalGames * 3)) * 100)
          .toFixed(2)),
      };
    });
    return { statusCode: 200, message: sortLeaderboard(result) };
  };

  public getAllAway = async () => {
    const matches = await Match.findAll({ where: { inProgress: false },
      include: [{ model: Team, as: 'teamHome' }, { model: Team, as: 'teamAway' }],
    });
    const awayTeams = matches.map((match) => {
      const curMatch = match as IMatches;
      return { id: curMatch.awayTeam, teamName: curMatch.teamAway.teamName } as Team;
    });
    const filteredAwayTeams = filterLeaderboardAway(awayTeams);
    const result = filteredAwayTeams.map((awayTeam) => {
      const awayResults = calcTotalAwayResults(awayTeam.id, matches);
      return { name: awayTeam.teamName,
        ...awayResults,
        goalsBalance: (awayResults.goalsFavor - awayResults.goalsOwn),
        efficiency: Number(((awayResults.totalPoints / (awayResults.totalGames * 3)) * 100)
          .toFixed(2)),
      };
    });
    return { statusCode: 200, message: sortLeaderboard(result) };
  };
}
