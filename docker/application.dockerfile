FROM node:18.16.0-buster as base 
    WORKDIR /opt/RunConditionTable

    RUN apt update -y && apt install -y \
        netcat \
        bash
    
# Ignore rule to pin package versions.  Given the number of dependencies this isn't feasible,
# and want the the latest to keep up with Chromium/Puppeteer changes.
# hadolint ignore=DL3008
RUN apt-get update && \
  apt-get -y install --no-install-recommends ca-certificates fonts-liberation libasound2 \
  libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
  libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
  libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxshmfence1 libxss1 \
  libxtst6 lsb-release procps wget xdg-utils && \
  rm -rf /var/lib/apt/lists/*

# Add user to avoid --no-sandbox (recommended)
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser

    
    # Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
    ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    # ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

    COPY ./package*.json ./
    RUN npm --silent ci


FROM base as dev
    RUN apt update -y && apt install -y \
        postgresql-client

FROM base as test
