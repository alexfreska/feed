define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');
        FeedT       = require('text!templates/feed.html'),
        Post        = require('views/post');

    Feed = Backbone.View.extend({
        tagName: 'div',
        className: 'feedContainer',

        template: _.template(FeedT),

        initialize: function (args) {
            var s = this;
            
            // add class 'nameFeed' so that feed selector has something to grab
            // (not using an id since a different room may have a feed with the same class name
            // only in a different html scope)
            s.$el.addClass(args.name+'Feed');

            // add the feed template to the feed el
            s.$el.append(s.template()); 
            
            // initialize object for recording the last posts user and time
            s.last = {
                user: '',
                email: '',
                time: ''
            }


        },
        post: function (message,options) {
            var s = this;

            // boolean for compact vs regular posts
            // (compact posts do not have user and time info
            // and are used when the post above is recent and 
            // by the same user)
            var compact = 0; 

            // check if the message email is the same as last
            // to see if a compact post can be used
            console.log(message.get('email'));
            if(s.last.email == message.get('email')) {
                compact = 1 
            } else {
                compact = 0;
            }

            // save some info
            s.last.user = message.get('username');
            s.last.email = message.get('email');

            // time can be used to for a max time for a compact post
            // that way new post will have its own timeago 
            s.last.time = new Date();

            //  a new postView is created from the message model
            var postView  = new Post({model: message, compact: compact});

            // add the post view to the feed
            s.$('.posts').append( postView.el );

            // if there are no options, specifically noScroll
            if(!options || !options.noScroll) {

                    // scroll the feed down so that the new post is visible
                    s.$('.feed').animate({ scrollTop: postView.$el.position().top });

            }

            return postView;
        }
    
    });

    return Feed;

});
