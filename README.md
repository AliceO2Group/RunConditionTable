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
7. npm run docker:prune - removes containers build by above command, assoc. volumes and networks

## using grid certificates
In '\<root\>/security/' need to locate grid certifcates. There are to ways.:<br>
1. cert.pem and privkey.pem from grid certificate
2. myCertificate.p12 from grid within setting ALIMONITOR_PASSPHRASE env var which hold passphrase to that certificate


## Reaching CERN network
1. Deafult bahviour of application running on docker (var `RUNNING_ENV` is set to `DOCKER`) is to use ssh proxy 'socks://172.200.200.1:12345' opened on a host, so you need to locally open ssh socket via command:
```bash
ssh -D 172.200.200.1:12345 <user>@<host>
```
or using script which opens defualt proxy (the same as above one)
```bash
./scripts/dev-sshopen.sh <USER> <SERVER_NAME>
```

2. If you want to use prxoy other than default (because  e.g. the application is <b>NOT</b> running on docker) you need to specify the socket you are going to use on your own. First open the socket via ssh:
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
2. jupyter notebook with nbconverter used to transform database/mock/mockData.ipynb to python scritpt, also required for git hook if changing this notebook
