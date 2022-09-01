'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Match', {
      id: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      home_team: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      home_team_goals: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
      },
      away_team: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      away_team_goals: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
      },
      in_progress: {
        type: typeof Sequelize.BOOLEAN,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Match')
  }
};
