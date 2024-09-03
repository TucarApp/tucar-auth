FROM node:18-alpine




# Create and change to the app directory.
WORKDIR /usr/app


# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY . .
# COPY .env .env


RUN npm install

ENV NODE_ENV production





# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.


# Copy local code to the container image.

RUN npm run build

CMD ["npm", "start"]