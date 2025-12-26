create table gerente(
matricula_ger VARCHAR(20) primary key
);

create table usuario(
matricula VARCHAR(20) primary key,
nome VARCHAR(255),
senha varchar(50),
matricula_ger VARCHAR(20),
ano VARCHAR(2),
foreign key (matricula_ger) references gerente(matricula_ger)
);

create table conteudo(
id_cont SERIAL primary key,
titulo VARCHAR(255),
tipo VARCHAR(255),
genero VARCHAR(255),
matricula_ger VARCHAR(20),
url VARCHAR(1000),
trailer VARCHAR(1000),
resenha VARCHAR(1000),
descricao TEXT,
plataformas TEXT,
foreign key (matricula_ger) references gerente(matricula_ger)
);

create table avaliacao( pensando como vai ser criado
cod_nota VARCHAR(1) primary key,
comentario VARCHAR(500),
matricula VARCHAR(20),
id_cont int,
foreign key (matricula) references usuario(matricula),
foreign key (id_cont) references conteudo(id_cont)
);

create table avalia_cont(
id_tema int,
id_cont int,
PRIMARY KEY (id_tema, id_cont),
FOREIGN KEY (id_tema) REFERENCES eixo_tematico(id_tema),
FOREIGN KEY (id_cont) REFERENCES conteudo(id_cont)
);