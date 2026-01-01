FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Set host to 0.0.0.0 to allow access from outside container
ENV HOST=0.0.0.0

CMD ["npm", "start"]
