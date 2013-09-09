define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');

    Login = Backbone.View.extend({
        el: '#login', 

        events: {
            'click .login': 'login'
        },

        initialize: function () {

        },
        login: function () {
            var s = this;       

            var val = s.$('#username').val();
            if(val != '') {
                s.user.name = val;
                $('#userInfo').text(val);
            }
            alert('blah');
        }
    }); 

});
