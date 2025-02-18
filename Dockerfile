FROM node:22
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 80
CMD node ./controller/server.js | tee -a log.txt