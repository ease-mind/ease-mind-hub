# Dockerfile para aplicação React (EaseMind)
FROM node:20.16.0-alpine
WORKDIR /app
COPY apps/. /app/apps/.
COPY packages/. /app/packages/.
COPY package*.json .
COPY turbo.json .
COPY yarn.lock .

RUN yarn install
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "run", "preview:all"]
