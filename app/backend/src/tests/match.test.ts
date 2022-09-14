import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs'

import { app } from '../app';
import Match from '../database/models/Match';

import { Response } from 'superagent';
import User from '../database/models/User';

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

  describe('quando uma requisição é feita na rota GET/matches e é passado a query "inProgress" como "true"', () => {
    beforeEach(() => {
      sinon.stub(Match, 'findAll').resolves([
            {
              id: 1,
              homeTeam: 1,
              homeTeamGoals: 10,
              awayTeam: 2,
              awayTeamGoals: 0,
              inProgress: 1,
              teamHome: {
                teamName: "Santa Cruz"
              },
              teamAway: {
                teamName: "Sport"
              }
            }
          ] as any)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/matches').query({inProgress: 'true'})

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado um array de objetos', async () => {
      const sut = await chai.request(app).get('/matches?inProgress=true')

      expect(sut.body).to.be.a('array')
      expect(sut.body[0]).to.be.a('object')
    })
    it('todos os objetos possuem o valor "1" na chave inProgress', async () => {
      const sut = await chai.request(app).get('/matches').query({inProgress: 'true'})

      for (let i = 0; i < sut.body.length; i += 1) {
        expect(sut.body[i].inProgress).to.be.equal(1)
      }
    })
  })

  describe('quando uma requisição é feita na rota GET/matches e é passado a query "inProgress" como "false"', () => {
    beforeEach(() => {
      sinon.stub(Match, 'findAll').resolves([
            {
              id: 1,
              homeTeam: 1,
              homeTeamGoals: 10,
              awayTeam: 2,
              awayTeamGoals: 0,
              inProgress: 0,
              teamHome: {
                teamName: "Santa Cruz"
              },
              teamAway: {
                teamName: "Sport"
              }
            }
          ] as any)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/matches').query({inProgress: 'false'})

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado um array de objetos', async () => {
      const sut = await chai.request(app).get('/matches?inProgress=true')

      expect(sut.body).to.be.a('array')
      expect(sut.body[0]).to.be.a('object')
    })
    it('todos os objetos possuem o valor "0" na chave inProgress', async () => {
      const sut = await chai.request(app).get('/matches').query({inProgress: 'false'})

      for (let i = 0; i < sut.body.length; i += 1) {
        expect(sut.body[i].inProgress).to.be.equal(0)
      }
    })
  })

  describe('quando é feita uma requisiçáo do tipo POST/matches com dois times iguais', () => {
    const payload = {
      homeTeam: 1,
      awayTeam: 1,
      homeTeamGoals: 2,
      awayTeamGoals: 0,
      inProgress: true
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves({
        id: 1,
        username: 'Teste',
        email: 'teste@teste.com',
        password: 'secret_teste'
      } as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 401', async () => {
      const loginResponse = await chai.request(app).post('/login').send({email: 'teste@teste.com', password: 'secret_teste'})
      const { token } = loginResponse.body
      const sut = await chai.request(app).post('/matches').send(payload).set('authorization', token)

      expect(sut.status).to.be.equal(401)
    })
    it('é retornado um objeto com a chave "message"', async () => {
      const loginResponse = await chai.request(app).post('/login').send({email: 'teste@teste.com', password: 'secret_teste'})
      const { token } = loginResponse.body
      const sut = await chai.request(app).post('/matches').send(payload).set('authorization', token)

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
    })
    it('a chave "message" possui o valor: It is not possible to create a match with two equal teams', async () => {
      const loginResponse = await chai.request(app).post('/login').send({email: 'teste@teste.com', password: 'secret_teste'})
      const { token } = loginResponse.body
      const sut = await chai.request(app).post('/matches').send(payload).set('authorization', token)

      expect(sut.body.message).to.be.equal('It is not possible to create a match with two equal teams')
    })
  })

  describe('quando é feita uma requisiçáo do tipo POST/matches com sucesso', () => {
    const payload = {
      homeTeam: 1,
      awayTeam: 2,
      homeTeamGoals: 2,
      awayTeamGoals: 0,
      inProgress: true
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves({
        id: 1,
        username: 'Teste',
        email: 'teste@teste.com',
        password: 'secret_teste'
      } as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Match, 'create').resolves({ id: 1, ...payload } as Match)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 201', async () => {
      const loginResponse = await chai.request(app).post('/login').send({email: 'teste@teste.com', password: 'secret_teste'})
      const { token } = loginResponse.body
      const sut = await chai.request(app).post('/matches').send(payload).set('authorization', token)

      expect(sut.status).to.be.equal(201)
    })
    it('é retornado um objeto com as chaves "id", "homeTeam", "homeTeamGoals", "awayTeam", "awayTeamGoals", "inProgress"', async () => {
      const loginResponse = await chai.request(app).post('/login').send({email: 'teste@teste.com', password: 'secret_teste'})
      const { token } = loginResponse.body
      const sut = await chai.request(app).post('/matches').send(payload).set('authorization', token)

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress')
    })
  })

  describe('quando é feita uma requisição do tipo PATCH/matches/:id/finish com sucesso', () => {    
    const mockedUser = {email: 'teste@teste.com', password: 'secret_password'}
    
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mockedUser as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Match, 'update').resolves([1] as any)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado um status 200', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id/finish`)
        .set('authorization', token)
        .query({id: 1})

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado uma um objeto com a mensagem "Finished"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id/finish`)
        .set('authorization', token)
        .query({id: 1})

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
      expect(sut.body.message).to.be.equal('Finished')
    })
  })

  describe('quando é feita uma requisição do tipo PATCH/matches/:id/finish mas a partida já foi finalizada', () => {    
    const mockedUser = {email: 'teste@teste.com', password: 'secret_password'}
    
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mockedUser as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Match, 'update').resolves([0] as any)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado um status 400', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id/finish`)
        .set('authorization', token)
        .query({id: 1})

      expect(sut.status).to.be.equal(400)
    })
    it('é retornado uma um objeto com a mensagem "Match is already finished"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id/finish`)
        .set('authorization', token)
        .query({id: 1})

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
      expect(sut.body.message).to.be.equal('Match is already finished')
    })
  })

  describe('quando é feita uma requisição do tipo PATCH/matches/:id com suceso', () => {
    const mockedUser = {email: 'teste@teste.com', password: 'secret_password'}
    const mockedScore = {homeTeamGoals: 5, awayTeamGoals: 2}
    
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mockedUser as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Match, 'update').resolves([1] as any)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 200', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id`)
        .set('authorization', token)
        .query({id: 1})
        .send(mockedScore)

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado um objeto com a chave "actualScore"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id`)
        .set('authorization', token)
        .query({id: 1})
        .send(mockedScore)

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('actualScore')
    })
    it('a chave "actualScore" é um objeto com as chaves "homeTeamGoals" e "awayTeamGoals"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id`)
        .set('authorization', token)
        .query({id: 1})
        .send(mockedScore)

      expect(sut.body.actualScore).to.be.a('object')
      expect(sut.body.actualScore).to.have.all.keys('homeTeamGoals', 'awayTeamGoals')
    })
  })

  describe('quando é feita uma requsiição do tipo PATCH/matches/:id sem sucesso', () => {
    const mockedUser = {email: 'teste@teste.com', password: 'secret_password'}
    const mockedScore = {homeTeamGoals: 5, awayTeamGoals: 2}
    
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mockedUser as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Match, 'update').resolves([0] as any)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 400', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id`)
        .set('authorization', token)
        .query({id: 1})
        .send(mockedScore)

      expect(sut.status).to.be.equal(400)
    })
    it('é retornado um objeto com a chave "message"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id`)
        .set('authorization', token)
        .query({id: 1})
        .send(mockedScore)

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
    })
    it('a chave "message" possui o valor "Bad request"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(mockedUser)
      const {token} = loginResponse.body

      const sut = await chai.request(app).patch(`/matches/:id`)
        .set('authorization', token)
        .query({id: 1})
        .send(mockedScore)

      expect(sut.body.message).to.be.a('string')
      expect(sut.body.message).to.be.equal('Bad request')
    })
  })
});
