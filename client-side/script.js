
var socket = io("http://192.168.0.105:3000");
var roomnumber,data=[1111,'a'],arr = [],box=[],name,chance=0,last="";



// ------------registration----------------------------------------------
function register(event){ //read enter press
    var code=event.keyCode;
    if(code == 13){
        event.preventDefault();
        registername();
    }
}
function registername(){  
    name=document.getElementById('register-name').value;
    if(name == ""){
        alert("Please enter name");
        return false;
    }

    $(document.body).load("main.html");
}
function registerguest(){
    var val = Math.floor(1000 + Math.random() * 9000);
    name="guest"+val;
  
    $(document.body).load("main.html");
}
//----------------------------------------------------------------------------

function leave(){
    data[0]=roomnumber;
    data[1]=name;
    
    if(chance==1){
        socket.emit('nextchanceonleave',data);
    }
    socket.emit('leaveroom',data);
    $(document.body).load("main.html");
    chance=0;

}

function playarea(callback){
    $(document.body).load("bingo.html",function(){
        assignid();
        callback();
    });

}



// ----------createroom------------------------------------------------
function createroom(){   
    roomnumber = new Date().valueOf()%10000;
    data[0]=roomnumber;
    data[1]=name;
    socket.emit('createroom',data);    
    
}
socket.on('createres',function(mes){
    playarea(function(){
        var list=document.getElementById("users");
        document.getElementById("roomstatus").innerHTML="Room Number "+mes;
        list.innerHTML=list.innerHTML+'<div id="'+name+'" class="userlist"><p class="user">'+name+'</p></div>';
    });
    chance=1;
});

//----------joinroom-------------------------------------------------
function joinroom(){
    roomnumber=document.getElementById('input_room').value;
    if (roomnumber==""){  
        alert("Please Enter Room Number");  
        return false;  
    }else{
        data[0]=roomnumber;
        data[1]=name;
        socket.emit('joinroom',data);
    }
}
socket.on('joinres',function(users){
    playarea(function(){
        document.getElementById("roomstatus").innerHTML="Room Number "+roomnumber;
        var list=document.getElementById("users"),lists="";
        for(var i=0;i<users.length;i++){
            lists += '<div id="'+users[i]+'" class="userlist"><p class="user">'+users[i]+'</p></div>';
        }
        list.innerHTML=lists;
    });
});
socket.on('users',function(users){
    var list=document.getElementById("users"),lists="";
    for(var i=0;i<users.length;i++){
        if(users[i]==name&&chance==1){
            lists += '<div id="'+users[i]+'" class="userlist" style="border:2px solid #c554d8;"><p class="user">'+users[i]+'</p></div>';
        }else{
            lists += '<div id="'+users[i]+'" class="userlist"><p class="user">'+users[i]+'</p></div>';
        }
    }
    list.innerHTML=lists;
});
socket.on('refusejoin',function(room){
    alert("room "+room+ " doesn't exist");
    document.getElementById('input_room').value="";
});


//-----------bingobox inputs---------------------------------------------------
function bingomessage(boxnumber){
    if(chance==1){
        data[0]=roomnumber;
        data[1]=boxnumber;
        data[2]=name;    
        if(document.getElementById(boxnumber).style.backgroundColor=="white"){
            socket.emit('bingoinput',data);
            document.getElementById(boxnumber).style.backgroundColor="#ffb7c7";
            document.getElementById(name).style.border="2px solid lightblue";
            chance=0;
        }else{
            $('#myModal').modal('toggle');
            document.getElementById('alert').innerText="Box selected already..!";
        }
    }else{
        $('#myModal').modal('toggle');
        document.getElementById('alert').innerText="Please wait for your chance";
    }
}
socket.on('bingoinput',function(input){
    document.getElementById(input).style.backgroundColor="lightgreen";
});
socket.on('nextchance',function(data){
    chance=1;
    // document.getElementById(data).style.border="2px solid #c554d8";
});
socket.on('showuserschance',function(data){
    if(last!=""){
        document.getElementById(last).style.border="2px solid lightblue";
    }
    last=data;
    document.getElementById(data).style.border="2px solid #c554d8";
});

//--------------------------------------------------------------------------

function resetgame(){
    socket.emit('resetconfirm',roomnumber);
}
socket.on('resetcount',function(){
    $('#modal2').modal('toggle');
});
function confirmreset(){  //called on click yes
    socket.emit('count',roomnumber);
}


socket.on('resetgame',function(data){
    arr=[];
    getarray(function(){
        for(var i=0;i<25;i++){
            box[i].innerHTML=arr[i];
            box[i].id=arr[i];
            box[i].style.backgroundColor="white";
        }
    });
});


function getarray(callback){
    arr=[];
    while(arr.length < 25){
        var randomnumber = Math.ceil(Math.random()*25)
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
        if(arr.length==25){
            callback();
        }
    }
}
function assignid(){
    box = document.getElementsByTagName('td');
    getarray(function(){
        for(var i=0;i<25;i++){
            box[i].innerHTML=arr[i];
            box[i].id=arr[i];
            box[i].style.backgroundColor="white";
        }
    });
}




//-------------------------------chatroom----------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------

function chatmessage(){
    //sender
    var div = document.getElementById('chatbox');
    var mes=document.getElementById('input-chat').value,data=[];
    setTimeout(scrolldown,500);
    if(mes == ""){
        alert("Please Enter Message");  
        document.getElementById("input-chat").focus();
        return false;
    }else{
        data[0]=roomnumber;
        data[1]=mes;
        data[2]=name;
        socket.emit('chatmessage',data);
        div.innerHTML = div.innerHTML + '<div class="message-box-sender" style="float:right;"><p class="message">'+mes+'</p></div><br>';
    }
    document.getElementById('input-chat').value="";
    
}
socket.on('chatmessage',function(data){
    //receiver
    var div = document.getElementById('chatbox'); 
    div.innerHTML = div.innerHTML + '<div style="clear: both;"><div class="message-box triangle" style="float:left;background-color: rgba(202, 129, 195, 0.75);"><p class="message">'+data[2]+'</p></div><div class="message-box" style="float:left;"><p class="message">'+data[1]+'</p></div><br></div>';
    setTimeout(scrolldown,500);
});


function scrolldown(){
    var div=document.getElementById('chatbox');
    div.scrollTop = div.scrollHeight;
}

function enterbutton(event){
    var code=event.keyCode;
    if(code == 13){
        event.preventDefault();
        chatmessage();
    }
}
//-----------------------------------------------------------------------------------------------------------