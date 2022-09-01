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

    it('é retornado um array', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.body).to.be.a('array')
    })
    it('o array é vazio', async () => {
      const sut = await chai.request(app).get('/teams')

      expect(sut.body[0]).to.be.equal(undefined)
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

});
