define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');

    RoomSelector = Backbone.View.extend({
        tagName: 'div',
        className: 'listItem',

        events: {
            'click': 'open'
        },
        initialize: function (args) {
            var s = this;
            s.room = args.room;
            s.class = '.' + s.room + 'Selec';
            s.$el.html(s.room);
            console.log('in selector');
        },
        open: function () {
            var s = this, top = 0;
            $('.listItem').removeClass('selected');
            s.$el.addClass('selected');

            $('.room').removeClass('show');
            $(s.class).addClass('show');
          
            //scroll down
            if($(s.class + ' .post').last().position()) {
                top = $(s.class + ' .post').last().position().top
                if(top) {
                    $(s.class + ' .stream').scrollTop(top);
                }
            }

        }
    });
    return RoomSelector;

});
