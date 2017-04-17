'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));



















const io = socketIO(server);
var len=0;

io.on('connection', function(socket){
    console.log('Client connected');

    socket.on('createroom',function(room){
        socket.join(room);
        socket.emit('createres', room);
    });

    socket.on('joinroom',function(room){
        socket.join(room);
        socket.emit('joinres',room);
        // len=io.sockets.adapter.rooms[room].length;
    });

    socket.on('forroommembers',function(data){
        io.in(data[0]).emit('nextinput', data[1]);
    });

    socket.on('resetgame',function(room){
        io.in(room).emit('resetgame',"nothing");
    })
    socket.on('disconnect', () => console.log('Client disconnected'));
});
