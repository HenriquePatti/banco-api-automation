require('dotenv').config();
const { expect } = require('chai');

const requireEnv = (name)=> {
    const envName = process.env[name];
    expect(envName, `${name} não encontrado ou não informado no arquivo .env`).to.be.a('string') 
        .and.not.empty;
    return envName
};

module.exports = { 
    requireEnv
};