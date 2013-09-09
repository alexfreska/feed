requirejs.config({
    paths: {
        'jquery'        : 'lib/jquery.min',
        'underscore'    : 'lib/underscore-min',
        'backbone'      : 'lib/backbone-min',
        'socketio'      : '../socket.io/socket.io',
        'text'          : 'lib/text',
        'sta'           : 'lib/timeago'
    },
    shim: {
        'underscore': {
            exports     : '_'
        },  
        'socketio': {
            exports     : 'io'
        },
        'backbone': {
            deps        : ['underscore', 'jquery','socketio'],
            exports     : 'Backbone',
            init        : function () {

                var href = document.location.protocol + document.location.hostname;
                window.socket = io.connect(href);  

                return Backbone.noConflict();

            }
        }
    }
});

define(function(require) {
    var App = require('app'),
        $   = require('jquery'),
        // this might be causing error when script does not complete before
        // first post goes up
        sta = require('sta');

    App.initialize();

})
