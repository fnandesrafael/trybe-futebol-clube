import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App, app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a inicialização do servidor pela rota /', () => { 
  describe('quando há uma requisição GET/', () => {
    it('é retornado um objeto', async () => {
      const sut = await chai.request(app).get('/')

      expect(sut.body).to.be.a('object')
    });
    it('o objeto retornado possui a chave "ok" e seu valor é "true"', async () => {
      const sut = await chai.request(app).get('/')

      expect(sut.body).to.have.all.keys('ok')
      expect(sut.body.ok).to.be.equal(true)
    });
  })
});
