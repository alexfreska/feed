define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');
        StreamT     = require('text!templates/stream.html'),
        Post        = require('views/post');

    Stream = Backbone.View.extend({
        tagName: 'div',
        className: 'streamContainer',

        template: _.template(StreamT),

        initialize: function (args) {
            var s = this;
            
            s.$el.addClass(args.name+'Stream');

            s.$el.append(s.template()); 
            
            s.last = {
                user: '',
                time: ''
            }

            s.used = 1;

            window.onfocus = function() {
                s.used = 1;
            };
            window.onblur = function() {
                s.used = 0;
            };
        },
        post: function (message,options) {
            var s = this;
            var compact = 0; 
            var messageRaw = message.toJSON();
            if(s.last.user == messageRaw.username) {
                compact = 1 
            } else {
                compact = 0;
            }
            s.last.user = messageRaw.username;
            s.last.time = new Date();

            var post = new Post({model: message, compact: compact});

            s.$('.posts').append( post.el );

            if(!options || !options.noScroll) {

                    s.$('.stream').animate({ scrollTop: post.$el.position().top });

            }
            return post;
        },
        addUserToReciept: function (message) {
            var s = this;

        }
    
    });

    return Stream;

});
