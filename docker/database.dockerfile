FROM postgres:14.2-bullseye as base

FROM base as dev
    RUN apt update -y && \
        apt install -y \
        sudo \
        procps \
        inotify-tools

FROM base as test
