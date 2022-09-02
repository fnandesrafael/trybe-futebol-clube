import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa todas as requisições da rota /matches', () => {
  describe('quando uma requisição é feita na rota GET/matches, e não existem dados no BD', () => {
    beforeEach(() => {
      sinon.stub(Match, 'findAll').resolves([])
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado um status 400', async () => {
      const sut = await chai.request(app).get('/matches')

      expect(sut.status).to.be.equal(400)
    });
    it('é retornado no body um objeto com a chave "message"', async () => {
      const sut = await chai.request(app).get('/matches')

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
    });
    it('a chave message possui o valor: "Bad request"', async () => {
      const sut = await chai.request(app).get('/matches')

      expect(sut.body.message).to.be.equal('Bad request')
    });
  })

  describe('quando uma requisição é feita na rota GET/matches, e existem dados no BD', () => {    
    beforeEach(() => {
      sinon.stub(Match, 'findAll').resolves(
        [
          {
            id: 1,
            homeTeam: 1,
            homeTeamGoals: 100,
            awayTeam: 2,
            awayTeamGoals: 0,
            inProgress: true,
            teamHome: {
              teamName: 'Santa Cruz'
            },
            teamAway: {
              teamAway: 'Sport'
            }
          } as any,
          {
            id: 2,
            homeTeam: 2,
            homeTeamGoals: 0,
            awayTeam: 1,
            awayTeamGoals: 100,
            inProgress: true,
            teamAway: {
              teamAway: 'Sport'
            },
            teamHome: {
              teamName: 'Santa Cruz'
            }
          } as any,
        ]
      )
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/matches')

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado um array de objetos', async () => {
      const sut = await chai.request(app).get('/matches')

      expect(sut.body).to.be.a('array')
      expect(sut.body[0]).to.be.a('object')
    })
    it(`os objetos retornados possuem as chaves: "id", "homeTeam", "homeTeamGoals", "awayTeam",
    "awayTeamGoals", "inProgress", "teamHome" e "teamAway" `, async () => {
      const sut = await chai.request(app).get('/matches')

      expect(sut.body[0]).to.have.all.keys(
        'id',
        'homeTeam',
        'homeTeamGoals',
        'awayTeam',
        'awayTeamGoals',
        'inProgress',
        'teamHome',
        'teamAway'
      )
    })
  })
});
