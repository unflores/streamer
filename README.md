The sockets service allows for the relaying of json messages in realtime to client sockets subscribed to specific rooms.  Messages are sent to the system via an http server.

## Setup

    mkdir ~/streamer
    git clone git@github.com:unflores/streamer.git ./
    sudo apt-get install nodejs
    sudo apt-get install npm
    npm install
    
## Client Sockets

Here is some client code for using the sockets service:

    // Connect to the socket server.  This assumes it is running on port 9090 on streamer.dev
    var env = 'blah';
    var socket = io.connect('http://localhost:9090');

    // Listen for the declare_room event
    socket.on('declare_room', function(data){

      // Subscribe to updates for all messages with a run with the id of 5
      socket.emit('subscribe', {room: env + 'foot_5'});

    });

    // On an updates event sent to this socket
    socket.on('updates', function (data) {
      console.log(data);
    });
    
## Send out updates
    
    curl -XPOST 'http://localhost:8081/group/5' -H "Content-Type: application/json" -d '{"id":"5","title":"other info"}'
