INSERT INTO unidade (bloco, numero, numero_apto, ativo)
VALUES ('A', '101', '101', true);

INSERT INTO morador (nome, email, senha_hash, status, data_entrada, id_unidade)
VALUES (
  'Morador Teste',
  'morador@teste.com',
  '$2b$10$1JFGLKk4ZSYQ2RqLKimlh.qStO8QtH6/BPzA/IITrU93vJ2lOYrw6',
  'ATIVO',
  CURRENT_DATE,
  (SELECT id_unidade FROM unidade WHERE bloco='A' AND numero='101' LIMIT 1)
);