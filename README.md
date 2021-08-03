# WebUI-tutorial

```shell
git clone https://github.com/Ehevi/WebUI-tutorial WebUI-tutorial
cd WebUI-tutorial
```

## 1. Baza danych
```shell
cd postgres
psql
\i create-user.sql # tworzy nowego użytkownika z hasłem, oczywiście można równoważnie wpisać do konsoli zawartość skryptu
\du # wyświetl listę użytkowników, powinien pojawić się nowy użytkownik; żeby wyjść: q
\i create-database.sql # tworzy bazę danych
\l # wyświetl listę baz danych, powinna się tam pojawić nowoutworzona baza danych
\i alter-database.sql # zmiana właściciela bazy danych na "rct-user"
\l
exit
```

`psql` zapewnia interfejs konsolowy, moim zdaniem wygodniej jest korzystać z narzędzia upraszczającego administrację bazą danych ([pgAdmin](https://www.pgadmin.org))

Praca użytkownika z bazą danych:
```shell
psql -d "rct-db" -U "rct-user" -W
```
Po wprowadzeniu hasła (`rct-passwd`) można sprawdzić parametry połączenia za pomocą polecenia `\conninfo`.

W przypadku błędu `psql: error: FATAL:  Peer authentication failed for user "rct-user"`, warto sprawdzić i ewentualnie zmodyfikować zawartość pliku `pg_hba.conf` (Ubuntu: `sudo nano /etc/postgresql/13/main/pg_hba.conf`). Jeżeli metoda autentykacji ustawiona jest na `peer`, to postgres będzie używał nazwy konta systemu operacyjnego jako nazwy bazy danych i nazwy użytkownika. Problem może rozwiązać zmiana linijki:
```
# TYPE DATABASE USER ADDRESS METHOD
local  all      all          peer
```
na:
```
# TYPE DATABASE USER ADDRESS METHOD
local  all      all          md5
```
czyli metodę autentykacji opartej o hasło.

Następnie należy zrestartować postgresa: `sudo service postgresql restart`.

### Tabele
_Disclaimer:_ Schemat najprawdopodobniej nie odzwierciedla rzeczywistych zależnośći pomiędzy danymi, o te trzeba będzie jeszcze dopytać.

```shell
psql -d "rct-db" -U "rct-user" -W
# utworzenie tabel:
\i periods.sql
\i mc.sql
\i runs.sql
\i flags.sql
\i b-fields.sql
\dt # wyświetl wszystkie tabele
select * from mc; # wyświetl wszystkie dane z tabeli mc

# uzupełnienie tabel:
\i fill-periods.sql
\i fill-runs.sql
\i fill-flags.sql
\i fill-mc.sql
\i fill-b-fields.sql
```

## 2. node-postgres
[`pg`](https://node-postgres.com) to moduł ułatwiający pracę z postgresem przy wykorzystaniu node.js'a.
Efekt końcowy można porównać z tym znajdującym się w folderze node-pg-basics.
```shell
mkdir node-pg-basics # utwórz nowy folder, w którym będzie znajdował się cały projekt
npm -y init
touch index.js
npm install pg
```

W pliku `index.js` łączymy się z utworzoną wcześniej bazą danych:
```js
const {Client} = require('pg')

const client = new Client({
    user: 'rct-user',
    host: 'localhost',
    database: 'rct-db',
    password: 'rct-passwd',
    port: 5432,
})

function select() {
    client.connect()
    .then(() => console.log("Connected successfully! :)"))
    .then(() => client.query("select * from home where year = $1", ["2022"]))
    .then((results) => console.table(results.rows))
    .catch(e => console.log(e))
    .finally(() => client.end())
}

select()
```

Po uruchomieniu (`node index.js`) otrzymamy:
![webui](https://user-images.githubusercontent.com/48785655/125107704-67487f80-e0e1-11eb-957b-2832427fdc46.png)

## 3. WebUI framework
Oczekiwany efekt końcowy znajduje się w folderze `webui`.

```shell
mkdir webui # utwórz nowy folder, w którym będzie znajdował się cały projekt
cd webui
npm -y init
npm install --save @aliceo2/web-ui
```
Polecenie `npm -y init` utworzy plik `package.json` i uzupełni go domyślnymi ustawieniami (można również wpisywać je samodzielnie, wtedy bez opcji `-y` ). Polecenie `npm install --save @aliceo2/web-ui` ściągnie paczkę frameworka i wszystkie przez niego wykorzystywane. Zostaną zapisane w folderze `node_modules`. Ich opis znajduje się w pliku `package-lock.json`. Dodatkowo dzięki opcji `--save` w pliku `package.json` pojawi się zapis o zależnościach. Ma to tę zaletę, że folderu `node_modules` generalnie nie wrzuca się np. na GitHuba (.gitignore), a zapis wykorzystywanych zależności umożliwia ich proste zainstalowanie za pomocą `npm install`. Można to przetestować np. wywołując je po usunięciu folderu `node_modules`.

Zgodnie z zapisem w `package.json` plikiem wejściowym do aplikacji jest `index.js`:
```shell
touch index.js
```

W pliku package.json należy dopisać skrypt (8 linia pliku):
```json
"start": "node index.js"
```
(zgodnie z przyjętą we frameworku ![konwencją](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/devel.md#npm-scripts)). Teraz wpisanie w terminalu `npm start` będzie równoważne wywołaniu `node index.js`.

Oprócz pliku wejściowego (index.js) będziemy korzystać również z plików `config.js` oraz `PgManager.js`. Jak łatwo się domyślić, zawartość pierwszego z nich to konfiguracja połączenia:
```js
module.exports = {
    jwt: {
      secret: 'supersecret',
      expiration: '5m'
    },
    http: {
      port: 8080,
      hostname: 'localhost',
      tls: false
    }
  };
```
natomiast plik `PgManager.js` zawiera klasę odpowiadającą za połączenie z bazą danych.