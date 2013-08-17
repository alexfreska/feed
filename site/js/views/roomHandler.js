define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        RoomSelec   = require('views/roomSelector');

    RoomHandler = Backbone.View.extend({
        el: '#roomHandler',

        events: {
            'click .submit' : 'addRoom',
            'click .login'  : 'login'
        },
        initialize: function () {
            var s = this;
            s.rooms = [];
            s.selectors = [];

            s.user = {
                name: ''
            }
        },
        addRoom: function (e) {
            var s = this;

            e.preventDefault();

            var newRoom = s.$('#newRoom').val();
            console.log(newRoom);
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
                window.socket.emit('joinRoom',{room: newRoom, user: s.user.name});

         }
            
        },
        inRoom: function (room) {
        var s = this;
            return s.rooms[room];
    
    },
    login: function () {
        var s = this;       

        var val = s.$('#username').val();
        if(val != '') {
            s.user.name = val;
            s.$('#userInfo').text(val);
        }
    }

    });

    return RoomHandler;

});
