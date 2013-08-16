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
        },
        post: function (message,options) {
            var s = this;

            var post = new Post({model: message});

            s.$('.posts').append( post.el );

            if(!options || !options.noScroll) {

                    s.$('.stream').animate({ scrollTop: post.$el.position().top });

            }
        }
    
    });

    return Stream;

});
