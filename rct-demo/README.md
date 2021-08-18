# Tu opis aplikacji rct-demo-app: idea ogólna
# Wprowadzenie: rct-intro
- przygotowanie środowiska tak, żeby aplikacja działała (baza danych itp.), częściowo to, co jest poniżej.

-------------
-------------
_wcześniejsze readme_ 

# WebUI-tutorial

```shell
git clone https://github.com/Ehevi/WebUI-tutorial WebUI-tutorial
cd WebUI-tutorial
```

## 1. Baza danych
Na potrzeby tutoriala tworzymy bazę danych, z którą będzie komunikować się nasza aplikacja. Do zarządzania bazą danych wykorzystujemy [PostgreSQL](https://www.postgresql.org/). Nie przedstawiamy procesu instalacji i lokalnej konfiguracji, ponieważ dla różnych systemów operacyjnych wyglądają one inaczej.

W folderze [postgres](https://github.com/xsalonx/cern_RCT_test/tree/master/postgres) znajdują się skrypty sql, z których korzystamy w kolejnych krokach. Zakładamy wykorzystanie klienta `psql`, który zapewnia interfejs konsolowy. Ponadto warto zapoznać się z narzędziem upraszczającym administrację bazą danych, [pgAdmin](https://www.pgadmin.org).

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
_Disclaimer:_ Przyjęty schemat najprawdopodobniej nie odzwierciedla rzeczywistych zależnośći pomiędzy danymi, o te trzeba będzie jeszcze dopytać.

![diagram](https://user-images.githubusercontent.com/48785655/127494257-59081600-07c4-4277-bee6-3acd5ceba941.png)

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

Zamiast uzupełniać tabele skryptami sql można też wykorzystać skrypty napisane w języku Python generujące przykładowe dane do tabel. Znajdują się one w folderze [pythonDBman](https://github.com/xsalonx/cern_RCT_test/tree/master/pythonDBman).

## 2. node-postgres
Do realizacji dalszej części konieczna jest wcześniejsza instalacja [node.js](https://nodejs.org/en/)'a. Jest to środowisko uruchomieniowe aplikacji pisanych w języku JavaScript. Z node.js'em powiązany jest manager pakietów - `npm` (Node Package Manager). Służy do instalacji i zarządzania modułami.

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
Dane wprowadzone przy tworzeniu nowej instancji klienta to te ze skryptów w punkcie 1. Port 5432 to domyślny port, na którym działa postgres.

Po uruchomieniu (`node index.js`) otrzymamy:
![webui](https://user-images.githubusercontent.com/48785655/125107704-67487f80-e0e1-11eb-957b-2832427fdc46.png)

## 3. WebUI framework
Tworzenie nowego projektu przy wykorzystaniu frameworka:

```shell
mkdir webui # utwórz nowy folder, w którym będzie znajdował się cały projekt
cd webui
npm -y init
npm install --save @aliceo2/web-ui
```
Polecenie `npm -y init` utworzy plik `package.json` i uzupełni go domyślnymi ustawieniami (można również wpisywać je samodzielnie, wtedy bez opcji `-y` ). Polecenie `npm install --save @aliceo2/web-ui` ściągnie paczkę frameworka i wszystkie przez niego wykorzystywane. Zostaną zapisane w folderze `node_modules`. Ich opis znajdzie się w pliku `package-lock.json`. Dodatkowo dzięki opcji `--save` w pliku `package.json` pojawi się zapis o zależnościach. Ma to tę zaletę, że folderu `node_modules` generalnie nie wrzuca się np. na GitHuba (plik .gitignore), a zapis wykorzystywanych zależności umożliwia ich proste zainstalowanie za pomocą `npm install`. Można to przetestować np. wywołując je po usunięciu folderu `node_modules`.

Zgodnie z zapisem w `package.json` plikiem wejściowym do aplikacji jest `index.js`:
```shell
touch index.js
```

W pliku package.json należy dopisać skrypt (8 linia pliku):
```json
"start": "node index.js"
```
(zgodnie z przyjętą we frameworku ![konwencją](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/devel.md#npm-scripts)). Teraz wpisanie w terminalu `npm start` będzie równoważne wywołaniu `node index.js`, czyli uruchomieniu aplikacji.

## 4. Przykładowa aplikacja
Znajduje się w folderze `webui`. Aby uruchomić aplikację należy najpierw zainstalować wszystkie wykorzystywane przez nią zależności (`npm install`), a następnie wywołać polecenie `npm start`. Z aplikacji można korzystać po wpisaniu w przeglądarkę adresu [http://localhost:8080](http://localhost:8080).

Przegląd plików w [folderze głównym](https://github.com/xsalonx/cern_RCT_test/tree/master/webui):
- `config.js`: konfiguracja połączenia dla serwera http
- `index.js`: plik wejściowy do aplikacji
- `db.js`: zawiera klasę PGCommunicator odpowiadającą za komunikację z bazą danych
- folder `public`: tam znajdują się pliki, które są udostępniane przez serwer Http (linijka `httpServer.addStaticPath('./public');` w pliku index.js). 

#### public

Plik `index.html` jest stroną ładowaną do okna przeglądarki pod wskazanym w pliku konfiguracyjnym adresem (localhost, port 8080).

WebUi jest frameworkiem korzystającym ze wzorca Model-View-Controller. Główny model znajduje się w pliku `public/Model.js`, oprócz niego aplikacja korzysta również z podmodeli (folder submodels). Widok jest funkcją przyjmującą model jako argument i prezentującą użytkownikowi odpowiednie elementy w zależności od zmian wprowadzanych w modelu.

Widok jest budowany przy pomocy komponentów (folder components). Definiuje się je przy pomocy funkcji `h()` ([hyperscript](https://github.com/AliceO2Group/WebUi/blob/dev/Framework/docs/guide/template-engine.md)). Każde wywołanie tej funkcji zwraca obiekt `vnode`, element drzewa DOM.
