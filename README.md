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

2. `dev` - prune, build and run containers, one for the database and one for the application. Changes in the local repo force the application restart on docker (see nodemon and the `start:dev` script).
Dev does not deploy the new database, it only clears it. In case of any changes in the database or docker images, the use of `dev:prune` is advised.
3. `dev:up` - up stopped (previously) built contatiners (no data in db is erased)
4. `dev:up-r <DUMP_NAME>`  - as dev:up but also restore specified dump (existing in `<ProjectDir>/database/cache/dumps`), see the `dump:list` task
5. `app:attach` - attach to the application container console
6. `db:check` - export the current pgmodeler design as the database definition file, delete the database container and rebuild it with the new design. Application container will be deleted as well.
7. `db:attach` - run psql as postgres (connected to RCT database) on database container
8. `db:clean` - clean database in the running database docker

    <br>(Database dumps managing, dumps are stored in `<ProjectDir>/database/cache/dumps`)
9. `dump:make <DUMP_NAME>` - make a data dump and store it under the specified name
10. `dump:list` - list all the dumps stored in local cache
11. `dump:restore <DUMP_NAME>` - clean the db and restore the data from the specified dump file
12. `dump:remove <DUMP_NAME>` - remove the dump file from cache

    <br>(Testing)
13. `eslint` - static analysis, results in `<ProjectDir>/reports/static/static-analyzis.html`
14. `reports:show` - open reports
15. `docker:test` - run static analysis and codecov on docker containers, results are available in `<ProjectDir>/reports/`

Staging locally:
 1. `start:dev:local` - run RCT application locally, by default it fetch env vars from `<ProjectDir>/docker/env_file-dev` with exception that RCT_DB_HOST env var is substituted to localhost. If you want to make other substituions do in bash something like: `(export FOO=bar; npm run start:dev:local)`
 2. `deploy:db:local` - deploy database locally using scripts `<ProjectDir>/database/setup-db.sh`. It uses the same env as upper task and follows the logic of env vars substitution.

### Using grid certificates
Grid certificates need to be located in `<ProjectDir>/security/`. It have to be named (TMP TODO): `rct-alimonitor-cert.p12`. It is also required to set `ALIMONITOR_PASSPHRASE` env var which holds passphrase to that certificate.


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
2. RCT release procedure: [Release](./docs/RELEASE.md)