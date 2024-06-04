from node:latest

RUN mkdir -p /server/api/
WORKDIR /server/api
ADD . /server/api

EXPOSE 80

RUN npm install

CMD ["node", "./src/index.js"]