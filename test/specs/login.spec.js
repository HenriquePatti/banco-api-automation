require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const { resetDatabase } = require('../utils/db-helper');


describe('Login', () => {
    describe('POST /login', () => {
        beforeEach( ()=> {
            resetDatabase();
        });

        it('Deve retornar 200 - login com suceso', async () => {
            const response = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send( { "username": process.env.TEST_USERNAME, "senha": process.env.TEST_SENHA} );
            
            // valida status code e headers
            expect(response.status).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            // valida tipo de dados e se token possui tamanho maior que 0
            expect(response.body).to.be.an('object');
            expect(response.body.token).to.be.a('string')
                .and.to.have.length.greaterThan(0);            
        });
    });
    
})
