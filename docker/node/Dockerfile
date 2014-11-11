# Set base image
FROM ubuntu:13.10
RUN apt-get update

# Declare Node version to install
ENV NODE_VERSION 0.10.32

# Install dependencies
RUN apt-get install -y wget build-essential libreadline-gplv2-dev \
    libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev \
    libbz2-dev

# Install Python 2.7
RUN wget https://python.org/ftp/python/2.7.5/Python-2.7.5.tgz \
    --no-check-certificate \
    && tar -xvf Python-2.7.5.tgz \
    && cd Python-2.7.5 \
    && ./configure && make && make install

# Install Node
RUN wget http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.gz \
    && tar -xvf node-v$NODE_VERSION.tar.gz \
    && rm -f node-v$NODE_VERSION.tar.gz \
    && cd node-v$NODE_VERSION \
    && ./configure && make && make install

# Run `npm install` if package.json changes; otherwise, Docker will use cache.
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --unsafe-perm

# Create directory for app's code
RUN mkdir -p /code && cp -a /tmp/node_modules /code

# Exclude npm cache from the image
VOLUME /root/.npm

# Bundle app's source code into /code in container
ADD . /code

# Set working directory for "entrypoint" and "command" options
WORKDIR /code

# Expose Node to other containers through default HTTP port
EXPOSE 80

# Run container as "bash" executable
CMD ["bash"]
