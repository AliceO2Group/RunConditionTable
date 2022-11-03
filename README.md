# Run Condition Table
See the `rctmake` script used for managing project; get help via `./rctmake --help` command or in the source code 

## tests

[![Actions Status](https://github.com/AliceO2Group/RunConditionTable/workflows/Tests/badge.svg)](https://github.com/AliceO2Group/RunConditionTable/actions)

[![codecov](https://codecov.io/gh/AliceO2Group/RunConditionTable/branch/master/graph/badge.svg)](https://codecov.io/gh/AliceO2Group/RunConditionTable)


## development
Npm task; run via 
```bash
npm run <TASK>
```
Tasks:

Within docker:
1. `prune` - removes each container related to this project

2. `dev` - build and run two containers, one for database and one for application, changes in local repo force to restart application on docker, see nodeom, also script: npm run start:dev.
Does not deploy new database, only clear it. If some changes with database were made or dockers images have been changed use rather npm run dev:prune.
3. `dev:up` - up stopped (previoulsy) built contatiners (no data from db are ereased)
4. `dev:up-r <DUMP_NAME>`  - as dev:up but also restore specified dump (existing in )
5. `dev:prune` - as npm run prune and then npm run dev
6. `app:attach` - attach to application contatiner console
7. `db:check` - export database definition file from pgmodelere design after chagnes, delete database contatiner and rebuild (only it). Application contatiner will be deleted as well.
8. `db:attach` - run psql as postgres (connected to RCT database) on database contatiner
9. `db:clean` - clean database in running database docker

    <br>(Database dumps managing, dumps are stored in `<ProjectDir>/database/cache/dumps`)
10. `dump:make <DUMP_NAME>` - make dump (only data) and store it with specified name
11. `dump:list` - list available dumps
12. `dump:restore <DUMP_NAME>` - clean db and restore (only data) from specified dump file
13. `dump:remove <DUMP_NAME>` - remove dump file from cache

    <br>(Testing)
14. `eslint` - static analysis, results in `<ProjectDir>/reports/static/static-analyzis.html`
15. `reports:show` - open reports
16. `docker:test` - run static analysis and codecov on docker containers, results are available in `<ProjectDir>/reports/`

Staging locally:
 1. `start:dev:local` - run RCT application locally, by default it fetch env vars from `<ProjectDir>/docker/env_file-dev` with exception that RCT_DB_HOST env var is substituted to localhost. If you want to make other substituions do in bash something like: `(export FOO=bar; npm run start:dev:local)`
 2. `deploy:db:local` - deploy database locally using scripts `<ProjectDir>/database/setup-db.sh`. It uses the same env as upper task and follows the logic of env vars substitution.

### Using grid certificates
Grid certificates need to be located in `<ProjectDir>/security/`. It have to be named (TMP TODO): `myCertificate.p12`. It is also required to set `ALIMONITOR_PASSPHRASE` env var which holds passphrase to that certificate.


## Reaching CERN network
1. Default behaviour of the application running on docker (var `RUNNING_ENV` is set to `DOCKER`) is to use ssh proxy `socks://172.200.200.1:12345` opened on a host, so you need to locally open ssh socket via command:
```bash
ssh -D 172.200.200.1:12345 <user>@<host>
```
or using script which opens defualt proxy (the same as above one)
```bash
./scripts/dev-sshopen.sh <USER>
```

2. If you want to use proxy other than default (because  e.g. the application is <b>NOT</b> running on docker) you need to specify the socket you are going to use on your own. First open the socket via ssh:
```bash
ssh -D localhost:12345 <user>@<host>
```
then save the address of the socket you've opened in CERN_SOCKS env var e.g. 
```bash
export CERN_SOCKS='socks://localhost:12345'
```
3. If you want to not use proxy set CERN_SOCKS to false:
```bash
export CERN_SOCKS='false'
```

### database

for using, managing mock data changes:

1. python > 3.7
2. jupyter notebook with nbconverter used to transform `database/mock/mockData.ipynb` to python script, also required for git hook if changing this notebook

## Documentation links

1. Environment variables: [Configuration](./docs/CONFIGURATION.md)
