import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
import UserService from '../../services/UserService';
import User from '../../database/models/User';

const { expect } = chai;

describe('Testa a camada userService', () => {
  describe('quando o usuário não existe no BD', () => {
    const mock = {
      message: 'User not found',
      statusCode: 404,
    }

    const payloadUser = {
      email: 'teste@teste.com',
      password: 'teste_teste'
    }
    
    beforeEach(() => {
      sinon.stub(new UserService(), 'login').resolves(mock)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('é retornado um objeto', async () => {
      const sut = new UserService()

      expect(await sut.login(payloadUser)).to.be.a('object');
    });
    it('o objeto contém as chaves: message e statusCode', async () => {
      const sut = new UserService()

      expect(await sut.login(payloadUser)).to.have.all.keys('message', 'statusCode')
    })
    it('a chave message contém uma string com valor: "User not found"', async () => {
      const sut = await new UserService().login(payloadUser)

      expect(sut.message).to.be.a('string')
      expect(sut.message).to.be.equal('User not found')
    })
    it('a chave statusCode contém um número com valor: "404"', async () => {
      const sut = await new UserService().login(payloadUser)

      expect(sut.statusCode).to.be.a('number')
      expect(sut.statusCode).to.be.equal(404)
    })
  });

  describe('quando o usuário está cadastrado no BD e a senha está correta', () => {
    const mock = {
      id: 1,
      username: 'Teste',
      role: 'role',
      email: 'teste@teste.com',
      password: 'teste_teste'
    }

    const payloadUser = {
      email: 'teste@teste.com',
      password: 'teste_teste'
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mock as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado um objeto com as chaves message e statusCode', async () => {
      const sut = await new UserService().login(payloadUser)
      
      expect(sut).to.be.a('object')
      expect(sut).to.have.all.keys('message', 'statusCode')
    })
    it('a chave message é um objeto com a chave token', async () => {
      const sut = await new UserService().login(payloadUser)
      
      expect(sut.message).to.be.a('object')
      expect(sut.message).to.have.all.keys('token')
    })
    it('a chave statusCode é um número com o valor 200', async () => {
      const sut = await new UserService().login(payloadUser)
      
      expect(sut.statusCode).to.be.a('number')
      expect(sut.statusCode).to.be.equal(200)
    })
  })

  describe('quando o usuário está cadastrado no BD e a senha está incorreta', () => {
    const mock = {
      id: 1,
      username: 'Teste',
      role: 'role',
      email: 'teste@teste.com',
      password: 'teste_teste'
    }

    const payloadUser = {
      email: 'teste@teste.com',
      password: 'teste_'
    }

    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mock as User)
      sinon.stub(bcrypt, 'compare').resolves(false)
    })

    afterEach(() => {
      sinon.restore()
    })
    
    it('é retornado um objeto com as chaves message e statusCode', async () => {
      const sut = await new UserService().login(payloadUser)
      
      expect(sut).to.be.a('object')
      expect(sut).to.have.all.keys('message', 'statusCode')
    })
    it('a chave message é uma string e contém o valor "Invalid credentials"', async () => {
      const sut = await new UserService().login(payloadUser)
      
      expect(sut.message).to.be.a('string')
      expect(sut.message).to.be.equal('Invalid credentials')
    })
    it('a chave statusCode é um número com o valor 403', async () => {
      const sut = await new UserService().login(payloadUser)
      
      expect(sut.statusCode).to.be.a('number')
      expect(sut.statusCode).to.be.equal(403)
    })
  })
})
