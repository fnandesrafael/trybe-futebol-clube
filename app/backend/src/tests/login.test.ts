import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs'

import { app } from '../app';
// import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import User from '../database/models/User';

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
    
    it('é retornado uma mensagem com o texto: "User not found"', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body).to.be.equal('User not found')
    });
    it('é retornado um status 404', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.status).to.be.equal(404)
    })
  });

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
    
    it('é retornado uma mensagem com o texto: "Invalid credentials"', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.body).to.be.equal('Invalid credentials')
    })
    it('é retornado um status 403', async () => {
      const sut = await chai.request(app).post('/login').send(mock)

      expect(sut.status).to.be.equal(403)
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
    it('o objeto retornado possui a chave token, e seu valor é uma string', async () => {
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
