var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const socketAuth = require('socketio-auth');

socketoptions = {
   transports: [ 'websocket', 'polling' ],
        secure:true,
        reconnect: true,
        rejectUnauthorized : false
};


// Client
var io2 = require('socket.io-client');
//var socket = io2.connect('http://localhost:8084', socketoptions);
//var socket = io2.connect('http://83.212.78.6:55528', socketoptions);
//var socket = io2.connect('http://factory.swarmlab.io:55528', socketoptions);
var socket = io2.connect('https://factory.swarmlab.io:55527', socketoptions);




socket.on('connection', s => {
      console.error('socket2 connection');
    var id = s.id


    var roomiot = 'iot'
    s.emit('subscribe', roomiot);

    s.emit('log', 'Hi from client-n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');


    s.on('message', function (data) {
      console.log('from room1 '+data);
   });
});
   var roomiot = 'iot'               
    socket.emit('subscribe', roomiot);
                                      
    socket.on('message', function (data) {
      console.log('from room '+data);     
   });                                    
                                          
    socket.emit('log', 'Hi from client-n');


    
                                           

