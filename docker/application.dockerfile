FROM node:18.16.0-buster as base 

    WORKDIR /opt/RunConditionTable
    RUN apt update -y && apt install -y \
        netcat \
        bash
    COPY ./package*.json ./
    RUN npm --silent ci


FROM base as development
    RUN apt update -y && apt install -y \
        postgresql-client

    CMD [ "./scripts/check-host-and-exec.sh", "o2rct_database-dev", "5432", "10", "--", "npm", "run", "start:dev" ]


FROM base as test

    COPY ./.eslintrc ./
    COPY ./.nycrc ./
    COPY ./codecov.yml ./
    COPY ./test ./test
    COPY ./app ./app
    COPY ./scripts ./scripts

    CMD [ "./scripts/check-host-and-exec.sh", "o2rct_database-test", "5432", "10", "--", "npm", "run", "test" ]
