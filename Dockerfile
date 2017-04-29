FROM banian/node

# Copies dependencies in seperate layers to improve caching
COPY package.json yarn.lock /usr/src/app/

# Install dependencies
RUN yarn install

# Copy source
COPY . /usr/src/app/

# Let's go to /usr/src/app
WORKDIR /usr/src/app

# Command to execute
CMD ["yarn", "serve"]
