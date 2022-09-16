import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa as requisições da rota /leaderboard', () => {
  describe('quando uma requisição do tipo GET/leaderboard/home é feita com sucesso', () => {
    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/leaderboard/home')

      expect(sut.status).to.be.equal(200)
    });
    it('é retornado um array', async () => {
      const sut = await chai.request(app).get('/leaderboard/home')

      expect(sut.body).to.be.a('array')
    })
    it('o array retornado, contém objetos da interface ILeaderboard', async () => {
      const sut = await chai.request(app).get('/leaderboard/home')

      expect(sut.body[0]).to.be.a('object')
      expect(sut.body[0]).to.have.all.keys(
        'name',
        'totalPoints',
        'totalGames',
        'totalVictories',
        'totalDraws',
        'totalLosses',
        'goalsFavor',
        'goalsOwn',
        'goalsBalance',
        'efficiency'
      )
    })
  })

  describe('quando uma requisição do tipo GET/leaderboard/away é feita com sucesso', () => {
    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/leaderboard/away')

      expect(sut.status).to.be.equal(200)
    });
    it('é retornado um array', async () => {
      const sut = await chai.request(app).get('/leaderboard/away')

      expect(sut.body).to.be.a('array')
    })
    it('o array retornado, contém objetos da interface ILeaderboard', async () => {
      const sut = await chai.request(app).get('/leaderboard/away')

      expect(sut.body[0]).to.be.a('object')
      expect(sut.body[0]).to.have.all.keys(
        'name',
        'totalPoints',
        'totalGames',
        'totalVictories',
        'totalDraws',
        'totalLosses',
        'goalsFavor',
        'goalsOwn',
        'goalsBalance',
        'efficiency'
      )
    })
  })
});
