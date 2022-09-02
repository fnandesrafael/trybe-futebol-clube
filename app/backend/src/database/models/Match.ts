import { DataTypes, Model } from 'sequelize';
import db from '.';
import Team from './Team';

class Match extends Model {
  public id!: number;
  public homeTeam!: number;
  public homeTeamGoals!: number;
  public awayTeam!: number;
  public inProgress!: number;
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

Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Match;
