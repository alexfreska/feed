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
            'click .login': 'login'
        },

        initialize: function () {
            var s = this;
            s.$el.append(LoginT);
            
            s.user = {
                name: '',
                email: ''
            }
        },
        login: function () {
            var s = this;       

            var val = s.$('#username').val();
            if(val != '') {
                s.user.name = val;
                s.$('#userInfo .name').text(val);

                val = s.$('#email').val();
                if(val != '') {
                    s.user.email = val;
                    s.$('#userInfo .email').text(val);

                    Vents.trigger('login');
                }

            }
        },
        getUser: function () {
            var s = this;

            return s.user;
        },
        close: function () {
            var s = this;

            s.remove();
        }
        
    }); 

    return Login;

});
