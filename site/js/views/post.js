define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        PostT       = require('text!templates/post.html'),
        MD5         = require('helpers/md5');

    Post = Backbone.View.extend({
        tagName: 'div',
        className: 'post',

        template: _.template(PostT),

        events: {
            'click .delete' : 'deleteContent'
        },
        initialize: function () {
            var s = this;

            s.room = s.model.get('room');

            s.render();

            s.listenTo(s.model,'change',s.render);
        },
        render: function () {
            var s = this;

            s.$el.empty();
            var data = s.model.toJSON();
            
            data.hash = '';
            if(data.email) {
                data.hash = MD5.on(data.email);
            } 
            console.log(data);
            
            s.$el.append(s.template({data: data}));

            if(data.deleted) {

                s.$('.content').text('Content has been deleted.').addClass('deleted');
                s.$el.css('background','#EEB4B4');

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
