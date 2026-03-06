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

        it('Deve validar "Content-Type" e a presença de token', async () => {
            const response = await request(BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ "username": username, "senha": senha });
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.be.an('object');
            expect(response.body.token).to.be.a('string')
                .and.to.have.length.greaterThan(0);
        });

        const scenarios400 = [
            { name: 'usuário', payload: { user: username, senha: senha } },
            { name: 'senha', payload: { username: username, pass: senha } }
        ];

        scenarios400.forEach((scenario) => {
            it(`Deve retornar 400 quando informado o parametro de [ ${scenario.name} ] inválido`, async () => {
                const response = await request(BASE_URL)
                    .post('/login')
                    .set('Content-Type', 'application/json')
                    .send(scenario.payload);
                expect(response.status).to.equal(400);
                expect(response.headers['content-type']).to.include('application/json');
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.be.a('string')
                    .and.to.not.empty;
            });
        });

        const scenarios401 = [
            { name: 'usuário inválido', payload: { username: 'invalid', senha: senha } },
            { name: 'senha inválida', payload: { username: username, senha: 'invalid' } }
        ]

        scenarios401.forEach((scenario) => {
            it(`Deve retornar 401 quando informado [ ${scenario.name} ]`, async () => {
                const response = await request(BASE_URL)
                    .post('/login')
                    .set('Content-Type', 'application/json')
                    .send(scenario.payload);
                expect(response.status).to.equal(401);
                expect(response.headers['content-type']).to.include('application/json');
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.be.a('string').and.to.not.be.empty;
            });
        });

        const scenarios405 = [ 'get', 'put', 'patch', 'delete' ];

        scenarios405.forEach((method) => {
            it(`Deve retornar 405 quando informado o método inválido [ ${method} ]`, async () => {
                const response = await request(BASE_URL)
                [method]('/login')
                    .set('Content-type', 'application/json')
                    .send({ username: username, senha: senha });
                expect(response.status).to.equal(405);
                expect(response.headers['content-type']).to.include('application/json');
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.be.a('string')
                    .and.to.be.not.empty;
            });
        });
    });

});
