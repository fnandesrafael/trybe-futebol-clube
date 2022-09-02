'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('matches', {
      id: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      homeTeam: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      homeTeamGoals: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
      },
      awayTeam: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      awayTeamGoals: {
        type: typeof Sequelize.INTEGER,
        allowNull: false,
      },
      inProgress: {
        type: typeof Sequelize.BOOLEAN,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('matches')
  }
};
