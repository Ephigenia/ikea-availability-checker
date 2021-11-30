FROM node:16.13.0-alpine

LABEL maintainer="Marcel Eichner <love@ephigenia.de>"

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --chown=node:node source ./
USER node
CMD "npm" "start"
