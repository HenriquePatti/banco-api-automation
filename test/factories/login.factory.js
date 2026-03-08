const { requireEnv } = require('../utils/env');

const loginPayload = (overrides = {}) => {
  return {
    username: requireEnv('TEST_USERNAME'),
    senha: requireEnv('TEST_SENHA'),
    ...overrides
  };
};

module.exports = { loginPayload };