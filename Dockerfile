FROM node:20-alpine

# Create app directory
WORKDIR /app
RUN apk add --no-cache openssl
RUN corepack enable

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

# Bundle app source
COPY . .

# Run yarn without generating a yarn.lock file
RUN yarn



# Use the port used by our server.js configuration
EXPOSE 3333

# This will run `yarn start` when the docker image is ran
CMD [ "yarn", "dev" ]