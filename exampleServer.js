var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport');

// Prod vs Dev -----------------------------------------------------------------

var DOCKER_MONGODB_ADDR = process.env.DB_PORT_27017_TCP_ADDR;

var MONGODB_ADDR = DOCKER_MONGODB_ADDR | 'localhost';

// temporarily using existence of Docker env var to pick web port
var WEB_PORT = DOCKER_MONGODB_ADDR ? 80 : 1337;

// Initiate components ---------------------------------------------------------

var app = express();
app.use(express.static(__dirname + '/client'));

// We make use of an environment variable provided by Docker to access the
// 'mongo' container.
mongoose.connect('mongodb://' + MONGODB_ADDR + '/test');

// NODE ------------------------------------------------------------------------

// respond to favicon requests
app.get('/favicon.ico', function (request, response) {
    console.log('---');
    console.log('looking for favicon');

    response.send('ok');
});

// api used for all the frontend's async requests for data
app.get('/api/*', function (request, response) {
    var url = request.originalUrl;
    console.log('---');
    console.log('hit API endpoint: ' + url);

    response.send('API says you reached: ' + url);
});

// app paths are handled here.
// react will render logical and athenticated paths, otherwise 404 / redirect
app.get('*', function (request, response) {
    var url = request.originalUrl;
    console.log('---');
    console.log('hit webpage endpoint: ' + url);

    // we use the params here
    var params = url.split('/');

    // ensure valid url request has been made


    // ensure user making request has the correct permissions


    // render the react application for specified url


    response.send('You reached: ' + url);

});



var server = app.listen(WEB_PORT, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

// MONGODB ---------------------------------------------------------------------

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongoose connection error!'));

db.once('open', function () {
    var bandSchema = mongoose.Schema({
        name: String,
        genre: String
    });

    var Band = mongoose.model('Band', bandSchema);
    var arcadeFire = new Band({
        name: 'Arcade Fire',
        genre: 'rock'
    });

    arcadeFire.save(function (error, arcadeFire) {
        if (error) return console.error(error);
    });
});

// PASSPORT --------------------------------------------------------------------
app.post('/login', function (request, response) {
    response.send
});
