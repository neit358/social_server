# Dockerfile for a Node.js application using Alpine Linux
FROM node:20-alpine as build-stage

COPY package.json ./

# Builder
WORKDIR /app

# Install dependencies
RUN npm install 

#Copy all file from the current directory to /app in the container
COPY . .

# Build the application
RUN npm run build

FROM node:20-alpine as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json ./package.json
COPY --from=build-stage /app/proto ./proto

WORKDIR /app

RUN npm install --production

expose 3001 

CMD ["node", "src/main.js"]