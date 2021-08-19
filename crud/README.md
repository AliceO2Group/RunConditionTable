# Założenia wstępne:
- [x] działające środowisko PostgreSQL (dalej zakładamy wykorzystanie `psql`)
- [x] zainstalowany node.js

# 1. Przygotowanie bazy danych
Za pomocą poleceń w `psql` stworzymy użytkownika i prostą bazę danych, z którą będzie komunikować się aplikacja:
```shell
psql
create user "crud-user" with password 'crud-passwd';
\du # wyświetl listę użytkowników, powinien pojawić się nowy użytkownik; żeby wyjść: q
create database "crud-db";
\l # wyświetl listę baz danych, powinna się tam pojawić nowoutworzona baza danych
alter database "crud-db" owner to "crud-user";
\l # powinien zmienić się właściciel utworzonej bazy
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

\dt # wyświetl relacje w bazie danych, z którą jest połączenie

insert into data(value, date) values(13, '2021-01-01');
insert into data(value, date) values(7, '2022-08-09');

select * from data;
select now();
select date(now());
insert into data(value, date) values(2, date(now()));
select * from data;
exit
```

# 2. Inicjalizacja projektu
Utwórz nowy folder, w którym będzie znajdował się cały projekt i zainicjalizuj go:
```shell
mkdir crud
cd crud
npm init -y
```

W tym momencie wygodnie będzie otworzyć folder projektu w aplikacji dedykowanej edytowaniu kodu, np. Visual Studio Code, WebStorm itp..
Polecenie [`npm -y init`](https://docs.npmjs.com/cli/v7/commands/npm-init) utworzy plik `package.json` i uzupełni go domyślnymi ustawieniami (można również wpisywać je samodzielnie, wtedy bez opcji `-y` ). Według domyślnych ustawień plikiem głównym projektu będzie `index.js`.

```shell
touch index.js
```
Na razie wpiszmy w nim np. `console.log('Hello there');`. Zgodnie z przyjętą [konwencją](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/devel.md#npm-scripts) aplikację będziemy uruchamiać poleceniem `npm start`. W tym celu do pliku `package.json` należy dopisać skrypt [`"start": "node index.js"`](https://github.com/xsalonx/cern_RCT_test/blob/master/crud/package.json). Szybki test, czy działa:

![test](https://user-images.githubusercontent.com/48785655/129396425-885d36e7-a8c6-4a14-bdcf-9bc4a4552867.png)

Więcej na temat pliku `package.json` dowiesz się z [oficjalnej dokumentacji](https://docs.npmjs.com/cli/v7/configuring-npm/package-json).

# 3. Interakcja z bazą danych
Wykorzystamy moduł [`pg`](https://node-postgres.com) ułatwiający pracę z postgresem przy wykorzystaniu node.js'a. Żeby z niego korzystać konieczna jest jego wcześniejsza [instalacja](https://docs.npmjs.com/cli/v7/commands/npm-install):
```shell
npm install pg
```
Po wywołaniu tego polecenia w folderze projektu pojawi się folder `node_modules` oraz plik [`package-lock.json`](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json), a do pliku `package.json` zostanie dopisana odpowiednia zależność. W folderze `node_modules` znajdują się moduły wykorzystywane przez aplikację. Są stosunkowo dużymi plikami, dlatego generalnie nie wrzuca się ich np. na GitHuba ([`.gitignore`](https://github.com/xsalonx/cern_RCT_test/blob/master/crud/.gitignore)). Aby zapewnić spójność modułów wykorzystywanych przez różne osoby współpracujące przy danym projekcie, zapis instalowanych zależności jest na bieżąco tworzony w pliku `package-lock.json`. Dzięki niemu proste będzie ich jednoznaczne odtworzenie. Żeby to przetestować usuń folder `node_modules`, a następnie wywołaj polecenie `npm install` (tym razem specyfikacji, jakie moduły chcesz zainstalować). Do folderu `node_modules` ponownie została ściągnięta paczka `pg` oraz wszystkie przez nią wykorzystywane.

Utwórz folder `db`, a w nim plik [`connection.js`](https://github.com/xsalonx/cern_RCT_test/blob/master/crud/db/connection.js).
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
Tworzymy w nim klienta, który łączy się z utworzoną wcześniej bazą (por. parametry z [punktu 1](https://github.com/xsalonx/cern_RCT_test/tree/crud/crud#1-przygotowanie-bazy-danych)). Port 5432 to domyślny port, na którym działa postgres.

Wyeksportowane połączenie wykorzystamy teraz w pliku `index.js`.

```js
const db = require('./db/connection.js');

db.query("select * from data where id = $1", ["1"])
    .then((results) => console.table(results.rows))
    .catch(e => console.log(e))
    .finally(() => db.end());
```
![npm-index](https://user-images.githubusercontent.com/48785655/129436057-f88178c9-ee2d-4a1f-bb2d-8da1e9a6a353.png)

# 4. Serwer HTTP
Poleceniem `npm install --save @aliceo2/web-ui` ściągnij paczkę frameworka i wszystkie przez niego wykorzystywane.
```shell
npm install --save @aliceo2/web-ui
```

Zaczniemy od uworzenia serwera HTTP. Zapis konfiguracji będzie znajdował się w pliku [`config.js`](https://github.com/xsalonx/cern_RCT_test/blob/master/crud/config.js):
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
jwt to dane do utworzenia [JSON Web Token](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/json-tokens.md). Na potrzeby tego tutoriala nie ma znaczenia co w nich będzie, jako parametr `secret` możesz podać np. swoje imię. Token służy do zabezpieczania połączenia pomiędzy serwerem a klientem. Jest przyznawany klientowi przy dostępie do strony głównej, określonej przez `addStaticPath`.

Zmodyfikuj plik wejściowy aplikacji (`index.js`):
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
[Log](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/logging.md) jest wykorzystywany do informowania w konsoli IDE o tym, co się dzieje podczas działania aplikacji.

Stworzyliśmy nową instancję [serwera](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/http-server.md) o parametrach zdefiniowanych w pliku `config.js`. Serwer udostępnia użytkownikowi zawartość folderu `public`.

Utwórz ten folder, a w nim plik `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CRUD Tutorial</title>
</head>
<body>
    <h1>Hello world!</h1>
</body>
</html>
```
Teraz uruchom `npm start` i otwórz przeglądarkę pod adresem [localhost:8080](http://localhost:8080) (parametry z pliku `config.js`). W przeglądarce uruchom konsolę: `Ctrl + Shift + I`. Konsola przeglądarki jest bardzo przydatna przy [debugowaniu](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/debug.md). Całość generalnie działa, ale już pojawił się pierwszy błąd, mianowicie:

![favicon-error](https://user-images.githubusercontent.com/48785655/129437518-03ae41a9-45b2-46c6-b31a-aa96bcd53a6f.png)

Przeglądarka wysłała do serwera zapytanie `GET http://localhost:8080/favicon.ico`, na które otrzymała odpowiedź 404 - Page not found. Żeby taki błąd się nie pojawiał musimy udostępnić żądany plik `favicon.ico`.

W folderze `public` utwórz nowy folder `images`, do którego wklej folder [`favicon`](https://github.com/xsalonx/cern_RCT_test/tree/master/crud/public/images/favicon) ([źródło](https://favicon.io/emoji-favicons/microscope/)) - lub znajdź i wklej inny obrazek, który uważasz za ładniejszy. Następnie zmodyfikuj sekcję `head` pliku `index.html`:
```html
<head>
    <link rel="icon" href="./images/favicon/favicon.ico">
    <meta charset="UTF-8">
    <title>CRUD Tutorial</title>
</head>
```
Ponownie uruchom aplikację i przeglądarkę. Błąd zniknął, a obok tytułu strony poprawnie wyświetla się wybrany obrazek:

![fav](https://user-images.githubusercontent.com/48785655/129437983-3769515c-963b-4174-82a0-c0adf0c2eb48.png)

Kolejny element, który należy poprawić, to fakt, że aktualnie dane, w celu których ukrycia wykorzystujemy [token](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/json-tokens.md) są wyświetlane w adresie URL. Zmodyfikuj sekcję `body` pliku `index.html`:
```html
<body>
    <script type="module">
	import sessionService from '/js/src/sessionService.js';
	sessionService.loadAndHideParameters();
    </script>
    <h1>Hello world!</h1>
</body>
```
Po wywołaniu [funkcji](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/Frontend/js/src/sessionService.js) ze skryptu, dane są dostępne po stronie klienta poprzez obiekt `sessionService`. Dopisz do skryptu linię `console.log(sessionService.session);`. Wyświetlone dane to te same, które wcześniej były dopisywane do adresu URL, dokładniejszy ich opis znajdziesz [tutaj](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/json-tokens.md).

# 5. CRUD
Wykorzystamy publiczne metody serwera, aby obsłużyć operacje CRUD wykonywane na bazie danych.

| [Create](https://github.com/xsalonx/cern_RCT_test/tree/master/crud#create-post) | [Read](https://github.com/xsalonx/cern_RCT_test/tree/master/crud#read-get) | [Update](https://github.com/xsalonx/cern_RCT_test/tree/master/crud#update-patch) | [Delete](https://github.com/xsalonx/cern_RCT_test/tree/master/crud#delete-delete) |
| :---:   | :-: | :-: | :-: |
| `POST` | `GET` | `PATCH` | `DELETE` |

## Read (`GET`)
Zmodyfikuj plik `index.js`:
```js
const { HttpServer, Log } = require('@aliceo2/web-ui');
const db = require('./db/connection.js');
const config = require('./config.js');
const httpServer = new HttpServer(config.http, config.jwt);

httpServer.addStaticPath('./public');

httpServer.get("/getData", async function(req, res, next) {
    try {
      const results = await db.query("SELECT * FROM data ORDER BY id");
      return res.json(results.rows);
    } catch (err) {
      return next(err);
    }
  }, { public: true });
```
Według przyjętej we frameworku reguły (patrz [tutaj](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/Backend/http/server.js), linia 268) przed określoną ścieżkę dopisywany jest fragment `/api`. Uruchom aplikację i wpisz w przeglądarce adres [localhost:8080/api/getData](http://localhost:8080/api/getData). Będą tam dostępne dane pobrane z bazy.

`{ public: true }` wyłącza weryfikację tokenu, bez tego przy aktualnej konfiguracji zobaczysz błąd 403.

### Proste filtrowanie
Wykorzystamy adres URL do przesyłania prostych zapytań do serwera w formacie `?klucz=wartość`. Zmodyfikuj zdefiniowaną wcześniej obsługę zapytania `GET`:
```js
httpServer.get("/getData", async function(req, res, next) {
    try {
        const filters = req.query;
        const results = await db.query("SELECT * FROM data ORDER BY id");

        const filteredResults = results.rows.filter(row => {
            let isValid = true;
            for (const [key, filter] of Object.entries(filters)) {
                if (row[key]) {
                    isValid = isValid && row[key] == filter;
                }
            }
            return isValid;
        });
	if (filteredResults.length < 1) return res.send("No matching results");
        return res.json(filteredResults);
    } catch (err) {
      return next(err);
    }
  }, {public: true});
```

Uruchom aplikację i wypróbuj kilka filtrów, np. [localhost:8080/api/getData?id=2](http://localhost:8080/api/getData?id=2), [localhost:8080/api/getData?id=1&value=13](http://localhost:8080/api/getData?id=1&value=13), [localhost:8080/api/getData?id=1&value=22](http://localhost:8080/api/getData?id=1&value=22).

Powyższe rozwiązanie nie sprawdzi się jednak przy filtrowaniu polach zawierających datę. Wyświetlana data prezentowana jest w formacie ISO 8601, stąd narzuca się pomysł konwersji:
```js
const filteredResults = results.rows.filter(row => {
    let isValid = true;
    	for (const [key, filter] of Object.entries(filters)) {
    	    if (row[key]) {
	    	isValid = key === 'date' ?
			row[key].toISOString() == (new Date(filter)).toISOString() : isValid && row[key] == filter;
            }
	}
    return isValid;
});
```
Najprawdopodobniej zadziała (przetestuj np. [localhost:8080/api/getData?date='2022-08-09'](http://localhost:8080/api/getData?date=%272022-08-09%27)). Nie jest to jednak najlepsze rozwiązanie, ponieważ w formacie ISO zawierają się również inne, domyślnie przypisywane wartości (m. in. godzina), których nie definiujemy, a które w niektórych przypadkach mogą mieć wpływ na wynik porównywania. Bezpieczniej jest więc napisać dłuższą wersję:
```js
const filteredResults = results.rows.filter(row => {
    let isValid = true;
        for (const [key, filter] of Object.entries(filters)) {
            if (key === 'date') {
                const rowDate = new Date(row[key]);
                const filterDate = new Date(filter);
                sameYear = rowDate.getFullYear() == filterDate.getFullYear();
                sameMonth = rowDate.getMonth() == filterDate.getMonth();
                sameDay = rowDate.getDate() == filterDate.getDate();
                isValid = isValid && sameYear && sameMonth && sameDay;
            } else if(row[key]) isValid = isValid && row[key] == filter;
         }
    return isValid;
});
```

## Create (`POST`)
W pliku `index.js` dopisz:
```js
httpServer.post("/insert", async function(req, res, next) {
    try {
        var date = req.body.date;
        var value = req.body.value;

        const result = await db.query(
          "INSERT INTO data (value, date) VALUES ($1, $2) RETURNING *",
          [value, date]
        );
        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
}, { public: true });
```
## Update (`PATCH`)
```js
httpServer.patch("/update/:id", async function(req, res, next) {
  try {
    const id = req.params.id;
    const value = req.body.value;
    const date = req.body.date;

    const result = await db.query(
      "UPDATE data SET value=$1, date=$2 WHERE id=$3 RETURNING *",
      [value, date, id]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}, { public: true });
```

## Delete (`DELETE`)
```js
httpServer.delete("/delete/:id", async function(req, res, next) {
  try {
    const result = await db.query("DELETE FROM data WHERE id=$1", [
      req.params.id
    ]);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
}, { public: true });
```

### Działanie napisanych routów
Uruchom aplikację i otwórz nowy terminal. Równolegle otwórz przeglądarkę pod adresem [localhost:8080/api/getData](http://localhost:8080/api/getData). Żądania do serwera są wysyłane asynchronicznie, więc po wpisaniu każdej linii należy odświeżyć przeglądarkę aby zobaczyć rezultat. Do wysyłania żądań do serwera wykorzystamy [`HTTPie`](https://httpie.io/):
```shell
http localhost:8080/api/getData
http POST localhost:8080/api/insert value=9 date='1999-01-04'
http POST localhost:8080/api/insert value=187 date='2015-09-16'
http PATCH localhost:8080/api/update/4 value=11 date='2001-10-22'
http DELETE localhost:8080/api/delete/2
http POST localhost:8080/api/insert value=17 date='2013-06-23'
```
# 6. Frontend
## MVC
Framework wykorzystuje wzorzec architektoniczny Model-View-Controller, którego podstawowym założeniem jest wydzielenie w strukturze aplikacji tych trzech jawnie określonych części:
![mvc](https://user-images.githubusercontent.com/48785655/129690551-e210940f-b827-420a-a5a5-c52b75d6c74e.png)

### Realizacja prostego licznika
Przeczytaj [artykuł wprowadzający](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/template-engine.md). Przeanalizuj [przykład](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/demo/template-2.html) i związany z nim [cykl przepływu informacji](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/images/cycle.jpeg). Zmodyfikuj zawartość pliku `index.html` tak, aby aplikacja realizowała oczekiwaną funkcjonalność:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/css/src/bootstrap.css">
    <link rel="icon" href="./images/favicon/favicon.ico">
    <meta charset="UTF-8">
    <title>CRUD Tutorial</title>
</head>
<body>
    <script type="module">
        import sessionService from '/js/src/sessionService.js';
        sessionService.loadAndHideParameters();
        console.log(sessionService.session);
    </script>
    
    <script type="module">
        import {mount, h, Observable} from '/js/src/index.js';

        class Model extends Observable {
            constructor() {
                super();
                this.count = 0;
            }

            increment() {
                this.count++;
                this.notify();
            }

            decrement() {
                this.count--;
                this.notify();
            }
        }

        function view(model) {
            return h('.absolute-fill.flex-column.items-center.justify-center',
                h('.bg-gray-lighter.br3.p4', [
                    h('h1', 'Hello World'),
                    h('ul', [
                        h('li', `Counter: ${model.count}`),
                    ]),
                    h('div', [
                        h('button.btn', {onclick: e => model.increment()}, '++'), ' ',
                        h('button.btn', {onclick: e => model.decrement()}, '--'), ' ',
                    ])
                ])
            );
        }

        const model = new Model();
        const debug = true;
        mount(document.body, view, model, debug);

        window.model = model;
    </script>
</body>
</html>
```
[Oczekiwane działanie aplikacji](https://aliceo2group.github.io/WebUi/Framework/docs/demo/template-2.html).

Zarówno model jak i widok mogą być (i zazwyczaj są) podzielone na mniejsze elementy składowe, odpowiednio na podmodele i podwidoki. Aby zwiększyć czytelność i ułatwić organizację kodu przechowuje się je w osobnych plikach/folderach.

# 7. Uwzględnienie MVC w aplikacji `crud`
## 7.1. Wyświetlanie danych
__Do czego dążymy:__ przycisk w oknie przeglądarki, którego naciśnięcie (_użytkownik_ -> kontroler) spowoduje pobranie danych z bazy (_kontroler_ -> model) i ich wyświetlenie (_model_ -> widok -> _użytkownik_).

### Model
W folderze public utwórz plik Model.js:
```js
import { Observable, fetchClient } from '/js/src/index.js';

export default class Model extends Observable {
    constructor() {
        super();
        this.data = null;
        this.loaded = false;
    }

    async getData() {
      this.data = [];
      const response = await fetchClient('/api/getData', {
          method: 'GET',
      });
      const content = await response.json();
      for (const item of content) {
        this.data.push(item);
      }
      this.loaded = true;
      this.notify();
    }
}
```

### Widok
Za całokształt widoku będzie odpowiedzialny plik [`view.js`](https://github.com/xsalonx/cern_RCT_test/blob/master/crud/public/view.js) w folderze public. Rozważmy dwa przypadki:
- a) przypadek "podstawowy" - dane niezaładowane
- b) dane załadowane

#### a) dane niezaładowane
##### `button.js`
Utwórz nowy komponent `button` w pliku `public/components/common/button.js`. [Komponenty](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/components.md) to podstawowe elementy pośrednie w budowie aplikacji. Takie cegiełki, z których buduje się widok (albo jeszcze po drodze inne cegiełki).
```js
import { h } from '/js/src/index.js';

export default function button(label, onClickAction) {
    return h('button', {onclick: onClickAction}, label);
}
```

##### `basic.js`
W folderze `components` utwórz nowy plik `basic.js`. Będzie to podstawowy widok wyświetlany użytkownikowi przed załadowaniem danych:
```js
import button from './common/button.js';
import { h } from '/js/src/index.js';

function handleLoad(e, model) {
    e.preventDefault();
    model.getData();
}

export default function basic(model) {
    return h('div',
        h('div',
            h('acronym', { title: 'Create Read Update Delete'}, h('h1', 'CRUD')),
            h('h3', 'Tutorial'),
            h('h4', 'PostgreSQL JavaScript node.js WebUI'),
        ),
        h('div',
            button('Load data', (e) => handleLoad(e, model)),
        ),
    );
}
```

#### b) dane załadowane
W folderze `components` utwórz podkatalog `loaded`, a w nim pliki `datarow.js` odpowiedzialny za wyświetlanie wiersza danych odczytanych z bazy oraz `loaded-view.js` odpowiedzialny za całość widoku:

##### `datarow.js`
```js
import { h } from '/js/src/index.js';

export default function row(item) {
    const date = new Date(item.date.toString()).toDateString();
    return [
        h('tr', [
            h('td', item.id),
            h('td', item.value),
            h('td', date),
        ]),
    ];
}
```

##### `loaded-view.js`
```js
import { h } from '/js/src/index.js';
import row from './datarow.js';

export default function loadedView(model) {
    const header = h('thead',
            h('tr',
                h('th', 'id'),
                h('th', 'value'),
                h('th', 'date')
            )
    );

    return h('div',
        h('table',
            header,
            model.data.length > 0 ? h('tbody', model.data.map(item => row(item))) : 'no items were found',
        )
    );
}
```

### Uzupełnij plik `view.js`:
```js
import loadedView from './components/loaded/loaded-view.js';
import basic from './components/basic.js';

export default function view(model) {
    return model.loaded? loadedView(model) : basic(model);
}
```

### W sekcji `body` pliku `index.html` umieść skrypt:
```js
<body>
    <script type="module">
	import sessionService from '/js/src/sessionService.js';
	sessionService.loadAndHideParameters();
    </script>
    <script type="module">
	import {mount} from '/js/src/index.js';
	import view from './view.js';
	import Model from './Model.js';

	const model = new Model();
	const debug = true;
	mount(document.body, view, model, debug);

	window.model = model;
    </script>
</body>
```

Uruchom aplikację i sprawdź jej działanie.

## 7.2. Rozbudowa frontendu o pozostałe operacje składowe akronimu CRUD:
#### `DELETE`
W tabeli obok pobranych danych umieścimy przycisk :heavy_multiplication_x:, którego naciśnięcie spowoduje usunięcie związanego z nim wiersza.

##### Do modelu dopisz:
```js
async delete(id) {
    const response = await fetchClient(`/api/delete/${id}`, {
        method: 'DELETE',
    });
    this.getData();
}
```

##### Zmodyfikuj header w pliku `loaded-view.js` tak, aby dołożyć dodatkową kolumnę na usuwanie:
```js
const header = h('thead',
	h('tr',
        	h('th', 'id'),
                h('th', 'value'),
                h('th', 'date'),
                h('th', 'delete')
            )
    );
```

##### Zmodyfikuj plik `datarow.js`:
```js
import { h } from '/js/src/index.js';
import button from '../common/button.js';

function handleDelete(e, model, item) {
    e.preventDefault();
    model.delete(item.id);
}

export default function row(model, item) {
    const date = new Date(item.date.toString()).toDateString();
    return [
        h('tr', [
            h('td', item.id),
            h('td', item.value),
            h('td', date),
            h('td', button("X", (e) => handleDelete(e, model, item))),
        ]),
    ];
}

```
Aby możliwe było wykonanie operacji usunięcia funkcja musi mieć dostęp do modelu. Zaktualizuj plik loaded-view.js tak, aby przy wywołaniu jej przekazywał model jako parametr:
```js
return h('div',
        h('table',
            header,
            model.data.length > 0 ? h('tbody', model.data.map(item => row(model, item))) : 'no matching items were found',
        )
    );
```

Uruchom aplikację i sprawdź jej działanie.

#### `INSERT`
Dodamy stały element załadowanego widoku aplikacji umożliwiający wstawianie nowych danych:
##### Do modelu dopisz:
```js
async insert(value, date) {
      const response = await fetchClient('/api/insert', {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({value: value, date: date}),
      });
      this.getData();
    }
```

##### W folderze `public/components/loaded` utwórz plik `form.js`:
```js
import { h } from '/js/src/index.js';
import button from '../common/button.js';

export default function form(formID, buttonLabel, onClickAction, valueID, dateID) {
    return h('form', {id: formID},
        h('div.input',
            h('label', {for: "value"}, 'Value: '),
            h('input', {type: "text", name: "value", id: valueID}),
        ),
        h('div.input',
            h('label', {for: "date"}, 'Date: '),
            h('input', {type: "text", name: "date", id: dateID}),
        ),
        button(buttonLabel, onClickAction),
    );
}
```

##### Zmodyfikuj plik `loaded-view.js`:
```js
import { h } from '/js/src/index.js';
import row from './datarow.js';
import form from './form.js';

function handleInsert(e, model) {
    e.preventDefault();

    const value = document.getElementById('value').value;
    const date = document.getElementById('date').value;

    model.insert(value, date);
    document.getElementById('insert-form').reset();
}

export default function loadedView(model) {
    const header = h('thead',
            h('tr',
                h('th', 'id'),
                h('th', 'value'),
                h('th', 'date'),
                h('th', 'delete'),
            )
    );

    return h('div',
        h('div', 
            form('insert-form', 'Insert data', (e) => handleInsert(e, model), "value", "date"),
            h('hr'),
            h('hr'),
            h('hr'),
        ),
        h('table',
            header,
            model.data.length > 0 ? h('tbody', model.data.map(item => row(model, item))) : 'no matching items were found',
        )
    );
}
```

#### `UPDATE`
Wykorzystamy utworzony wcześniej komponent formularza do implementacji obsługi aktualizacji danych. Dodamy nową kolumnę w tabeli z danymi. W kolumnie będzie znajdował się przycisk, którego naciśnięcie spowoduje rozwinięcie formularza ("dropdown"):

##### Do modelu dopisz:
```js
async update(id, value, date) {
      const response = await fetchClient(`/api/update/${id}`, {
        method: 'PATCH',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({value: value, date: date}),
      });
      this.getData();
    }

    async updateVisibility(item) {
      this.data.forEach(dataItem => {
        if (dataItem != item) dataItem.isDropdownVisible = false;
      });
      item.isDropdownVisible = !(item.isDropdownVisible);
      this.notify();
    }
```
oraz w funkcji getData dodaj pobieranym z bazy elementom własność isDropdownVisible:
```js
const content = await response.json().then(data => {
        for(const item of data.map(item => {item.isDropdownVisible = false; return item;})) {
          this.data.push(item);
        }
      });
```

#### Zmodyfikuj `header` funkcji loadedView:
```js
const header = h('thead',
            h('tr',
                h('th', 'id'),
                h('th', 'value'),
                h('th', 'date'),
                h('th', 'delete'),
                h('th', 'update')
            )
    );
```

#### Oraz pojedynczy wiersz danych datarow.js:
dopisz do pliku funckje handleVisible oraz handleUpdate
```js
function handleUpdate(e, model, item) {
    e.preventDefault();

    let value = document.getElementById('valueUpdate').value;
    let date = document.getElementById('dateUpdate').value;

    if(value == "") value = item.value.toString();
    if(date == "") {
        const jsDate = new Date(item.date.toString());
        date = `${jsDate.getFullYear()}-${parseMonth(jsDate.getMonth())}-${jsDate.getDate()}`;
    }

    model.update(item.id, value, date);
    document.getElementById('update-form').reset();
}

function handleVisible(e, model, item) {
    e.preventDefault();
    model.updateVisibility(item);
}

function parseMonth(number) {
    number++;
    if (number < 10) return `0${number}`;
    return `${number}`;
}
```

I zmodyfikuj zwracany przez funkcję element:
```js
return [
        h('tr', [
            h('td', item.id),
            h('td', item.value),
            h('td', date),
            h('td', button("X", (e) => handleDelete(e, model, item))),
            h('td', button('Update', (e) => handleVisible(e, model, item))),
        ]),
        item.isDropdownVisible ? h('tr', {colspan: "4"}, h('div', form('update-form', 'Update', (e) => handleUpdate(e, model, item), 'valueUpdate', 'dateUpdate'))) : '',
    ];
```

Nie zapomnij dopisać linii `import form from '../loaded/form.js';` na górze pliku.

# 8. Obsługa filtrowania danych
Aby uniknąć błędów w obsłudze zapytania "getData" do serwera HTTP usuń z pliku `index.js` linię `if (filteredResults.length < 1) return res.send("No matching results");`. Brak danych pasujących do kryterium będzie obsługiwany w wyższych warstwach aplikacji.

Do pliku `Model.js` dopisz:
```js
async filter(id, value, year, month, day) {
      this.data = [];
      const filters = {
        id: id,
        value: value,
        date: (year && month && day) ? `${year}-${parseMonth(month)}-${parseDay(day)}` : undefined,
      };

      let queryString = `?`;
      let next = false;
      
      for (const [key, value] of Object.entries(filters)) {
        if (value && value !== "") {
          if (next) queryString += '&';
          if (key == 'date') queryString += `${key}='${value}'`;
          else queryString += `${key}=${value}`;
          next = true;
        }
      }
      
      const response = await fetchClient(`/api/getData${queryString}`, {
          method: 'GET',
      });
      const content = await response.json().then(data => {
        for (const item of data.map(item => {
          item.isDropdownVisible = false;
          return item;
        })) {
          this.data.push(item);
        }
      });
      this.notify();
    }
```

Korzystamy tutaj z funckji `parseMonth` oraz `parseDay`. W folderze public/utils utwórz plik `dateHelper.js` i umieść tam następujący kod:
```js
export function parseMonth(number) {
    if (number < 10) return `0${number}`;
    return `${number}`;
}

export function parseDay(number) {
    if (number < 10) return `0${number}`;
    return `${number}`;
}
```

W pliku `Model.js` dodaj odpowiedni import: `import { parseMonth, parseDay } from './utils/dateHelper.js'`;

W folderze loaded utwórz plik `filter.js`:
```js
import { h } from '/js/src/index.js';
import button from '../common/button.js';

function handleClear(e, model) {
    e.preventDefault();

    document.getElementById('filterID').value = "";
    document.getElementById('filterValue').value = "";
    document.getElementById('filterYear').value = "";
    document.getElementById('filterMonth').value = "";
    document.getElementById('filterDay').value = "";

    model.getData()
}

function handleFilter(e, model) {
    e.preventDefault();

    const id = document.getElementById('filterID').value;
    const value = document.getElementById('filterValue').value;
    const year = document.getElementById('filterYear').value;
    const month = document.getElementById('filterMonth').value;
    const day = document.getElementById('filterDay').value;

    model.filter(id, value, year, month, day);
}

export default function filter(model) {
        return h('div', {id: 'filterForm'}, [
                h('label', {for: "filterID"}, 'ID: '),
                h('input', {type: "text", name: "filterID", id: 'filterID'}),
                h('label', {for: "filterValue"}, 'Value: '),
                h('input', {type: "text", name: "filterValue", id: 'filterValue'}),
                h('label', {for: "filterYear"}, 'Year: '),
                h('input', {type: "text", name: "filterYear", id: 'filterYear'}),
                h('label', {for: "filterMonth"}, 'Month: '),
                h('input', {type: "text", name: "filterYear", id: 'filterMonth'}),
                h('label', {for: "filterDay"}, 'Day: '),
                h('input', {type: "text", name: "filterDay", id: 'filterDay'}),
            button('Filter', (e) => handleFilter(e, model)),
            button('Clear', (e) => handleClear(e, model)),
        ]
    );
}
```
W pliku `loaded-view.js` zmodyfikuj element zwracany przez funckję:
```js
return h('div',
        h('div', 
            form('insert-form', 'Insert data', (e) => handleInsert(e, model), "value", "date"),
            h('hr'),
            h('hr'),
            h('hr'),
            filter(model),
        ),
        h('table',
            header,
            model.data.length > 0 ? h('tbody', model.data.map(item => row(model, item))) : 'no matching items were found',
        )
    );
```
oraz dodaj odpowiedni import na górze pliku: `import filter from './filter.js';`.

Uruchom aplikację.

# 9. Ostylowanie aplikacji
1. najpierw zobacz [tu](https://aliceo2group.github.io/WebUi/Framework/docs/reference/frontend-css.html)
2. rightClick + Inspect...
3. CSS, załączanie pliku CSS do index.html

## W folderze public utwórz folder `styles`, a w nim plik [`custom.css`](https://github.com/xsalonx/cern_RCT_test/blob/master/crud/public/styles/custom.css) i załącz go w pliku `index.html` w sekcji head:
```html
<head>
    <link rel="stylesheet" href="/css/src/bootstrap.css">
    <--link rel="stylesheet" href="styles/custom.css">
    <!--favicon source: https://favicon.io/emoji-favicons/microscope/-->
    <link rel="icon" href="./images/favicon/favicon.ico">
    <meta charset="UTF-8">
    <title>CRUD Tutorial</title>
</head>
```

## Ostyluj komponent `button` (w pliku button.js):
```js
export default function button(label, onClickAction) {
    return h('div.fancyButton', {onclick: onClickAction},
        h('a', h('span', label))
    );
}
```

# 10. Więcej opisu do stylowania aplikacji

# 11. Taki ładny spinner dodamy
Utwórz komponent `spinner.js` w folderze public/components:
```js
import { h } from '/js/src/index.js';

export default function spinner() {
    return h('div.topSpace',
        h('div.center',
            h('div.atom-spinner.f1',
                h('div.spinner-inner',
                    h('div.spinner-line'),
                    h('div.spinner-line'),
                    h('div.spinner-line'),
                    h('div.spinner-circle', '●'),
                ),
            ),
        ),
        h('h5', 'Loading...'),
    );
}
```

Będziemy wyświetlać go w czasie ładowania danych. Mamy ich na razie bardzo mało, więc nakażemy aplikacji na kilka sekund iść spać. W `utils/sleep.js` napisz:
```js
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

W pliku Model.js `import { sleep } from './utils/sleep.js';`. W konstruktorze dodaj własność `this.spinner = false;`
Dalej dopisz:
```js
async wait() {
      this.spinner = true;
      this.notify();
      await sleep(3000);
      this.spinner = false;
      this.loaded = true;
      this.notify();
    }
```
Będziemy czekać przed załadowaniem danych do modelu. W fcji getData usuń linię `this.loaded = true;` i zamień linię `this.notify()` na `this.wait()`:

Zmodyfikuj `view.js`:
```js
import loadedView from './components/loaded/loaded-view.js';
import basic from './components/basic.js';
import spinner from './components/spinner.js';

export default function view(model) {
    return model.loaded? loadedView(model) : model.spinner ? spinner() : basic(model);
}

```

Uruchom aplikację i podziwiaj spinner w czasie ładowania danych.

# 12. Dalej:
- Model: routy dla CRUDa, fetchClient
- await, asynchroniczność [AJAX](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/async-calls.md): co to, po co, dlaczego
- może jakiś wykres wrzucić? coś [stąd](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/charts.md) np.

# 13. Zakończenie
Porównaj efekt końcowy z zawartością tego folderu.
