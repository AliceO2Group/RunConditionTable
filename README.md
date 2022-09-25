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
1. `prune` - removes each container related to this project

2. `dev` - build and run two containers, one for database and one for application, changes in local repo force to restart application on docker, see nodeom, also script: npm run start:dev.
Does not deploy new database, only clear it. If some changes with database were made or dockers images have been changed use rather npm run dev:prune.
3. `dev:up` - up stopped (previoulsy) built contatiners (no data from db are ereased)
4. `dev:up-re` - 
5. `dev:prune` - as npm run prune and then npm run dev
6. `app:attach` - attach to application contatiner console
7. `db:check` - export database definition file from pgmodelere design after chagnes, delete database contatiner and rebuild (only it). Application contatiner will be deleted as well.
8. `db:attach` - run psql as postgres (connected to RCT database) on database contatiner
9. `db:clean` - clean database in running database docker

    <br>(Database dump managing, dumps are stored in `<ProjectDir>/database/cache/dumps`)
10. `dump:make` <FILE_NAME> - make dump (only data) and store it with specified name
11. `dump:list` - list available dumps
12. `dump:restore` <FILE_NAME> - clean db and restore (only data) from specified dump file
13. `dump:remove` <FILE_NAME> - remove dump file from cache

    <br>(Other tasks)
14. `npm run start:dev` - start application with nodemon
15. `npm run eslint` - static analysis, results in `\<root\>/reports/static/static-analyzis.html`
16. `npm run reports:show` - open reports
17. `npm run docker:test` - run static analysis and codecov on docker containers, results are available in `\<root\>/reports/`


## using grid certificates
Grid certificates need to be located in `\<root\>/security/`. There are two options:<br>
1. `cert.pem` and `privkey.pem` from grid certificate
2. `myCertificate.p12` from grid within setting `ALIMONITOR_PASSPHRASE` env var which hold passphrase to that certificate


## Reaching CERN network
1. Default behaviour of the application running on docker (var `RUNNING_ENV` is set to `DOCKER`) is to use ssh proxy `socks://172.200.200.1:12345` opened on a host, so you need to locally open ssh socket via command:
```bash
ssh -D 172.200.200.1:12345 <user>@<host>
```
or using script which opens defualt proxy (the same as above one)
```bash
./scripts/dev-sshopen.sh <USER> <SERVER_NAME>
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
