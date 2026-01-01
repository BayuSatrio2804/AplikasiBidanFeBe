FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Set host to 0.0.0.0 to allow access from outside container
# Install serve globally
RUN npm install -g serve

# Build the app at runtime to pick up environment variables, then serve it
CMD ["/bin/sh", "-c", "npm run build && serve -s build -l 3000"]
