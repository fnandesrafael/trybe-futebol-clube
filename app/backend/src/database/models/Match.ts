import { DataTypes, Model } from "sequelize/types";
import db from '.'
import Team from "./Team";

class Match extends Model {
  public id: number;
  public home_team: number;
  public home_team_goals: number;
  public away_team: number;
  public away_team_goals: number;
  public in_progress: boolean
}

Match.init({
  id: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  home_team: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  home_team_goals: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  away_team: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  away_team_goals: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
  },
  in_progress: {
    type: typeof DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false
})

Team.belongsTo(Match, { foreignKey: 'home_team', as: 'team_name' })
Team.belongsTo(Match, { foreignKey: 'away_team', as: 'team_name' })

export default Match