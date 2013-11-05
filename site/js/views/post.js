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
            
            // boolean passed in as an argument for 
            // specifying whether to use the compact
            // or regular template
            s.compact = args.compact;

            // get the room name from the model so that it
            // may be used to emit postView events to the room
            s.room = s.model.get('room');

            s.render();

            // re-render on any change to the post model
            s.listenTo(s.model,'change',s.render);
        },
        render: function () {
            var s = this;

            // make sure element is empty incase 
            // it is being re-rendered
            s.$el.empty();

            // create JSON object from model to pass to template
            var data = s.model.toJSON();
            
            // if an email exists create an MD5 hash
            // for gravatar to use
            data.hash = '';
            if(data.email) {
                data.hash = MD5.on(data.email);
            } 
            

            // if compact is true compile the PostCT template
            // otherwise the PostT template
            if(s.compact) {
                s.$el.append(_.template(PostCT)({data: data}));
            } else {
                s.$el.append(_.template(PostT)({data: data}));
                s.$el.addClass('clear');
            }

            // reselect timeago selector
            // there may be a better way to add 1 element
            $('time.timeago').timeago();

            // if the post had been deleted then add some content and 
            // the deleted class
            // (deleted posts are included for contextual reasons)
            if(data.deleted) {

                s.$('.text').text('Content has been deleted.').addClass('deleted');
                s.$('.text').css('background','#ffe5e5');

            }
        },
        deleteContent: function () {
            var s = this;

            // console.log('Delete post: ' + s.model.get('_id'));

            // build a delete action message
            var message = {
                text: s.model.get('_id'),
                type: 'action',
                action: 'delete',
                time: new Date().getTime()
            }
            
            // emit the delete action message to the room
            // no need to delete locally since action will 
            // fire a delete event to all connections include self
            window.socket.emit(s.room,message);

        }
            
    });

    return Post;

});
