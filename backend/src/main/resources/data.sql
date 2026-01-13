CREATE SCHEMA IF NOT EXISTS condominio;
SET search_path TO condominio;

CREATE TABLE status_morador (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE cargo_funcionario (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE turno_funcionario (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE status_funcionario (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE espaco_reservavel (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(40) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE status_reserva (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE tipo_reclamacao (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE status_reclamacao (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE status_chamado (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE publico_alvo (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(40) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE status_visita (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE tipo_encomenda (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE status_encomenda (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------------

-- Tabela Unidade

CREATE TABLE IF NOT EXISTS unidade (
    id_unidade SERIAL PRIMARY KEY,
    bloco VARCHAR(10),
    andar INTEGER NOT NULL CHECK (andar >= 0),
    apartamento VARCHAR(10),
    vaga_garagem VARCHAR(20),
    UNIQUE (bloco, andar, numero_apto)
);

-- ----------------------------------------------------------------------------------

-- Tabela Morador

CREATE TABLE morador (
    id_morador SERIAL PRIMARY KEY,
    nome VARCHAR(120),
    data_nascimento DATE,
    email VARCHAR(120),
    telefone VARCHAR(20),
    senha_hash VARCHAR(255),
    status_id INTEGER NOT NULL REFERENCES status_morador(id),
    data_entrada DATE,
    id_unidade INTEGER NOT NULL REFERENCES unidade(id_unidade) ON DELETE RESTRICT
);

CREATE INDEX idx_morador_unidade ON morador(id_unidade);
CREATE INDEX idx_morador_status ON morador(status_id);

-- ----------------------------------------------------------------------------------

-- Tabela Síndico

CREATE TABLE sindico (
    id_sindico SERIAL PRIMARY KEY,
    id_morador INTEGER UNIQUE NOT NULL REFERENCES morador(id_morador) ON DELETE CASCADE,
    data_inicio_mandato DATE NOT NULL,
    data_fim_mandato DATE,
    status_mandato VARCHAR(20) NOT NULL,
    tipo_sindico VARCHAR(20) NOT NULL,
    permissoes TEXT,
    observacoes TEXT
);

-- ----------------------------------------------------------------------------------

-- Tabela Funcionário

CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email_corporativo VARCHAR(120) UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE NOT NULL,
    matricula_funcionario VARCHAR(30) UNIQUE NOT NULL,
    cargo_id INTEGER NOT NULL REFERENCES cargo_funcionario(id),
    turno_id INTEGER NOT NULL REFERENCES turno_funcionario(id),
    data_admissao DATE NOT NULL,
    status_id INTEGER NOT NULL REFERENCES status_funcionario(id),
    senha_hash VARCHAR(255) NOT NULL
);

CREATE INDEX idx_funcionario_cargo ON funcionario(cargo_id);
CREATE INDEX idx_funcionario_turno ON funcionario(turno_id);
CREATE INDEX idx_funcionario_status ON funcionario(status_id);
