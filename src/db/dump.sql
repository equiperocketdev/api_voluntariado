create table empresas (
  id SERIAL primary key,
  cnpj char(14) not null UNIQUE,
  nome varchar(100) not null,
  email varchar(100) not null UNIQUE,
  senha text not null,
  cadastro date default now(),
  sobre text,
  logo text
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome text not null,
  sobrenome text not null,
  email varchar(100) UNIQUE not null,
  senha text not null,
  telefone varchar(11),
  cadastro date default now(),
  tempo_volun integer default 0,
  avatar text,
  data_nasc date,
  
  empresa_id integer references empresas(id) ON DELETE  CASCADE
);

create table causas(
	id serial primary key,
  nome text
);

create table ongs (
  id SERIAL primary key,
  cnpj char(14) UNIQUE,
  nome varchar(100) not null,
  email varchar(100) not null UNIQUE,
  senha text not null,
  cadastro date default now(),
  sobre text,
  logo text
);

create table vagas(
	id serial primary key,
  titulo varchar(50) not null,
  sobre text,
  data timestamp,
  cadastro date default now(),
  qtd_vagas integer,
  qtd_volun integer default 0,
  capa text,
  disponivel boolean default true,
  
  empresa_id integer references empresas(id) on delete cascade,
  ong_id integer references ongs(id) on delete cascade,
  causa_id integer references causas(id) on delete cascade not null
);

create table vaga_usuario(
	id serial primary key,
  vaga_id integer references vagas(id),
  usuario_id integer references usuarios(id)
);

create table enderecos (
	id serial primary key,
  cep char(8) not null,
  rua text not null,
  bairro text not null,
  cidade text not null,
  estado char(2) not null,
  
  usuario_id integer references usuarios(id) on delete cascade,
  empresa_id integer references empresas(id) on delete cascade,
  ong_id integer references ongs(id) on delete cascade
);

ALTER SEQUENCE ongs_id_seq RESTART WITH 72000;
ALTER SEQUENCE empresas_id_seq RESTART WITH 75000;
ALTER SEQUENCE usuarios_id_seq RESTART WITH 78000;
