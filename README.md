# XY Inc

Teste para ingresso na equipe MetaPod

## Instalação

A instalação do projeto consiste em instalar as dependencias e criar o banco de dados PostgreSQL.

### Dependencias
Use npm para instalar automaticamente as dependencias
```bash
npm install
```
### Banco de dados
Crie um banco de dados com qualquer nome no PostgreSQL e rode o script database.sql
```sql
BEGIN;

-- Creating the tables
CREATE TABLE xyuser (
    username      VARCHAR(21)          PRIMARY KEY,
    password      VARCHAR(40) NOT NULL,              -- HEX SHA1 of the password
    registered_on TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE xysession (
    token      VARCHAR(64)          PRIMARY KEY,
    created_on TIMESTAMP   NOT NULL DEFAULT NOW(),
    removed_on TIMESTAMP,
    xyuser     VARCHAR(21) NOT NULL,
    
    CONSTRAINT fk_xysession_xyuser
        FOREIGN KEY (xyuser)
        REFERENCES xyuser (username)
);

CREATE TABLE poi (
    coord_x    INTEGER      NOT NULL,
    coord_y    INTEGER      NOT NULL,
    name       VARCHAR(128) NOT NULL,
    created_on TIMESTAMP    NOT NULL DEFAULT NOW(),
    added_by   VARCHAR(21)  NOT NULL,

    CONSTRAINT pk_poi
        PRIMARY KEY (coord_x, coord_y),

    CONSTRAINT fk_poi_xyuser
        FOREIGN KEY (added_by)
        REFERENCES xyuser (username)
);
CREATE INDEX idx_poi_x ON poi USING BTREE (coord_x);
CREATE INDEX idx_poi_y ON poi USING BTREE (coord_y);

-- Adding admin
INSERT INTO xyuser (username, password)
     VALUES ('admin', 'd033e22ae348aeb5660fc2140aec35850c4da997'); -- admin admin

COMMIT;
```

## Inicialização
Para iniciar o servidor é necessário setar as variáveis de ambiente:
* PGHOST
* PGPORT
* PGUSER
* PGPASSWORD
* PGDATABASE

Exemplo:
```bash
PGHOST="localhost" \
PGPORT=5432 \
PGUSER="postgres" \
PGPASSWORD="123" \
PGDATABASE="xyinc" \
npm start
```
A porta padrão é 8080 mas pode ser alterada em settings.js

## Uso
A API segue o padrão REST e usa JSON para o câmbio de dados.
### Listando POIs
Envie um pedido GET para /poi

Exemplo:
```bash
curl -XGET 'http://localhost:8080/poi'
```
### Encontrando POIs
Envie um pedido GET para /poi/find com os query params:
* x: Coordenada X
* y: Coordenada Y
* d: Distância máxima de (x, y)

Exemplo:
```bash
curl -XGET 'http://localhost:8080/poi/find?x=20&y=10&d=10'
```
### Autenticando
Envie um pedido POST para /auth/token com o corpo do pedido em JSON contendo:
* username: Nome de usuário
* password: Senha

Exemplo:
```bash
curl -XPOST -H "Content-type: application/json" \
-d '{"username": "admin", "password": "admin"}' \
'http://localhost:8080/auth/token'
```

### Inserindo POI
Envie um pedido POST para /poi com o corpo do pedido em JSON contendo:
* x: Coordenada X
* y: Coordenada Y
* name: Nome do POI

E o header Authentication contendo o token de autenticação conseguido no endpoint anterior.

Exemplo:
```bash
curl -XPOST \
-H 'Authentication: SEU TOKEN DE AUTENTICAÇÃO AQUI' \
-H "Content-type: application/json" \
-d '{"x": 5, "y": 5, "name": "Jorge"}' \
'http://localhost:8080/pois'
```

### Logout
Para fazer logout envie um pedido DELETE para /auth/logout com o header Authentication contendo o token de autenticação conseguido no endpoint POST /auth/token.

Exemplo:
```bash
curl -XDELETE \
-H 'Authentication: SEU TOKEN DE AUTENTICAÇÃO AQUI' \
'http://localhost:8080/auth/logout'
```
## Considerações
Algumas decisões foram tomadas para o projeto:
* Para simplicidade, as sessões estão sendo salvas em PostgreSQL e todas sessões, expiradas ou não,
na mesma tabela. Em um projeto real elas seriam salvas em algum SGBD não relacional como, por exemplo, [redis](https://redis.io/);
* O hash usado para as senhas é SHA-1 simples, sem sal. Em um projeto real algoritmos de hash mais
robustos seriam usados;
* O servidor usa somente uma conexão com o banco de dados. Em um projeto real seria usada uma pool de conexões;
* Por simplicidade, o servidor não conta com nenhum sistema de rate limit;
* Por simplicidade, o servidor não conta com nenhum endpoint para registrar novos usuários;
* Por simplicidade, o servidor não audita o tempo de resposta dos endpoints para diagnosticar
possíveis problemas.
