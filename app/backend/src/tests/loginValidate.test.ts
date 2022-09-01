import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs'

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import UserService from '../services/UserService';
import UserController from '../controllers/UserController';
import Jwt from '../utils/Jwt';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a requisição GET/login/validate', () => {
  describe('quando a requisição é feita e não existe um header de authorization', () => {
    it('é retornado um status 404', async () => {
      const sut = await chai.request(app).get('/login/validate')

      expect(sut.status).to.be.equal(404)
    })
    it('é retornado um objeto com a chave "message"', async () => {
      const sut = await chai.request(app).get('/login/validate')

      expect(sut.body).to.have.all.keys('message')
    })
    it('a chave "message" possui o valor: "Authorization token was not found"', async () => {
      const sut = await chai.request(app).get('/login/validate')

      expect(sut.body.message).to.be.equal('Authorization token was not found')
    })
  })

  describe('quando a requisição é feita e existe um token inválido', () => {
    const payload = {
      email: 'teste@teste.com',
      password: 'secret_teste',
    }
    const mockedUser = {
      id: 1,
      email: 'teste@teste.com',
      password: 'secret_teste',
      role: 'teste'
    }
    const wrongToken = 'wR0nGT0k3N'

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mockedUser as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Jwt, 'authJwt').returns(false)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 401', async () => {
      await chai.request(app).post('/login').send(payload)
      const sut = await chai.request(app).get('/login/validate').set('authorization', wrongToken)

      expect(sut.status).to.be.equal(401)
    })
    it('é retornado uma mensagem com o texto "Invalid token was provided"', async () => {
      await chai.request(app).post('/login').send(payload)
      const sut = await chai.request(app).get('/login/validate').set('authorization', wrongToken)

      expect(sut.body.message).to.be.equal('Invalid token was provided')
    })
  })

  describe('quando a requisição é feita e existe um token válido', () => {
    const payload = {
      email: 'teste@teste.com',
      password: 'secret_teste',
    }
    const mockedUser = {
      id: 1,
      email: 'teste@teste.com',
      password: 'secret_teste',
      role: 'teste'
    }
    const decodedMock = {
      id: 1,
      email: 'teste@teste.com',
      iat: 0,
      exp: 0
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mockedUser as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
      sinon.stub(Jwt, 'authJwt').returns(decodedMock)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um status 200', async () => {
      const loginResponse = await chai.request(app).post('/login').send(payload)
      const { token } = loginResponse.body
      const sut = await chai.request(app).get('/login/validate').set('authorization', token)

      expect(sut.status).to.be.equal(200)
    })
    it('é retornado um objeto"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(payload)
      const { token } = loginResponse.body
      const sut = await chai.request(app).get('/login/validate').set('authorization', token)

      expect(sut).to.be.a('object')
    })
    it('o objeto contém a chave "role"', async () => {
      const loginResponse = await chai.request(app).post('/login').send(payload)
      const { token } = loginResponse.body
      const sut = await chai.request(app).get('/login/validate').set('authorization', token)

      expect(sut.body).to.have.all.keys('role')
    })
    it('a chave role é do tipo string', async () => {
      const loginResponse = await chai.request(app).post('/login').send(payload)
      const { token } = loginResponse.body
      const sut = await chai.request(app).get('/login/validate').set('authorization', token)

      expect(sut.body.role).to.be.a('string')
    })
  })
})
