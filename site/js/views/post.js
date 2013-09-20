define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        PostT       = require('text!templates/post.html'),
        PostCT      = require('text!templates/postCompact.html'),
        MD5         = require('helpers/md5');

    Post = Backbone.View.extend({
        tagName: 'div',
        className: 'post',

        template: _.template(PostT),

        events: {
            'click .delete' : 'deleteContent'
        },
        initialize: function (args) {
            var s = this;
            
            s.compact = args.compact;

            s.room = s.model.get('room');

            s.postT = _.template(PostT);
            s.postCT = _.template(PostCT);

            s.render();

            s.listenTo(s.model,'change',s.render);
        },
        render: function () {
            var s = this;

            // make sure element is empty incase 
            // it is being re-rendered
            s.$el.empty();

            // create JSON object from model
            var data = s.model.toJSON();
            
            // if an email exists create an MD5 hash
            // for gravatar to use
            data.hash = '';
            if(data.email) {
                data.hash = MD5.on(data.email);
            } 
            

            if(s.compact) {
                s.$el.append(s.postCT({data: data}));
            } else {
                s.$el.append(s.postT({data: data}));
            }

            // reselect timeago selector
            // there may be a better way to add 1 element
            $('time.timeago').timeago();

            if(data.deleted) {

                s.$('.text').text('Content has been deleted.').addClass('deleted');
                s.$('.text').css('background','#ffe5e5');

            }
        },
        deleteContent: function () {
            var s = this;
            console.log('Delete post: ' + s.model.get('_id'));

            var message = {
                _id: s.model.get('_id'),
                type: 'action',
                action: 'delete',
                time: new Date().getTime()
            }
            
            window.socket.emit(s.room,message);

        }
            
    });

    return Post;

});
