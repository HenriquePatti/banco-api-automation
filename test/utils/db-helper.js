// test/utils/db-helper.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true 
  });

  try {
    const sqlPath = path.join(__dirname, '../fixtures/reset.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);
    // O log de sucesso é bom para o desenvolvedor ver no terminal
    console.log('✅ Banco de dados resetado com sucesso!');
  } catch (error) {
    // 1. Logamos o erro detalhado para depuração
    console.error('❌ FALHA CRÍTICA NO RESET DO BANCO:', error.message);
    
    // 2. LANÇAMOS O ERRO: Isso garante que o teste que chamou essa função pare na hora
    throw new Error(`Não foi possível preparar o ambiente de teste: ${error.message}`);
  } finally {
    await connection.end();
  }
}

module.exports = { resetDatabase };