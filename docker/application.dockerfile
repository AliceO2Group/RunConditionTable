FROM node:18.16.0-buster as base 
    WORKDIR /opt/RunConditionTable

    RUN apt update -y && apt install -y \
        netcat \
        bash
    

RUN apt-get update && \
  apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0


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
