# RunConditionTable

## tests
[![Actions Status](https://github.com/AliceO2Group/RunConditionTable/workflows/Tests/badge.svg)](https://github.com/AliceO2Group/RunConditionTable/actions)

[![codecov](https://codecov.io/gh/AliceO2Group/RunConditionTable/branch/master/graph/badge.svg)](https://codecov.io/gh/AliceO2Group/RunConditionTable)

## npm commands
1. npm run start:dev - run nodemon
2. npm run eslint - static analysis, results in \<RCT-Dir/reports/static-analyzis.html\>
3. npm run reports:show - open reports
4. npm run test - static analysis, if ok then mocha tests



## developent

### database
for using manging mock data changes:
1. python > 3.7
2. jupyter notebook with nbconverter used to transform database/mock/mockData.ipynb to python scritpt, also required for git hook if changing this notebook