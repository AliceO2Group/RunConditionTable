# 1. Baza danych
Za pomocą poleceń w `psql` stworzymy prostą bazę danych, z którą będzie komunikować się aplikacja:
```shell
psql
create user "crud-user" with password 'crud-passwd';
create database "crud-db";
alter database "crud-db" owner to "crud-user";
\q

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
mkdir crud
cd crud
touch index.js
npm init -y
```
... edit package.json file

```shell
npm install --save @aliceo2/web-ui
npm install pg
```
... folder structure
... files preview
