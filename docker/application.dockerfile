FROM node:18-alpine3.17 as base
    WORKDIR /opt/RunConditionTable

RUN apk add --no-cache \
    bash=5.2.15-r0 \
    netcat-openbsd \
    vim


# Installs Git and packages required for Puppeteer
# https://pkgs.alpinelinux.org/packages
RUN apk add --no-cache \
    chromium=112.0.5615.165-r0 \
    freetype=2.12.1-r0 \
    freetype-dev=2.12.1-r0 \
    git=2.38.5-r0 \
    harfbuzz=5.3.1-r1 \
    ca-certificates=20230506-r0 \
    ttf-freefont=20120503-r3

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

    COPY ./package*.json ./
    RUN npm --silent ci


FROM base as dev
    RUN apk add postgresql-client

FROM base as test
