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
            var s = this;
            $('.listItem').removeClass('selected');
            s.$el.addClass('selected');

            $('.room').removeClass('show');
            $(s.class).addClass('show');
            
            $(s.class + ' .stream').scrollTop($(s.class + ' .post').last().position().top);

            }
    });
    return RoomSelector;

});
