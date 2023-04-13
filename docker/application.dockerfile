# TODO upgrade node version
FROM node:16.20.0-buster as base 

    WORKDIR /opt/RunConditionTable
    RUN apt update -y && apt install -y netcat


FROM base as devdependencies
    RUN apt install -y bash
    COPY ./package*.json ./
    RUN npm --silent ci


FROM devdependencies as development

    CMD [ "./scripts/check-host-and-exec.sh", "o2-rct_database", "5432", "10", "--", "npm", "run", "start:dev" ]


FROM devdependencies as test

    COPY ./.eslintrc ./
    COPY ./.nycrc ./
    COPY ./codecov.yml ./
    COPY ./test ./test
    COPY ./app ./app
    COPY ./scripts ./scripts

    CMD [ "./scripts/check-host-and-exec.sh", "o2-rct_database", "5432", "10", "--", "npm", "run", "test" ]
