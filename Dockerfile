FROM node:18 AS build
WORKDIR /src
COPY package*.json ./
RUN npm pkg set scripts.prepare='true' && npm install
COPY . .
RUN npm run build

FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm pkg set scripts.prepare='true' && npm install --production
COPY --from=build /src/dist /app/dist
EXPOSE 4000
CMD ["npm", "run", "prod:server"]
