create table gerente(
    matricula_ger VARCHAR(20) primary key
);

create table administrador(
    matricula_admin VARCHAR(20) primary key
);

create table usuario(
    matricula VARCHAR(20) primary key,
    nome VARCHAR(255) not null,
    senha varchar(50) not null,
    matricula_ger VARCHAR(20),
    ano VARCHAR(2),
    foreign key (matricula_ger) references gerente(matricula_ger)
);

create table conteudo(
    id_cont SERIAL primary key,
    titulo VARCHAR(255) not null,
    tipo VARCHAR(255),
    genero VARCHAR(255),
    matricula_ger VARCHAR(20),
    url VARCHAR(1000),
    trailer VARCHAR(1000),
    resenha VARCHAR(1000),
    descricao TEXT,
    plataformas TEXT,
    temas TEXT,
    foreign key (matricula_ger) references gerente(matricula_ger)
);

CREATE TABLE chat (
    id_chat SERIAL PRIMARY KEY,
    matricula_admin VARCHAR(20) NOT NULL UNIQUE,
    matricula_ger VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (matricula_ger) REFERENCES gerente(matricula_ger),
    FOREIGN KEY (matricula_admin) REFERENCES administrador(matricula_admin)
);

CREATE TABLE mensagens (
    id_msg SERIAL PRIMARY KEY,
    id_chat INT NOT NULL,
    remetente VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_chat) REFERENCES chat(id_chat)
);