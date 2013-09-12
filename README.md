![feed.io](http://f.cl.ly/items/2I2x1A28111G1k220U0U/feed.io-ghbanner.png)

## feed.io

### What
**feed.io** is a real-time chat system focused on ease of use, productivity, collaboration, and security.

### Why
The motive behind this project was to address the significant shortcomings of current communication workflows. We realized our communication activties were fragmented across a mismatch of unique interfaces - at the very least one client for IRC, one for video, and another for audio. Some of these technologies worked great in specific use-cases but fell short in practice.

As developers, we noticed none of our solutions allowed us to have a simple IRC-like chat experience, while providing us with basic features such as syntax highlighting, file sharing, or *Push-to-Talk* (PTT) audio streams. Even worse, most of the alternatives were not open-source, could not be self-hosted, and lacked modern cryptographic encryption schemes to ensure secure conversations.

### Command Line
#### Install
    $ git clone https://github.com/alexfreska/feed.io.git
    $ cd feed.io
    $ npm install 
    $ node server.js
    
#### Dependencies
The application relies on MongoDB to persist data. You will need to make sure you have MongoDB installed and have the process running. [Click here for more information on installing MongoDB.](http://docs.mongodb.org/manual/installation/ "Install MongoDB")

### License
Copyright (c) 2013 [Alex Freska](https://github.com/alexfreska) and [Nikhil Srinivasan](https://github.com/nikhilsrinivasan). Licensed under the [MIT License](https://github.com/alexfreska/feed.io/blob/master/LICENSE).
