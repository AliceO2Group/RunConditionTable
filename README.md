# Założenia wstępne:
- [x] działające środowisko PostgreSQL (dalej zakładamy wykorzystanie `psql`)
- [x] zainstalowany node.js

# 1. Przygotowanie bazy danych
Za pomocą poleceń w `psql` stworzymy użytkownika i prostą bazę danych, z którą będzie komunikować się aplikacja:
```shell
psql
create user "crud-user" with password 'crud-passwd';
create database "crud-db";
alter database "crud-db" owner to "crud-user";
\q
```
Połączenie z nową bazą danych jako nowo utworzony użytkownik:
```shell
psql -d "crud-db" -U "crud-user" -W
# psql zapyta o zdefiniowane poprzednio hasło (crud-passwd)
create table if not exists public.data
( id serial PRIMARY KEY,
  value INTEGER NOT NULL,
  date DATE NOT NULL);
  
insert into data(value, date) values(13, '2021-01-01');
insert into data(value, date) values(7, '2022-08-09');

select * from data;
select now();
select date(now());
insert into data(value, date) values(2, date(now()));
select * from data;
exit
```

# 2. WebUI
```shell
mkdir crud # utwórz nowy folder, w którym będzie znajdował się cały projekt
cd crud
touch index.js
npm init -y
```
... opis package.json, package-lock.json
co jest w package.json i po co
package.json dopisać skrypt "start": "node index.js"
[npm scripts](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/devel.md#npm-scripts)

```shell
npm install --save @aliceo2/web-ui
```
... opis co się tutaj dzieje

## Zawartość plików
### `config.js`
```js
module.exports = {
    jwt: {
      secret: 'supersecret',
      expiration: '10m'
    },
    http: {
      port: 8080,
      hostname: 'localhost',
      tls: false
    }
  };
```
jwt to dane do utworzenia [JSON Web Token](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/json-tokens.md), który będzie wykorzystywany przez serwer HTTP. Służy do zabezpieczania połączenia pomiędzy serwerem a klientem.

### `index.js`
To jest plik wejściowy do aplikacji.
```js
const { HttpServer, Log } = require('@aliceo2/web-ui');
const config = require('./config.js');
const log = new Log('Crud Tutorial');
const httpServer = new HttpServer(config.http, config.jwt);

httpServer.addStaticPath('./public');

log.info('hello there');
log.warn('this is a warning!');
log.error('this is an error!');
```
Co się tutaj dzieje:
1. require: co robi i dlaczego
2. log: wykorzystywany do informowania w konsoli IDE o tym, co się dzieje podczas działania aplikacji; więcej [tutaj](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/logging.md)
3. httpServer: nowa instancja serwera o parametrach zdefiniowanych w pliku `config.js`; więcej [tutaj](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/http-server.md). Serwer udostępnia użytkownikowi zawartość folderu `public`.

### folder `public`
Utwórz plik index.html:
```html
<!doctype html>
<title>CRUD Tutorial</title>
<h1>Hello world!</h1>
```
Teraz po uruchomieniu `npm start`, przeglądarka pod adresem [localhost:8080](localhost:8080) (parametry z pliku `config.js`) wyświetli // obrazek //.
Otwórz konsolę Ctrl + Shift + I, co można robić w konsoli i do czego to służy.

Tutaj dodać favicon i dlaczego.

### Debugowanie
[jak tłumaczą WebUI](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/debug.md)
Ctrl + Shift + I, etc.

# 3. node postgres
```shell
npm install pg
```
Utwórz folder db, a w nim plik `connection.js`. W tym pliku:
```js
const { Client } = require("pg");

const client = new Client({
    user: 'crud-user',
    host: 'localhost',
    database: 'crud-db',
    password: 'crud-passwd',
    port: 5432,
})

client.connect();

module.exports = client;
```
Tworzymy nowego klienta, który połączy się naszą aplikację z bazą danych. Plik eksportuje utworzone połączenie.

Modyfikujemy `index.js`:
```js
const db = require("./db/connection.js");
```

Wykorzystamy publiczne metody serwera, aby obsłużyć operacje CRUD wykonywane na bazie danych.
Zaczynając od GET (pobranie danych z bazy):

```js
httpServer.get("/getData", async function(req, res, next) {
  try {
    const results = await db.query("SELECT * FROM data ORDER BY id");
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
}, { public: true });
```
Pod adresem [localhost:8080/api/getData](localhost:8080/api/getData) dostępne będą teraz dane pobrane z bazy.
Dlaczego jeszcze po drodze `/api`? Bo tak jest [tutaj](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/Backend/http/server.js).
`{ public: true });` wyłącza weryfikację tokenu (JWT), bez tego zobaczysz błąd // zrzut błędu //
Uruchom aplikację i wprowadź ten adres w przeglądarce. Obrazek co będzie widać:

// może najpierw przykład z localhost:8080/api/hi
```js
http.get('/hi', (req, res) => {
  res.status(200).json({message: 'hi'})
}, { public: true });
```

# Zamieszanie w folderze public, żeby wyświetlać coś lepszego
- index.html: sessionService.loadAndHideParameters //Token i dane użytkownika przyznane klientowi kiedy wchodzi na stronę udostępnioną przez `addStaticPath`.
- koncepcja MVC
- utworzerzenie modelu, widoku
- Model: routy dla CRUDa, fetchClient
- await, asynchroniczność [AJAX](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/async-calls.md): co to, po co, dlaczego
- widok: [komponenty](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/components.md) - takie cegiełki, z których potem buduje się aplikację (albo jeszcze inne pośrednie cegiełki)

## Model

## Widok, podwidoki
- może jakiś wykres wrzucić? coś [stąd](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/charts.md) np.

## Stylowanie
1. najpierw zobacz [tu](https://aliceo2group.github.io/WebUi/Framework/docs/reference/frontend-css.html)
2. rightClick + Inspect...
3. CSS, załączanie pliku CSS do index.html
