define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');

    StreamSelector = Backbone.View.extend({
        tagName: 'div',
        className: 'selectorItem',

        events: {
            'click': 'open'
        },
        initialize: function (args) {
            var s = this;
            s.room = args.room; 
            s.name = args.name;
            s.class = s.name+'Stream';
            s.$el.addClass(s.name+'Stream');
            s.$el.text('#'+s.name);

        },
        open: function () {
            var s = this;
            console.log('click');
            $('.selectorItem').removeClass('selected');
            s.$el.addClass('selected');

            s.room.$('.secondary .streamContainer').removeClass('show');

            s.room.$('.secondary .streamContainer.'+s.class).addClass('show');
        }
    
    });        
    
    return StreamSelector;

});
