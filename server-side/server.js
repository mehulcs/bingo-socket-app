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
var usersarray={},usersobj={};
var count={};//count for playagain button
io.on('connection', function(socket){
    var obj={};
    console.log('Client connected');
    socket.on('createroom',function(data){
        obj.name=data[1];
        obj.id=socket;
        socket.room=data[0];
        count[data[0]]=1;
        socket.username=data[1];
        socket.join(data[0]);
        socket.emit('createres', data[0]);
        usersobj[data[0]]=[obj];
        usersarray[data[0]]=[data[1]];
        // console.log(usersobj);
        // console.log(usersarray);
    });

    socket.on('joinroom',function(data){
        var len,obj={};
        io.of('/').in(data[0]).clients(function(error,clients){
            len=clients.length;
        });
        setTimeout(function() {
            if(len == 0){
                socket.emit('refusejoin',data[0]);
            }else{
                obj.name=data[1];
                obj.id=socket;
                socket.username=data[1];
                socket.room=data[0];
                socket.join(data[0]);
                
                usersobj[data[0]].push(obj);
                usersarray[data[0]].push(data[1]);

                socket.emit('joinres',usersarray[data[0]]);
                socket.broadcast.to(data[0]).emit('users',usersarray[data[0]]);
                // console.log(usersobj);
                // console.log(usersarray);
            }      
        }, 1500);
    });

    socket.on('bingoinput',function(data){
        socket.broadcast.to(data[0]).emit('bingoinput', data[1]);
        var index=usersarray[data[0]].indexOf(data[2]);
        if(index==(usersarray[data[0]].length)-1){
            usersobj[data[0]][0].id.emit('nextchance',usersobj[data[0]][0].name);
            io.in(data[0]).emit('showuserschance',usersobj[data[0]][0].name);
        }else{
            usersobj[data[0]][index+1].id.emit('nextchance',usersobj[data[0]][index+1].name);
            io.in(data[0]).emit('showuserschance',usersobj[data[0]][index+1].name);
        }
        // console.log(usersobj[data[0]]);
    });

    socket.on('nextchanceonleave',function(data){
        var index=usersarray[data[0]].indexOf(data[1]);
        if(index==(usersarray[data[0]].length)-1){
            usersobj[data[0]][0].id.emit('nextchance',usersobj[data[0]][0].name);
            io.in(data[0]).emit('showuserschance',usersobj[data[0]][0].name);
        }else{
            usersobj[data[0]][index+1].id.emit('nextchance',usersobj[data[0]][index+1].name);
            io.in(data[0]).emit('showuserschance',usersobj[data[0]][index+1].name);
        }
    });

    socket.on('resetconfirm',function(room){
        
        var length;
        io.of('/').in(room).clients(function(error,clients){
            length=clients.length;
        });
        setTimeout(function() {
            if(length==1){
                socket.emit('resetgame',"nothing");
            }
        }, 1000);
        count[room]=1;
        socket.broadcast.to(room).emit('resetcount',"nothing");

    });
    socket.on('count',function(room){
        var length;
        count[room]++;
        io.of('/').in(room).clients(function(error,clients){
            length=clients.length;
        });
        setTimeout(function() {
            if(length==count[room]){
                io.in(room).emit('resetgame',"nothing");
                count[room]=1;
            }
        }, 1000);

    });

    socket.on('chatmessage',function(data){
        socket.broadcast.to(data[0]).emit('chatmessage', data);
    });
    socket.on('leaveroom',function(data){
        
        var index=usersarray[data[0]].indexOf(data[1]);
        usersarray[data[0]].splice(index,1);
        usersobj[data[0]].splice(index,1);
        if(usersarray[socket.room].length==0){
            delete(usersarray[data[0]]);
            delete(usersobj[data[0]]);
            delete(count[data[0]]);
        }else{
            socket.broadcast.to(data[0]).emit('users',usersarray[data[0]]);
        }
        socket.leave(data[0]);
        socket.room=null;
        // console.log(usersobj);
    });
    socket.on('disconnect', function(){
        console.log('Client disconnected');
        if(socket.room != null){
            var index=usersarray[socket.room].indexOf(socket.username);
    //-----nextchance on disconnect----------------
            if(index==(usersarray[socket.room].length)-1){
                usersobj[socket.room][0].id.emit('nextchance',usersobj[socket.room][0].name);
                io.in(socket.room).emit('showuserschance',usersobj[socket.room][0].name);
            }else{
                usersobj[socket.room][index+1].id.emit('nextchance',usersobj[socket.room][index+1].name);
                io.in(socket.room).emit('showuserschance',usersobj[socket.room][index+1].name);
            }
    //-------------------------------------------
            usersarray[socket.room].splice(index,1);
            usersobj[socket.room].splice(index,1);
            if(usersarray[socket.room].length==0){
                delete(count[socket.room]);
                delete(usersarray[socket.room]);
                delete(usersobj[socket.room]);
            }else{
                io.in(socket.room).emit('users',usersarray[socket.room]);
            }
        }
    });
});