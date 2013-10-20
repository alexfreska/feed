
var     application_root    = __dirname,
        express             = require('express'),
        path                = require('path'), 
        mongoose            = require('mongoose'),
        http                = require('http'),
        _                   = require('underscore'),
        Schema              = mongoose.Schema;

var app     = module.exports    
            = express(), 
    server  = http.createServer(app), 
    io      = require('socket.io').listen(server);


// Uncomment to fall back to long polling ajax

io.configure(function () {

io.set("transports", ["xhr-polling"]);
io.set("polling duration", 10);

});

// Configure server
app.configure(function() {
    
    //parses request body and populates request.body
    app.use(express.bodyParser());

    //checks request.body for HTTP method overrides
    app.use(express.methodOverride());

    //perform route lookup based on url and HTTP method
    app.use(app.router);

    //Where to serve static content
    app.use(express.static(path.join(application_root, 'site')));

    //Show all errors in development
    app.use(express.errorHandler({
        
        dumpExceptions  : true,
        showStack       : true

    }));

});

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
    users     : [{userId: Number}],
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date, default: Date.now }

});

//Models
var PostModel   = mongoose.model( 'Post', Post );
var RoomModel   = mongoose.model( 'Room', Room );


// gets rooms list
//io.sockets.manager.rooms

io.sockets.on('connection', function (socket) {

    socket.on('joinRoom', function (data) {

            socket.join(data.room);

        RoomModel.findOneAndUpdate({name: data.room},{$push: { users: data.user}},{upsert: true}, function (err,room) {
        if(!err) {
            console.log(room);
            if(room) {
                PostModel.find({room: data.room}).sort('-_id').limit(10).exec( function (err,posts) {
                    if(!err) {
                        socket.emit(data.room,{room: room, posts: posts,type:'init'});
                    }
                    else {
                        console.log(err);
                    }
                });
            }
        }
        else {
            console.log(err);
        }

        });
        
            io.sockets.in(data.room).emit(data.room,{text:'User Joined Room!', type: 'info', time: new Date()});

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
                        }
                        else {
                            console.log(err);
                        }
                    });

                }
                else {
                    console.log(err);
                }

            });
                            
        }
        else if(message.type == 'info') {
                    
            io.sockets.in(data.room).emit(data.room,message);

        }
        else if (message.type == 'action') {
            if(message.action == 'delete') {
                PostModel.findOneAndUpdate({_id: message._id},{text: '', deleted: 1 }, function (err) {
                    if(!err) {
                        console.log('updated');

                    }
                    else {
                        console.log(err);
                    }
                });
            }   
            io.sockets.in(data.room).emit(data.room,message);

        }
            });

    });
});




var port = process.env.PORT || 3000;

if (!module.parent) {
  
    server.listen(port);

    console.log("App listening on port %d in %s mode", server.address().port, app.settings.env);

}
