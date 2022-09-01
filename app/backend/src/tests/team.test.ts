import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/Team';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa todas as requisições da rota /teams', () => {
  describe('quando é feito uma requisição na rota GET/teams, mas não existem dados no banco', () => {
    beforeEach(() => {
      sinon.stub(Team, 'findAll').resolves([])
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 404', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.status).to.be.equal(404)
    })
    it('é retornado um objeto com a chave: "message"', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
    })
    it('a chave "message" possui o valor: "No teams were found"', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.body.message).to.be.equal('No teams were found')
    })
  })

  describe('quando é feito uma requisição na rota GET/teams, e existem dados no banco', () => {
    beforeEach(() => {
      sinon.stub(Team, 'findAll').resolves([{
        id: 1,
        team_name: 'Santa Cruz'
      }as Team])
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.status).to.be.equal(200)
    })   
    it('é retornado um array', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.body).to.be.a('array')
    })
    it('é retornado um array de objetos', async () => {
      const sut = await chai.request(app).get('/teams')
      
      expect(sut.body[0]).to.be.a('object')
    })
    it('os objetos dentro do array possuem as propriedades "id" e "team_name"', async () => {
      const sut = await chai.request(app).get('/teams')
      
      expect(sut.body[0]).to.have.all.keys('id', 'team_name')
    })
  })

  describe('quando é feita uma requisição na rota GET/teams/:id, e o id passado não existe no BD', () => {
    beforeEach(() => {
      sinon.stub(Team, 'findByPk').resolves(null)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 404', async () => {
      const sut = await chai.request(app).get('/teams/:id').query({id: 1})

      expect(sut.status).to.be.equal(404)
    })
    it('é retornado um objeto com a chave "message"', async () => {
      const sut = await chai.request(app).get('/teams/:id').query({id: 1})

      expect(sut.body).to.be.a('object')
      expect(sut.body).to.have.all.keys('message')
    })
    it('a chave "message" possui o valor: "No teams were found with the id provided"', async () => {
      const sut = await chai.request(app).get('/teams/:id').query({id: 1})

      expect(sut.body.message).to.be.equal('No teams were found with the id provided')
    })
  })

  describe('quando é feito uma requisição na rota GET/teams/:id, e o id passado existe no BD', () => {
    const mock = {
      id: 1,
      team_name: 'Santa Cruz'
    }
    
    beforeEach(() => {
      sinon.stub(Team, 'findByPk').resolves(mock as Team)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).get('/teams/:id').query({id: 1})

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado um único objeto', async () => {
      const sut = await chai.request(app).get('/teams/:id').query({id: 1})
      
      expect(sut.body).to.be.a('object')
    })
    it('o objeto retornado possui as chaves "id" e "team_name"', async () => {
      const sut = await chai.request(app).get('/teams/:id').query({id: 1})

      expect(sut.body).to.have.all.keys('id', 'team_name')
    })
  })
});
