define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        RoomSelec   = require('views/roomSelector'),
        AppT        = require('text!templates/app.html'),
        MD5         = require('helpers/md5');

    RoomHandler = Backbone.View.extend({
        tagName: 'div',
        id: 'roomHandler',

        template: _.template(AppT),

        events: {
            'click .submit' : 'addRoom',
        },
        initialize: function (args) {
            var s = this;

            s.rooms = [];
            s.selectors = [];

            s.user = {
                name: args.user.name,
                email: args.user.email,
                hash: MD5.on(args.user.email)
            }

            s.$el.append(s.template({user: s.user}));

            //AUTOMATE - set timeout
            // setTimeout( function() {
            // s.addRoom()},
            // 10);
        },
        addRoom: function (e) {
            var s = this;

            //AUTOMATE
            // var newRoom = 'testRoom';
            e.preventDefault();
            var newRoom = s.$('#newRoom').val();

            if(!s.inRoom(newRoom) && s.user.name != '') {

                s.$('#newRoom').val('');

                //add to list
                var selector = new RoomSelec({room: newRoom});
                s.$('#roomList').append( selector.el );
                s.selectors[newRoom] = selector;


                //add room to list
                var room = new Room({room: newRoom, user: s.user});
                $('#container').append( room.el );
                s.rooms[newRoom] = room;

                //join room
                window.socket.emit('joinRoom',{room: newRoom, user: s.user});

                console.log('Joined: '+newRoom);

                //open room
                selector.open();

            }

        },
        inRoom: function (room) {
        var s = this;
            return s.rooms[room];

        }
    });

    return RoomHandler;

});
