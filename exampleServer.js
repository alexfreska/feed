var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport');

// Initiate components ---------------------------------------------------------

var app = express();
app.use(express.static(__dirname + '/client'));

// We make use of an environment variable provided by Docker to access the
// 'mongo' container.
mongoose.connect('mongodb://' + process.env.DB_PORT_27017_TCP_ADDR + '/test');

// NODE ------------------------------------------------------------------------

app.get('/example', function (request, response) {
    console.log("Now I'm ready to start!");
});

var server = app.listen(80, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

// MONGODB ---------------------------------------------------------------------

var db = mongoose.connection;
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
