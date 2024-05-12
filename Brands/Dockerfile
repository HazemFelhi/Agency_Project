# Stage 1: Builder
FROM node:20.12.2-buster

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install application dependencies
RUN npm install

# Bundle your source code inside the Docker image
COPY . .

# Expose the port your app runs on
EXPOSE 3100

# Command to run your application
CMD ["node", "server.js"]

