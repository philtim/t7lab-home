FROM node:20-alpine

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build

RUN npm install -g http-server
EXPOSE 8080
CMD ["http-server", "build"]
