# 1. Wstęp

Na potrzeby tutoriala utworzymy bazę danych, z którą będzie komunikować się nasza aplikacja. Do zarządzania bazą danych wykorzystujemy [PostgreSQL](https://www.postgresql.org/). Nie przedstawiamy procesu instalacji i lokalnej konfiguracji, ponieważ dla różnych systemów operacyjnych wyglądają one inaczej.

W folderze [postgres](https://github.com/xsalonx/cern_RCT_test/tree/master/postgres) znajdują się skrypty sql, z których korzystamy w kolejnych krokach. Zakładamy wykorzystanie klienta `psql`, który zapewnia interfejs konsolowy. Ponadto warto zapoznać się z narzędziem upraszczającym administrację bazą danych, [pgAdmin](https://www.pgadmin.org).

# 2. Baza danych
_Disclaimer:_ Przyjęty schemat bazy danych (rysunek poniżej) został stworzony na podstawie dokumentów dostępnych w momencie pisania tego pliku. Ze względu na napotkane niejednoznaczności lub/i błędy interpretacyjne najprawdopodobniej nie odzwierciedla on rzeczywistych zależności pomiędzy danymi.

![diagram](https://user-images.githubusercontent.com/48785655/127494257-59081600-07c4-4277-bee6-3acd5ceba941.png)

# 3. Wybierz jedną ze ścieżek:

| Wersja dla lubiących pisać / chcących poćwiczyć lub nauczyć się Postgresa | 4. |
|----------| ------------- |
| Wersja dla leniwych | 5. |
| Wersja dla bardzo leniwych | 6. |

# 4. Polecenia wpisywane ręcznie (:point_up: nie musisz niczego pobierać)
Uruchom psql z jako superuser (użytkownik `postgres` powiązany z bazą `postgres`).
Utwórz użytkownika i bazę danych, z których będzie korzystać aplikacja.
```shell
\du
CREATE USER "rct-user" WITH PASSWORD 'rct-passwd';
\du
\l
CREATE DATABASE "rct-db";
\l
ALTER DATABASE "rct-db" OWNER TO "rct-user";
\l
```
Połącz się z nowo utworzoną bazą danych jako nowo utworzony użytkownik.
```shell
\c "rct-db" "rct-user"
```
Wpisz zdefiniowane hasło (`rct-passwd`). Sprawdź parametry połączenia (`\conninfo`).

Utwórz tabele wpisując po kolei zawartość poniższych skryptów:
```sql
CREATE TABLE IF NOT EXISTS public.periods
(
    id serial NOT NULL,
    "year" smallint NOT NULL,
    period text NOT NULL,
    beam text NOT NULL,
    energy text NOT NULL,
    data_pass text NOT NULL,
    Jira text NOT NULL,
    ML text NOT NULL,
    QC text NOT NULL,
    production text not null,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.mc
(
    id serial NOT NULL,
    mu text,
    run_number int NOT NULL,
    ir text,
    filling_scheme text,
    period_id integer NOT NULL,

    PRIMARY KEY (id),
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);

CREATE TABLE IF NOT EXISTS public.runs
(
    id serial NOT NULL,
    period_id int NOT NULL,
    run_number int NOT NULL,
    PRIMARY KEY (id),
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);

CREATE TABLE IF NOT EXISTS public.flags
(
    id serial NOT NULL,
    "start" text NOT NULL,
    "end" text NOT NULL,
    flag text,
    comment text,
    run_id int NOT NULL,
    PRIMARY KEY (id),
    constraint fk_run_id foreign key(run_id) references public.runs(id) on delete cascade
);

CREATE TABLE IF NOT EXISTS public.b_fields
(
    id serial NOT NULL,
    period_id int NOT NULL,
    b_field text NOT NULL,
    PRIMARY KEY (id),
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);
```
Do zobaczenia listy relacji (tabel) znajdujących się w bazie służy polecenie `\dt`.

# 5. Polecenia uruchamiane za pomocą `\i`
Jeżeli pisanie (kopiowanie) okaże się zbyt męczące, przydatne jest polecenie `\i`. W celu uruchomienia aplikacji i tak zapewne konieczne jest skolonowanie tego repozytorium (`git clone https://github.com/xsalonx/cern-rct-demo.git`).
## 5.1. Utworzenie użytkownika i bazy danych
Przejdź do folderu, w którym znajdują się skrypty. Od głównego katalogu repozytorium ścieżka wygląda następująco:
```shell
cd rct-demo/rct-intro/pythonDBman/postgresql_scripts
```

Uruchom psql jako superuser (użytkownik `postgres` powiązany z bazą `postgres`). Na systemach linuxowych domyślnie zadziała polecenie `psql`, natomiast na Windowsie `runpsql` + najprawdopodobniej najpierw trzeba edytować zmienną środowiskową Path o np. `C:\Program Files\PostgreSQL\13\scripts`.
```shell
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
(na Windowsie uzupełnij odpowiednie dane po uruchomieniu )
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

## 5.2. Tabele
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

# 6. [pythonDBman](https://github.com/xsalonx/cern_RCT_test/tree/master/pythonDBman)
Automatyczne generowanie większej liczby przykładowych rekordów przy pomocy skryptów napisanych w języku Python.
Założyliśmy, że jako superuser wykonano skrypty:
1. **create-user.sql**
2. **create-database.sql**
   
Utworzona zostanie baza **"rct-db"** oraz użytkowanik **"rct-user"** z hasłem **"rct-passwd"**.
// Można stworzyć bazę i użytkownika używając własnych nazw i hasła.

Wykonaj skrypt ***main.py*** w ***/rct-demo/rct-intro/pythonDBman/***, spowoduje on utworzenie poszczególnych tebel i wypełnienie ich losowymi danymi.

Jeśli w kroku pierwszym utworzono bazę i użytkowanika używając własnych nazw i hasła, należy je podać jako argumenty skryptu `main.py` w kolejności \<nazwa użytkowanika\>, \<hasło\>, \<nazwa bazy danych\>.
*uwaga: do komunikacji z bazą z poziomu pyton-a potrzebna jest biblioteka [psycopg2](https://www.psycopg.org/docs/install.html)*
`pip install psycopg2-binary`