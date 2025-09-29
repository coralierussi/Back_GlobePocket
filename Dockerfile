FROM node:20-alpine3.21
WORKDIR /app
RUN npm install -g typescript prisma
COPY package*.json ./
RUN npm install
COPY . .
RUN prisma generate
RUN tsc
EXPOSE 1337
CMD ["node", "dist/index.js"]
