/*
  This is a small mini http server and socket.io server.  It does two things:
  1. Maintain an open connection with listening client sockets
  2. Respond to http requests and pass their json to listening socket clients
     curl -XPOST 'http://streamer.dev:8081/foot/3' -H "Content-Type: application/json" -d '{"id":"3","foot_updates": "stuff"}'

*/
require.main.paths.push('/usr/local/lib/node_modules');

var io        = require('socket.io').listen(9090),
    express   = require('express'),
    app       = express(),
    url       = require('url'),
    _         = require('underscore'),
    io_client = require('socket.io-client').connect('localhost', { port: 9090 }),
    channels  = [];


// Manage Incoming http requests
app.configure(function(){
  app.use(express.bodyParser());
});


app.post(/([^\/]+)\/(\d+)/, function(req, res){
  if(req.ip !== '127.0.0.1'){
    res.send("ERROR: Invalid Source.\n");
    return;
  }
  var news = req.body;
  news.room = req.params[0] + '_' + req.params[1];
  io_client.emit('rebroadcast', news );
  res.send("SUCCESS: Streaming to other clients.\n");
});

app.listen(8081);



// Socket Management

io.sockets.on('connection', function (client) {
  console.log('Connected to streamer');

  client.emit('declare_room', {});

  client.on('subscribe', function(data) { client.join(data.room); });

  client.on('unsubscribe', function(data) { client.leave(data.room); });

  client.on('rebroadcast', function (data) {
    console.log('in rebroadcast');
    io.sockets.in(data.room).emit('updates', data);
  });

});