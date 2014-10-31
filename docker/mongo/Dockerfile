# Set base image
FROM ubuntu:13.10
RUN apt-get update

# Declare Mongo version to install
ENV MONGO_VERSION 2.6.5

# Install depedencies
RUN apt-get install -y curl

# Install Mongo
RUN curl -o /usr/local/bin/gosu -SL \
    "https://github.com/tianon/gosu/releases/download/1.1/gosu" \
    && chmod +x /usr/local/bin/gosu

RUN gpg --keyserver pgp.mit.edu --recv-keys \
    DFFA3DCF326E302C4787673A01C4E7FAAAB2461C

RUN curl -SL \
    "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-$MONGO_VERSION.tgz" \
    -o mongo.tgz \
    && curl -SL \
    "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-$MONGO_VERSION.tgz.sig" \
    -o mongo.tgz.sig \
    && gpg --verify mongo.tgz.sig \
    && tar -xvf mongo.tgz -C /usr/local --strip-components=1 \
    && rm mongo.tgz*

# Create /data/db directories in container
VOLUME /data/db

# Expose MongoDB to other containers through default MongoDB port
EXPOSE 27017

# Configure container to run as 'mongod' executable
ENTRYPOINT ["mongod"]

# Provide a default argument for the entrypoint
CMD ["--smallfiles"]
