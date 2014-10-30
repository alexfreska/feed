# Set base image
FROM ubuntu:13.10
RUN apt-get update

# Declare Node and npm package versions to install
ENV NODE_VERSION 0.10.32
ENV EXPR_VERSION 4.9.8
ENV SOCK_VERSION 1.1.0
ENV PASS_VERSION 0.2.0
ENV MONG_VERSION 3.8.18

# Install dependencies
RUN apt-get -y install wget build-essential libreadline-gplv2-dev \
    libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev \
    libbz2-dev

# Install Python 2.7
RUN wget https://python.org/ftp/python/2.7.5/Python-2.7.5.tgz \
    --no-check-certificate \
    && tar -xvf Python-2.7.5.tgz \
    && cd Python-2.7.5 \
    && ./configure && make && make install
    # && ls /usr/bin

# Install Node and npm packages
RUN wget http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.gz \
    && tar -xvf node-v$NODE_VERSION.tar.gz \
    && rm -f node-v$NODE_VERSION.tar.gz \
    && cd node-v$NODE_VERSION \
    && ./configure && make && make install

RUN npm install --save express@$EXPR_VERSION socket.io@$SOCK_VERSION \
    passport@$PASS_VERSION mongoose@$MONG_VERSION

EXPOSE 80

# Run container as default command.
CMD ["bash"]
