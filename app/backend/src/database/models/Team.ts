import { DataTypes, Model } from 'sequelize';
import db from '.';

class Team extends Model {
  public id: number;
  public team_name: string;
}

Team.init({
  id: {
    type: typeof DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  team_name: {
    type: typeof DataTypes.STRING,
    allowNull: false,
  }
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default Team;
