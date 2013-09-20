define(function(require, exports, module) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        RoomHandler = require('views/roomHandler'),
        Room        = require('views/room'),
        Login       = require('views/login'),
        Vents       = require('vents/vents');
        
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

        index: function () {
            var s = this;

            var login = function () {

                var user = s.loginView.getUser();
                s.loginView.close();

                $('#container').empty(); 

                var roomHandler = new RoomHandler({user: user});
                $('#container').append( roomHandler.el );

            }

            s.loginView = new Login();
            $('#container').append( s.loginView.el );

            Vents.on('login',login);

                        

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
