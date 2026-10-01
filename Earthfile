VERSION 0.8

hugo-base:
    FROM alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6
    RUN apk add --no-cache git hugo

src:
    FROM +hugo-base
    WORKDIR /site
    COPY hugo.toml .
    COPY --dir assets content layouts static .

# build compiles the static website with Hugo and exports the public directory.
build:
    FROM +src
    ARG BASE_URL=""
    IF [ -n "$BASE_URL" ]
        RUN hugo --minify --baseURL "$BASE_URL"
    ELSE
        RUN hugo --minify
    END
    SAVE ARTIFACT public /public AS LOCAL public

node-base:
    FROM node:26.10.0-alpine3.24@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80
    WORKDIR /site
    COPY package.json package-lock.json ./
    RUN npm ci

browser-base:
    FROM +node-base
    RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
    ENV CHROME_PATH=/usr/bin/chromium-browser

# lint runs ESLint and Prettier checks on TypeScript source and test suites.
lint:
    FROM +node-base
    COPY eslint.config.js .prettierrc ./
    COPY --dir assets tests .
    RUN npm run lint

# lint-workflows audits GitHub Actions workflows with zizmor (https://docs.zizmor.sh).
lint-workflows:
    FROM ghcr.io/zizmorcore/zizmor:1.30.1
    WORKDIR /audit
    COPY --dir .github .
    RUN zizmor --no-online-audits --strict-collection .github

# test executes End-to-End (E2E) browser & UI state tests against the compiled static site.
test:
    FROM +browser-base
    COPY --dir +build/public .
    COPY --dir tests .
    RUN npm test

# check validates code quality, workflow security, and UI behavior concurrently.
check:
    BUILD +lint
    BUILD +lint-workflows
    BUILD +test

# all executes all validation checks.
all:
    BUILD +check

# lighthouse runs Lighthouse CI audits (both Mobile and Desktop) against the compiled static site.
lighthouse:
    FROM +browser-base
    RUN npm install -g @lhci/cli
    ENV LHCI_BUILD_CONTEXT__CURRENT_HASH=0000000000000000000000000000000000000000
    ENV LHCI_BUILD_CONTEXT__CURRENT_BRANCH=main
    ENV LHCI_BUILD_CONTEXT__COMMIT_TIME=1970-01-01T00:00:00Z
    COPY --dir +build/public .
    COPY lighthouserc.json .
    RUN lhci collect && lhci upload && \
        mv .lighthouseci /tmp/mobile
    RUN lhci collect --settings.preset=desktop && lhci upload && \
        mv .lighthouseci /tmp/desktop
    RUN mkdir -p .lighthouseci/mobile .lighthouseci/desktop && \
        cp -r /tmp/mobile/* .lighthouseci/mobile/ && \
        cp -r /tmp/desktop/* .lighthouseci/desktop/
    SAVE ARTIFACT .lighthouseci /lighthouse-results AS LOCAL .lighthouseci
