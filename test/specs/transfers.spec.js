const request = require('supertest');
const { expect } = require('chai');
const { resetDatabase } = require('../utils/db-helper');
const { requireEnv } = require('../utils/env');
const { obtainToken } = require('../utils/auth');
const { transferPayload } = require('../factories/transfers.factory');
const { removeField } = require('../helpers/remove-field');

describe('Transferências', () => {
  describe('POST /transferencias', () => {
    const BASE_URL = requireEnv('BASE_URL');
    let token;

    beforeEach(async () => {
      await resetDatabase();
      token = await obtainToken();
    });

    describe('transferências com valor mínimo e máximo sem token adicional', () => {
      const valuesMinMax = [
        { name: 'valor mínimo de R$ 10', payload: transferPayload({ valor: 10 }) },
        { name: 'valor de R$ 2500', payload: transferPayload({ valor: 2500 }) },
        { name: 'valor máximo de R$ 5000', payload: transferPayload({ valor: 5000 }) }
      ];

      valuesMinMax.forEach(({ name, payload }) => {
        it(`deve realizar transferência com ${name}`, async () => {
          const response = await request(BASE_URL)
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);

          expect(response.status).to.equal(201);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

    describe('transferências com valores menores que R$ 10 não são permitidas', () => {
      const valuesInvalids422 = [
        { name: 'valor informado é R$ 9.99', payload: transferPayload({ valor: 9.99 }) },
        { name: 'valor informado é R$ 0', payload: transferPayload({ valor: 0 }) },
        { name: 'valor informado é R$ -1', payload: transferPayload({ valor: -1 }) }
      ];

      valuesInvalids422.forEach(({ name, payload }) => {
        it(`deve retornar 422 quando ${name}`, async () => {
          const response = await request(BASE_URL)
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);

          expect(response.status).to.equal(422);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

    describe('transferências com valores acima de R$ 5000 sem token adicional não são permitidas', () => {
      it('deve retornar 403 quando o valor for maior que R$ 5000 sem token adicional', async () => {
        const payload = transferPayload({ valor: 5000.1 });

        const response = await request(BASE_URL)
          .post('/transferencias')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(payload);

        expect(response.status).to.equal(403);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.be.a('string').and.to.not.be.empty;
      });
    });

    describe('transferências com campos obrigatórios ausentes', () => {
      const missingRequiredFields400 = [
        {
          name: 'contaOrigem',
          payload: () => removeField(transferPayload(), 'contaOrigem')
        },
        {
          name: 'contaDestino',
          payload: () => removeField(transferPayload(), 'contaDestino')
        },
        {
          name: 'valor',
          payload: () => removeField(transferPayload(), 'valor')
        }
      ];

      missingRequiredFields400.forEach(({ name, payload }) => {
        it(`deve retornar 400 quando o parametro ${name} não for informado`, async () => {
          const response = await request(BASE_URL)
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(payload());

          expect(response.status).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

  });
});