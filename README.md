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

##### when developing/testing interfaces with other inner cern services setup env var RCT_SSH_SOCK=\<socks://host:port\>
### database

for using, managing mock data changes:

1. python > 3.7
2. jupyter notebook with nbconverter used to transform database/mock/mockData.ipynb to python scritpt, also required for git hook if changing this notebook
