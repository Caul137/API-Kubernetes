FROM node:20.17.0 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci 
COPY . .

RUN npm run build

RUN rm -rf node_modules
RUN npm ci --omit=dev

FROM node:20.17.0-alpine3.20

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/package-lock.json ./package-lock.json
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start" ]