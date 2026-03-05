const request = require('supertest');
const { expect } = require('chai');
const { resetDatabase } = require('../utils/db-helper');
const { requireEnv } = require('../utils/env');


describe('Login', () => {
    describe('POST /login', () => {
        const BASE_URL = requireEnv('BASE_URL');
        const username = requireEnv('TEST_USERNAME');
        const senha = requireEnv('TEST_SENHA');

        beforeEach(() => {
            resetDatabase();
        });

        it('Deve retornar 200 - login com sucesso', async () => {
            const response = await request(BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ "username": username, "senha": senha });
            expect(response.status).to.equal(200);
        });

        it('Deve validar "Content-Type" e a presença de token', async ()=> {
            const response = await request(BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ "username": username, "senha": senha });
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.be.an('object');
            expect(response.body.token).to.be.a('string')
                .and.to.have.length.greaterThan(0);
        });
    });

});
