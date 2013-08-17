requirejs.config({
    paths: {
        'jquery'        : 'lib/jquery.min',
        'underscore'    : 'lib/underscore-min',
        'backbone'      : 'lib/backbone-min',
        'socketio'      : '../socket.io/socket.io',
        'text'          : 'lib/text'
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

                Backbone.Model.prototype.ioBindVersion="0.4.6";Backbone.Model.prototype.ioBind=function(e,t,n,r){var i=this._ioEvents||(this._ioEvents={}),s=this.url()+":"+e,o=this;if("function"==typeof t){r=n;n=t;t=this.socket||window.socket||Backbone.socket}var u={name:e,global:s,cbLocal:n,cbGlobal:function(){var t=[e];t.push.apply(t,arguments);o.trigger.apply(o,t)}};this.bind(u.name,u.cbLocal,r||o);t.on(u.global,u.cbGlobal);if(!i[u.name]){i[u.name]=[u]}else{i[u.name].push(u)}return this};Backbone.Model.prototype.ioUnbind=function(e,t,n){var r=this._ioEvents||(this._ioEvents={}),i=this.url()+":"+e;if("function"==typeof t){n=t;t=this.socket||window.socket||Backbone.socket}var s=r[e];if(!_.isEmpty(s)){if(n&&"function"===typeof n){for(var o=0,u=s.length;o<u;o++){if(n==s[o].cbLocal){this.unbind(s[o].name,s[o].cbLocal);t.removeListener(s[o].global,s[o].cbGlobal);s[o]=false}}s=_.compact(s)}else{this.unbind(e);t.removeAllListeners(i)}if(s.length===0){delete r[e]}}return this};Backbone.Model.prototype.ioUnbindAll=function(e){var t=this._ioEvents||(this._ioEvents={});if(!e)e=this.socket||window.socket||Backbone.socket;for(var n in t){this.ioUnbind(n,e)}return this};Backbone.Collection.prototype.ioBindVersion="0.4.6";Backbone.Collection.prototype.ioBind=function(e,t,n,r){var i=this._ioEvents||(this._ioEvents={}),s=this.url+":"+e,o=this;if("function"==typeof t){r=n;n=t;t=this.socket||window.socket||Backbone.socket}var u={name:e,global:s,cbLocal:n,cbGlobal:function(){var t=[e];t.push.apply(t,arguments);o.trigger.apply(o,t)}};this.bind(u.name,u.cbLocal,r);t.on(u.global,u.cbGlobal);if(!i[u.name]){i[u.name]=[u]}else{i[u.name].push(u)}return this};Backbone.Collection.prototype.ioUnbind=function(e,t,n){var r=this._ioEvents||(this._ioEvents={}),i=this.url+":"+e;if("function"==typeof t){n=t;t=this.socket||window.socket||Backbone.socket}var s=r[e];if(!_.isEmpty(s)){if(n&&"function"===typeof n){for(var o=0,u=s.length;o<u;o++){if(n==s[o].cbLocal){this.unbind(s[o].name,s[o].cbLocal);t.removeListener(s[o].global,s[o].cbGlobal);s[o]=false}}s=_.compact(s)}else{this.unbind(e);t.removeAllListeners(i)}if(s.length===0){delete r[e]}}return this};Backbone.Collection.prototype.ioUnbindAll=function(e){var t=this._ioEvents||(this._ioEvents={});if(!e)e=this.socket||window.socket||Backbone.socket;for(var n in t){this.ioUnbind(n,e)}return this}
                Backbone.sync=function(e,t,n){var r=_.extend({},n);if(r.url){r.url=_.result(r,"url")}else{r.url=_.result(t,"url")||urlError()}var i=r.url.split("/"),s=i[0]!==""?i[0]:i[1];if(!r.data&&t){r.data=r.attrs||t.toJSON(n)||{}}if(r.patch===true&&r.data.id==null&&t){r.data.id=t.id}var o=t.socket||Backbone.socket||window.socket;var u=$.Deferred();o.emit(s+":"+e,r.data,function(e,t){if(e){if(n.error)n.error(e);u.reject()}else{if(n.success)n.success(t);u.resolve()}});var a=u.promise();t.trigger("request",t,a,n);return a};var urlError=function(){throw new Error('A "url" property or function must be specified')}

                return Backbone.noConflict();

            }
        }
    }
});

define(function(require) {
    var App = require('app');


    App.initialize();

})
