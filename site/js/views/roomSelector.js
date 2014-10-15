define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        RoomSelectorT        = require('text!templates/roomSelector.html');

    RoomSelector = Backbone.View.extend({
        tagName: 'div',
        className: 'roomListItem',
        template: _.template(RoomSelectorT),

        events: {
            'click': 'open'
        },
        initialize: function (args) {
            var s = this;

            // save the room name
            s.room = args.room;

            // save the class name following the 'roomView' name 
            // schema, this is the unique class identifier for selecting
            // the roomView in the html
            s.roomViewClass = '.' + s.room + 'View';

            // update the text
            s.$el.append(s.template({name:s.room, notifications:1}));

        },
        open: function () {
            var s = this, top = 0;
            
            // remove the selected class from all other room selectors
            $('.roomListItem').removeClass('selected');

            // add the selected class to the current selector
            s.$el.addClass('selected');

            // remove the show class from all rooms
            $('.room').removeClass('show');

            // add the show class to the roomView html
            $(s.roomViewClass).addClass('show');
          
            // scroll down
            // if there is currently a post 
            if($(s.roomViewClass + ' .post').last().position()) {

                // save the top 
                top = $(s.roomViewClass + ' .post').last().position().top

                // if there is a post then top will not be undefined
                if(top) {

                    // scroll to top of last post 
                    $(s.roomViewClass + ' .feed').scrollTop(top);

                }
            }

        }
    });
    return RoomSelector;

});
