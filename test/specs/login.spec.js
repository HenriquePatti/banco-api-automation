const request = require('supertest');
const { expect } = require('chai');
const { requireEnv } = require('../utils/env');
const { loginPayload } = require('../factories/login.factory');

describe('Login', () => {
  describe('POST /login', () => {
    const BASE_URL = requireEnv('BASE_URL');
    const validPayload = Object.freeze(loginPayload());

    it('deve autenticar com credenciais válidas e retornar token', async () => {
      const response = await request(BASE_URL)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(validPayload);

      expect(response.status).to.equal(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.be.an('object');
      expect(response.body.token).to.be.a('string').and.to.not.be.empty;
    });

    describe('Validação de nomes de campos inválidos', () => {
      const scenarios400InvalidFieldNames = [
        {
          name: 'campo username com nome inválido',
          payload: { user: validPayload.username, senha: validPayload.senha }
        },
        {
          name: 'campo senha com nome inválido',
          payload: { username: validPayload.username, pass: validPayload.senha }
        }
      ];

      scenarios400InvalidFieldNames.forEach(({ name, payload }) => {
        it(`deve retornar 400 ao enviar ${name}`, async () => {
          const response = await request(BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(payload);

          expect(response.status).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

    describe('Validação de campos obrigatórios', () => {
      it('deve retornar 400 ao enviar body vazio', async () => {
        const response = await request(BASE_URL)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({});

        expect(response.status).to.equal(400);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.be.a('string').and.to.not.be.empty;
      });

      it('deve retornar 400 ao enviar requisição sem body', async () => {
        const response = await request(BASE_URL)
          .post('/login')
          .set('Content-Type', 'application/json');

        expect(response.status).to.equal(400);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.be.a('string').and.to.not.be.empty;
      });

      const scenarios400MissingRequiredFields = [
        {
          field: 'username',
          payload: { senha: validPayload.senha }
        },
        {
          field: 'senha',
          payload: { username: validPayload.username }
        }
      ];

      scenarios400MissingRequiredFields.forEach(({ field, payload }) => {
        it(`deve retornar 400 ao omitir o campo ${field}`, async () => {
          const response = await request(BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(payload);

          expect(response.status).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

    describe('Validação de conteúdo obrigatório inválido', () => {
      const scenarios400InvalidContent = [
        {
          name: 'username vazio',
          payload: loginPayload({ username: '' })
        },
        {
          name: 'senha vazia',
          payload: loginPayload({ senha: '' })
        }
      ];

      scenarios400InvalidContent.forEach(({ name, payload }) => {
        it(`deve retornar 400 ao enviar ${name}`, async () => {
          const response = await request(BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(payload);

          expect(response.status).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

    describe('Validação de credenciais inválidas', () => {
      const scenarios401 = [
        {
          name: 'usuário inválido',
          payload: loginPayload({ username: 'invalid' })
        },
        {
          name: 'senha inválida',
          payload: loginPayload({ senha: 'invalid' })
        }
      ];

      scenarios401.forEach(({ name, payload }) => {
        it(`deve retornar 401 com ${name}`, async () => {
          const response = await request(BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(payload);

          expect(response.status).to.equal(401);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });

    describe('Validação de métodos não suportados', () => {
      const scenarios405 = ['get', 'put', 'patch', 'delete'];

      scenarios405.forEach((method) => {
        it(`deve retornar 405 ao utilizar o método ${method.toUpperCase()}`, async () => {
          const response = await request(BASE_URL)[method]('/login')
            .set('Content-Type', 'application/json')
            .send(validPayload);

          expect(response.status).to.equal(405);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.be.a('string').and.to.not.be.empty;
        });
      });
    });
  });
});