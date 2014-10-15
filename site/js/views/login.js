define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        LoginT      = require('text!templates/login.html'),
        Vents       = require('vents/vents');

    Login = Backbone.View.extend({
        tagName: 'div',
        id: 'login-area',

        template: _.template(LoginT),

        events: {
            'click #login-button': 'login'
        },

        initialize: function () {
            var s = this;

            // add the login view template the the el
            s.$el.append(LoginT);

            // user object to record login info
            s.user = {
                name: '',
                email: ''
            }
            setTimeout(function(){
            $('#username').focus();
        },200);

        },
        // login procedure fired by the login button
        login: function (e) {
            var s = this;

            e.preventDefault();

            // grab username
            var val = s.$('#username').val();

            // if username field is not blank
            //if(val != '') {

                // set the user variable with name
                s.user.name = val;

                // update the user information view
                s.$('#userInfo .name').text(val);

                // grab user email
                val = s.$('#email').val();

                //if(val != '') {

                    // if the email field is not blank
                    s.user.email = val;

                    // update the user information view
                    s.$('#userInfo .email').text(val);

                    // trigger login event
                    Vents.trigger('login');
               // }

           //    }
        },
        // returns the user object
        getUser: function () {
            var s = this;

            return s.user;
        },
        // destroys the view
        close: function () {
            var s = this;

            s.remove();
        }

    });

    return Login;

});
