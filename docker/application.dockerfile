FROM node:18.16.0-buster as base 
    WORKDIR /opt/RunConditionTable

    RUN apt update -y && apt install -y \
        netcat \
        bash

    COPY ./package*.json ./
    RUN npm --silent ci


FROM base as dev
    RUN apt update -y && apt install -y \
        postgresql-client

FROM base as test
