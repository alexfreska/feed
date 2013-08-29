define(function(require, exports, module) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        RoomHandler = require('views/roomHandler'),
        Room        = require('views/room');
        
    /**
     * app#Router
     *
     * There is only one route in this app. It creates the new
     * Posts Collection then passes it to the form and list views.
     *
     * Then append the views to our page.
     */

    AppRouter = Backbone.Router.extend({

        routes: {
            
            ''  : 'index',
            '/' : 'index'
            
        },

        index: function() {
            
            var roomHandler = new RoomHandler();
        
        }

    });

    var initialize = function() {

        var appRouter = new AppRouter;

        Backbone.history.start();

    }

    return {

        initialize: initialize

    };

});
