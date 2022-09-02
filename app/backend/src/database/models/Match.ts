import { DataTypes, Model } from 'sequelize/types';
import db from '.';
import Team from './Team';

class Match extends Model {
  public id: number;
  public homeTeam: number;
  public homeTeamGoals: number;
  public awayTeam: number;
  public awayTeamGoals: number;
  public inProgress: boolean;
}

Match.init({
  id: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: typeof DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Match.hasMany(Team, { foreignKey: 'id', as: 'homeTeam' });
Match.hasMany(Team, { foreignKey: 'id', as: 'awayTeam' });
Team.belongsTo(Match, { foreignKey: 'id', as: 'homeTeam' });
Team.belongsTo(Match, { foreignKey: 'id', as: 'awayTeam' });

export default Match;
