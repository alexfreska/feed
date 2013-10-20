define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');

    FeedSelector = Backbone.View.extend({
        tagName: 'div',
        className: 'selectorItem',

        events: {
            'click': 'open'
        },
        initialize: function (args) {
            var s = this;

            // save the feeds parent room
            s.room = args.room; 
            // save the name of the feed
            s.name = args.name;

            // add 'nameFeed', the schema for the CSS class used to 
            // uniquely identify the feed within the room
            s.class = s.name+'Feed';

            s.$el.text('#'+s.name);

        },
        open: function () {
            var s = this;

            // remove the selected class from any feedSelector that is 
            // currently selected
            $('.selectorItem').removeClass('selected');
            

            // add the selected class to this selector
            s.$el.addClass('selected');
            
            // hide all other feeds within the secondary section by 
            // removing the 'show' class
            // (accessed using parent rooms $el selector since the 
            // actual selector is in a separate part of the html)
            s.room.$('.secondary .feedContainer').removeClass('show');

            // add the show class to this feed 
            // (accessed using parent rooms $el selector since the 
            // actual selector is in a separate part of the html)
            s.room.$('.secondary .feedContainer.'+s.class).addClass('show');
            
        }
    
    });        
    
    return FeedSelector;

});
