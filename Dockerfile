FROM banian/node

# Copies dependencies in seperate layers to improve caching
COPY package.json yarn.lock /usr/src/app/

# Install dependencies
RUN yarn install

# Copy source
COPY . /usr/src/app/

# Let's go to /usr/src/app
WORKDIR /usr/src/app

# Let's open required ports
EXPOSE 8080

# Creates configurations based on environment variables
# and Command to execute.
CMD ./config.sh && yarn serve
