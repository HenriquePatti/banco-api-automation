const request = require('supertest');
const { requireEnv } = require('../utils/env');
const { loginPayload } = require('../factories/login.factory');

const obtainToken = async () => {
  const response = await request(requireEnv('BASE_URL'))
    .post('/login')
    .set('Content-Type', 'application/json')
    .send(loginPayload());

  if (response.status !== 200 || !response.body?.token) {
    throw new Error('Falha ao obter token de autenticação');
  };

  return response.body.token;
};

module.exports = {
  obtainToken
};