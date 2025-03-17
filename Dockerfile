FROM node:22-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 80
CMD npm run start