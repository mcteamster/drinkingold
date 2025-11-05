FROM node:24-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 80
CMD npm run start