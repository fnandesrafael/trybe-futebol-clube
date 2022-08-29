import * as sinon from 'sinon';
import * as chai from 'chai';

import User from '../../database/models/User';

const { expect } = chai;

describe('Testa a model User', () => {
  describe('quando não existem usuários cadastrados no BD', () => {
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(null)
    })
  
    afterEach(() => {
      sinon.restore()
    })
  
    it('retorna null', async () => {
      const sut = await User.findOne({ where: { email: 'teste@teste.com' } })
      console.log(sut)

      expect(sut).to.be.equal(null)
    });
  });
  describe('quando existem usuários cadastrados no BD', () => { 
    const mock = {
      id: 1,
      username: 'User',
      role: 'user',
      email: 'user@user.com',
      password: 'user_password'
    }
    
    beforeEach(() => {
      sinon.stub(User, 'findOne').resolves(mock as User)
    })
  
    afterEach(() => {
      sinon.restore()
    })

    it('retorna um único objeto', async () => {
      const sut = await User.findOne({ where: { email: 'user@user.com' } })
      
      expect(sut).to.be.a('object')
    })
    it('o objeto retornado contém as chaves: id, username, role, email e password', async () => {
      const sut = await User.findOne({ where: { email: 'user@user.com' } })
      
      expect(sut).to.have.all.keys('id', 'username', 'role', 'email', 'password')
    })
   })
})
