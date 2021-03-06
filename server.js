var application_root    = __dirname,
    express             = require('express'),
    path                = require('path'),
    mongoose            = require('mongoose'),
    http                = require('http'),
    _                   = require('underscore'),
    bodyParser          = require('body-parser'),
    errorHandler        = require('express-error-handler'),
    methodOverride      = require('method-override');

    Schema              = mongoose.Schema,

    app                 = module.exports
                        = express(),
    server              = http.createServer(app),
    io                  = require('socket.io').listen(server);

    //parses request body and populates request.body
    app.use(bodyParser());

    //checks request.body for HTTP method overrides
    app.use(methodOverride('X-HTTP-Method-Override'))

    //Where to serve static content
    app.use(express.static(path.join(application_root, 'site')));

    app.use( errorHandler({server: server}) );

//Connect to database
var uristring =
    process.env.MONGOLAB_URI    ||
    process.env.MONGOHQ_URL     ||
    'mongodb://localhost/feedio';

mongoose.connect(uristring);

//Schemas

var Post = new mongoose.Schema({
    type            : String,
    text            : String,
    deleted         : { type: Number, default: 0 },
    updated         : { type: Number, default: 0 },
    hasLink         : Number,
    hasAttachment   : Number,
    username        : String,
    email           : String,
    userId          : Number,
    createdAt       : { type: Date, default: Date.now },
    updatedAt       : { type: Date, default: Date.now },
    room            : String
});

//in progress
var Room = new mongoose.Schema({
    name      : String,
    users     : [{name: String, email: String, hash: String}],
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date, default: Date.now }
});

//Models
var PostModel   = mongoose.model( 'Post', Post );
var RoomModel   = mongoose.model( 'Room', Room );


// gets rooms list
//io.sockets.manager.rooms

io.sockets.on('connection', function (socket) {

    // save rooms that socket is connected to with this hash
    socket.rooms = {};

    socket.on('joinRoom', function (data) {

        // socket join specified room
        socket.join(data.room);

        // assert socket is in room
        socket.rooms[data.room] = {room: data.room, active: 1};

        // save user info to socket object
        socket.user = data.user;

        // FIX
        // code is not very necessary anymore, no need to push user
        RoomModel.findOneAndUpdate({name: data.room},{$push: { users: data.user}},{upsert: true}, function (err,room) {

            if(!err) {

                if(room) {

                    PostModel.find({room: data.room}).sort('-_id').limit(10).exec( function (err,posts) {

                        if(!err) {
                            socket.emit(data.room,{room: room, posts: posts,type:'init'});

                        } else {
                            console.log(err);
                        }

                    });

                }

            } else {

                console.log(err);

            }

        });

        console.log('Trying to add the following users:');

        _.each(io.sockets.sockets, function(soc) {

            if(soc.rooms[data.room] && soc.rooms[data.room].active) {

                console.log(soc.user);

                // add all active users to sockets user list
                socket.emit(data.room,{text: {user: soc.user}, type: 'action', action: 'join', time: new Date()});

            }

        });

        // let all connections add new user to list
        socket.broadcast.to(data.room).emit(data.room,{text: {user: data.user}, type: 'action', action: 'join', time: new Date()});

        socket.on(data.room, function(message) {

            if(message.type == 'content') {

                var post = new PostModel({
                    text        : message.text,
                    type        : 'content',
                    username    : message.username,
                    room        : message.room,
                    email       : message.email
                });

                console.log(post.createdAt);

                post.save( function (err,post) {

                    if(!err) {

                        //console.log(post);
                        io.sockets.in(data.room).emit(data.room,post);

                        RoomModel.findOneAndUpdate(
                                                   {
                            name    : data.room
                        },
                        {
                            updatedAt   : new Date(),
                            $push       : {
                                postIds: post._id
                            }
                        },
                        {
                            safe    : true,
                            upsert  : true
                        },
                        function (err,room) {

                            if(!err) {

                                console.log('updated room!');

                            } else {

                                console.log(err);

                            }

                        });

                    } else {

                        console.log(err);

                    }

                });

            } else if(message.type == 'info') {

                io.sockets.in(data.room).emit(data.room,message);

            } else if (message.type == 'action') {

                if(message.action == 'delete') {

                    PostModel.findOneAndUpdate({_id: message._id},{text: '', deleted: 1 }, function (err) {

                        if(!err) {

                            console.log('updated');

                        } else {

                            console.log(err);

                        }

                    });

                }

                io.sockets.in(data.room).emit(data.room,message);

            }
        });

    });

    socket.on('leaveRoom',function(data) {

        // socket leaves specific room
        socket.leave(data.room);

        // emit leave action to all users connected to the room
        io.sockets.in(data.room).emit(data.room,{text: {user: socket.user}, type: 'action', action: 'leave', time: new Date()});

    });

    socket.on('disconnect',function(data) {

        console.log('------------DISCONNECTED------------');
        console.log(socket.user);

        // for each room that the user was connected to
        _.each(socket.rooms, function (room) {

            // emit a leave action to all users connected to the room
            io.sockets.in(room.room).emit(room.room,{text: {user: socket.user}, type: 'action', action: 'leave', time: new Date()});

        });

        // socket oject is probably deleted but incase it sticks around:
        socket.rooms = {};

    });
});




var port = process.env.PORT || 3001;


    server.listen(port);

    console.log("App listening on port %d in %s mode", server.address().port, app.settings.env);

