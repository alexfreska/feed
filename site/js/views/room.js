define(function(require) {
    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        Post            = require('models/post'),
        Stream          = require('views/stream'),
        StreamSelector  = require('views/streamSelector'),
        RoomT           = require('text!templates/room.html'),
        PostFormT       = require('text!templates/postForm.html');
        //hljs            = require('highlight.js');

    Room = Backbone.View.extend({
        tagName: 'div',
        className: 'room',
        template: _.template(RoomT),
        events: {
            'click .submit': 'submit'
        },
        initialize: function (args) {
            var s = this;
    
        //using simple array as the collection for now
        s.posts = [];   
        
        // hash for tracking stream views
        s.streams = [];

        // hash for tracking selector views
        s.selectors = [];

        //grab user info
        s.user = args.user;
        console.log(s.user);

        //grab room and add class
        s.room = args.room;
        s.$el.addClass(s.room+'Selec');
        s.$el.attr('id',s.room);

        s.$el.append(this.template());
        
        //create initial streams
        s.mainStream = s.addStream('main',1);
        s.linkStream = s.addStream('links'); 
        s.codeStream = s.addStream('code'); 

        //add main stream and add a post form
        //s.$('.streams').prepend( s.mainStream.el );
        s.mainStream.$el.append(_.template(PostFormT)());
        
        //add event listener
        window.socket.on(s.room, function (data) {
            console.log('recieved data: ');
            console.log(data);
            if(data.type == 'init') {
                _.each(data.posts.reverse(), function(message,index) {
                    if(index == data.posts.length-1) {
                        s.process(message,{noScroll: 0});
                    }
                    else {
                        s.process(message,{noScroll: 1});
                    }
                });
            }
            else {
                s.process(data);
            }
        });

        s.$('.input').keypress(function (e) {
            if (e.keyCode == 13) {
                s.submit();
            }
        });

        },
        submit: function () {
            var s = this;

            var data = s.$('.input').val();
            if(data != '') {
            var message = {
                type: 'content',
                text: data,
                username: s.user.name,
                room: s.room,
                email: s.user.email
            }

                window.socket.emit(s.room,message);
            s.$('.input').val('');
            }
        },
        process: function (message,options) {
            var s = this;
    
            if(message.type == 'content') {
    
                s.addPost(message,options); 
            }
            else if(message.type == 'action') {
    
                s.action(message);
    
            }
    
        },
        addPost: function (message,options) {
            var s = this;
            
            //make a model
            var post = new Post(message);
            
            // Save model in posts array by _id
            s.posts[message._id] = post;

            //render and append post
            s.mainStream.post(post,options);
    
            // check for links
            var links = message.text.match(/((https?:\/\/)?([\da-z-]+[\.])+([a-z]{2,4})(\/[\w\da-z\-^\/\.]*)+\/?)/g)? 1 : 0;
            
            if(links) {
                s.linkStream.post(post,options);
            }

            // check for code
            var code = message.text.match(/```/g);
            console.log(code);
            if(code && code.length >= 2) {
                code = 1;
            } else {
                code = 0;
            }
            
            if(code) {
                message.text = message.text.replace(/```/,'<pre><code>');
                message.text = message.text.replace(/```/,'</code></pre>');
            
                post.set('text', message.text);

                code = s.codeStream.post(post,options);

            }
    
            // check for hash tags
            var tags = message.text.match(/#([\S]+)/g);
            
            console.log(tags);
            _.each(tags, function (tag) {
                tag = tag.substr(1, tag.length-1);
                if(s.selectors[tag]) {
                    s.streams[tag].post(post);
                } else {
                    s.addStream(tag);
                    s.streams[tag].post(post);
                }
            });
        },
        action: function (message) {
            var s = this;
    
            var post = s.posts[message._id]; //CHECK IN STREAM
            console.log(message);
            if(post) {
                if(message.action == 'delete') {

                    console.log(post);
                    post.set({'deleted': 1, 'text': ''});
                    console.log(post);

                }
                
            }
        },
        addStream: function (name,primary) {
            var s = this;
         
            //check that name has not been used

            var stream = new Stream({name: name});

            if(primary) {
                s.$('.streams').prepend( stream.el );
                stream.$el.addClass('show');
            } else {
                if(!s.selectors[name]) {
                    // add a new selector
                    var selector = new StreamSelector({name: name, room: s});
                    s.$('.streamSelectors').append( selector.el );

                    // add stream to secondary list
                    s.$('.secondary').append( stream.el );

                    // save stream to stream hash
                    s.streams[name] = stream;
                    //save to selector hash
                    s.selectors[name] = selector;
                }
            }
            return stream;
        }

    });

    return Room;

});
