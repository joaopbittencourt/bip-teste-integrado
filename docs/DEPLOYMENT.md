# Implantação e execução (WildFly 8081 → Spring Boot → Angular)

Este documento descreve os passos para preparar o ambiente e executar os três componentes do projeto de teste: o módulo EJB (implantado em WildFly na porta 8081), o backend Spring Boot e o frontend Angular. Banco de dados: PostgreSQL.

Resumo de ordem de execução
- 1) Preparar o banco de dados PostgreSQL e carregar schema/seed
- 2) Build e deploy do EJB no WildFly (rodando em HTTP porta 8081)
- 3) Executar o backend Spring Boot (Maven)
- 4) Executar o frontend Angular (com proxy para o backend)

Pré-requisitos
- Java 11+ (ou versão compatível com WildFly e Spring Boot do projeto)
- Maven 3.6+
- Node.js 14+ e npm
- WildFly (versão compatível com os EJBs do projeto)
- PostgreSQL (servidor rodando)

1) Preparar o PostgreSQL

Substitua `bip_user`, `bip_pass` e `bip_test` pelos valores desejados. Se já tem banco/usuário, pule esta etapa.

Exemplo (executar como usuário postgres):

```sh
# criar banco e usuário (ajuste senha conforme desejado)
sudo -u postgres psql -c "CREATE DATABASE bip_test;"
sudo -u postgres psql -c "CREATE USER bip_user WITH PASSWORD 'bip_pass';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bip_test TO bip_user;"

# carregar schema e seed SQL (assumindo que você esteja no root do repositório)
psql -U bip_user -d bip_test -f db/schema.sql
psql -U bip_user -d bip_test -f db/seed.sql
```

Observações:
- Se o seu PostgreSQL exige host/porta diferentes, ajuste a variável `PGHOST`/`PGPORT` ou a URL JDBC nos passos abaixo.

2) WildFly — build e deploy do EJB e datasource PostgreSQL

Passos gerais:

- a) Build do módulo EJB


Vá para o diretório do módulo EJB que contém um `pom.xml` (no repositório existe a pasta `ejb-module/ejbmodule`; anteriormente este projeto tinha um subdiretório `ejb-module2` — o módulo atual é `ejbmodule`). Exemplo:

```sh
cd ejb-module/ejbmodule
mvn clean package
```

O artefato gerado ficará em `target/` (por exemplo `target/ejbmodule-1.0.jar` ou `target/your-ejb.ear`).

- b) Preparar WildFly

1. Copie o artefato para a pasta de deploy do WildFly (ou use a console/CLI para deploy):

```sh
cp target/*.jar $WILDFLY_HOME/standalone/deployments/
```

2. Executar o WildFly na porta HTTP 8081:

```sh
$WILDFLY_HOME/bin/standalone.sh -Djboss.http.port=8081
```

ou, em background:

```sh
$WILDFLY_HOME/bin/standalone.sh -Djboss.http.port=8081 &
```

3. Registrar o driver PostgreSQL e criar o datasource (exemplo com CLI):

- Copie o driver JDBC (ex: `postgresql-42.x.x.jar`) para uma pasta acessível.
- Adicione o módulo do driver (substitua /caminho/para/postgresql.jar):

```sh
$WILDFLY_HOME/bin/jboss-cli.sh --connect --command="module add --name=org.postgresql --resources=/caminho/para/postgresql.jar --dependencies=javax.api,javax.transaction.api"
```


Adicione o driver e datasource (substitua user/pass/url conforme necessário):

```sh
$WILDFLY_HOME/bin/jboss-cli.sh --connect --commands="/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql,driver-module-name=org.postgresql,driver-class-name=org.postgresql.Driver), /subsystem=datasources/data-source=PostgresDS:add(jndi-name=java:/jdbc/PostgresDS,driver-name=postgresql,connection-url=jdbc:postgresql://localhost:5432/bip_test,user-name=bip_user,password=bip_pass)"
```

Observações:
- Se preferir, configure o datasource pela console de administração do WildFly.
- Garanta que o JNDI usado pelo EJB coincida com o `jndi-name` do datasource que o EJB espera.

3) Spring Boot — build e execução

O módulo Spring Boot parece estar em `backend-module`. Ajuste o caminho se necessário.

Antes de executar, atualize `src/main/resources/application.properties` (ou `application.yml`) do módulo Spring Boot para apontar para o banco PostgreSQL. Exemplo mínimo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bip_test
spring.datasource.username=bip_user
spring.datasource.password=bip_pass
spring.jpa.hibernate.ddl-auto=none
```

Build e execução (modo rápido durante desenvolvimento):

```sh
cd backend-module
mvn clean package
# rodar com maven (ou usar o jar em target/)
mvn spring-boot:run

# ou executar o jar gerado
java -jar target/backend-module-0.0.1-SNAPSHOT.jar
```

Observações:
- Se o Spring Boot usar outra porta (default 8080) e você quiser outra porta, defina `server.port=XXXX` em `application.properties` ou passe `-Dserver.port=XXXX`.
- Se o frontend espera que o backend esteja em uma porta específica, ajuste o proxy do Angular (ver abaixo).

4) Frontend Angular — instalar dependências e executar

O frontend está em `frontend/front-bip`.

```sh
cd frontend/front-bip
npm install

# rodar para desenvolvimento (usa proxy.conf.json para direcionar chamadas API ao backend)
npm start

# ou explicitamente com Angular CLI (se instalado)
ng serve --proxy-config proxy.conf.json --port 4200
```

O arquivo `proxy.conf.json` já existe no repositório; verifique seu conteúdo para confirmar para qual host:porta ele encaminha as requisições de API (por exemplo, `http://localhost:8080`). Ajuste o `target` do proxy para combinar com a porta do Spring Boot.

5) Fluxo normal de testes (exemplo)

1. Subir PostgreSQL e aplicar schema/seed.
2. Subir WildFly em 8081 e deploy do EJB; confirmar datasource funcionando.
3. Rodar Spring Boot (certifique-se que conecta ao Postgres). Backend deve expor endpoints REST para gerir "benefício".
4. Rodar Angular; abrir navegador em http://localhost:4200 e testar criar/atualizar/excluir benefício.

6) Verificação e troubleshooting

- Logs WildFly: `$WILDFLY_HOME/standalone/log/server.log`.
- Logs Spring Boot: console do `mvn spring-boot:run` ou `logs` do jar.
- Erros comuns:
  - Conexão JDBC recusada: verifique host/porta/usuário/senha do Postgres e se o serviço está rodando.
  - Driver JDBC não encontrado no WildFly: certifique-se de adicionar o módulo do driver corretamente.
  - Erros CORS no frontend: prefira usar `proxy.conf.json` durante desenvolvimento ou habilitar CORS no backend.

7) Ajustes rápidos de porta

- WildFly: `-Djboss.http.port=8081` (como mostrado acima).
- Spring Boot: `-Dserver.port=8080` ou ajustar `application.properties`.

8) Notas finais

- Substitua todas as credenciais de exemplo (bip_user/bip_pass) por valores seguros em ambientes reais.
- Este documento foca no fluxo de desenvolvimento/local. Para produção, considere usar scripts de automação, containers (Docker) e configurações seguras para secrets.

---
