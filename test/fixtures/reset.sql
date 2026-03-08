-- test/fixtures/reset.sql

-- Desabilita verificações para limpar as tabelas com segurança
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transferencias;
SET FOREIGN_KEY_CHECKS = 1;

-- Define saldos fixos para as contas de teste (ID 1 e ID 2)
UPDATE contas SET saldo = 10000 WHERE id = 1;
UPDATE contas SET saldo = 10000 WHERE id = 2;