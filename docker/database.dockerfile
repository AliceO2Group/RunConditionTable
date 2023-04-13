FROM postgres:14.2-bullseye as base

WORKDIR /postgres/run

FROM base as development
    RUN apt update -y && \
        apt install -y \
        sudo \
        procps \
        inotify-tools

FROM base as test






