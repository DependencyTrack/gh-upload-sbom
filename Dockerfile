FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN npm ci --only=production

CMD [ "index.js" ]