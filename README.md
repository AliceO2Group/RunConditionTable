# RunConditionTable

## tests

[![Actions Status](https://github.com/AliceO2Group/RunConditionTable/workflows/Tests/badge.svg)](https://github.com/AliceO2Group/RunConditionTable/actions)

[![codecov](https://codecov.io/gh/AliceO2Group/RunConditionTable/branch/master/graph/badge.svg)](https://codecov.io/gh/AliceO2Group/RunConditionTable)


## development
1. npm run start:dev - run nodemon
2. npm run eslint - static analysis, results in '\<root\>/reports/static/static-analyzis.html'
3. npm run reports:show - open reports
5. npm run docker:test - run static analysis and codecov on docker containers, results are available in '\<root\>/reports/'
6. npm run docker:dev - run two containers, one for database and one for application, changes in local repo force to restart application on docker, see nodeom, also script: npm run start:dev

## reaching CERN network
1. if application is running on docker env var RUNNING_ENV is set to 'DOCKER' so if going to use socket-proxy to reach cern network set env var CERN_SOCKS to 'true'.
```bash
export CERN_SOCKS='true'
```
Then it will use host's socket at 'socks://172.200.200.1:12345' so you must open localy ssh socket via command:
```bash
ssh -D 172.200.200.1:12345 <user>@<host>
```
2. if application is <b>NOT</b> running on docker and you want to reach cern network you must specify exact socket you've opened in CERN_SOCKS env var e.g. 
```bash
export CERN_SOCKS='socks://localhost:12345'
```
after opening such socket via ssh
```bash
ssh -D localhost:12345 <user>@<host>
```

### database

for using, managing mock data changes:

1. python > 3.7
2. jupyter notebook with nbconverter used to transform database/mock/mockData.ipynb to python scritpt, also required for git hook if changing this notebook
