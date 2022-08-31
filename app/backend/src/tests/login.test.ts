import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs'

import { app } from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import UserService from '../services/UserService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a requisição POST/login', () => {
  describe('quando o usuário que faz login, não existe no BD', () => {
    const mock = {
      email: "teste@teste",
      password: "secret_teste"
    }
    
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(null)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado uma mensagem com o texto: "Incorrect email or password"', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body.message).to.be.equal('Incorrect email or password')
    });
    it('é retornado um status 401', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.status).to.be.equal(401)
    })
  });

  describe('quando o usuário não informa email ou senha', () => {
    const mock = {}
    
    it('é retornado a mensagem: "All fields must be filled"', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body.message).to.be.equal('All fields must be filled')
    })
    it('é retornado um status 400', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.status).to.be.equal(400)
    })
  })

  describe('quando o usuário que faz login existe no BD, mas suas credenciais estão incorretas', () => {
    const mock = {
      email: "teste@teste",
      password: "wrong_secret"
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves({
        email: "teste@teste",
        password: "correct_secret"
      } as User)
      sinon.stub(bcrypt, 'compare').resolves(false)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado uma mensagem com o texto: "Incorrect email or password"', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body.message).to.be.equal('Incorrect email or password')
    })
    it('é retornado um status 401', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.status).to.be.equal(401)
    })
  });

  describe('quando o usuário que faz login existe no BD, e suas credenciais estão corretas', () => {
    const mock = {
      email: "teste@teste",
      password: "corret_secret"
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves({
        email: "teste@teste",
        password: "correct_secret"
      } as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado uma objeto', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body).to.be.a('object')
    })
    it('o objeto retornado possui a chave "token", e seu valor é uma string', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body).to.have.all.keys('token')
      expect(sut.body.token).to.be.a('string')
    })
    it('é retornado um status 200', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.status).to.be.equal(200)
    })
  });
})
