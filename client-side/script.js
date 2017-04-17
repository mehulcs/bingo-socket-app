
var socket = io("https://hidden-waters-71530.herokuapp.com/");
var roomnumber,data=[1111,'a'],arr = [],box=[];

function playarea(){
    // document.body.innerHTML = '<p>show bingo box</p>'+
    // '<button onclick="sendmessage()">Send to members</button>';
    document.body.innerHTML = '<div w3-include-html="content.html"></div>';
    
    w3IncludeHTML();
    assignid();
}
function createroom(){   
    roomnumber = new Date().valueOf()%10000;
    socket.emit('createroom',roomnumber);    
    playarea();
}
function joinroom(){
    roomnumber=document.getElementById('input_room').value;
    if (roomnumber==""){  
        alert("Please Enter Room Number");  
        return false;  
    }else{
        socket.emit('joinroom',roomnumber);
        playarea();
    }
}
function sendmessage(boxnumber){
    data[0]=roomnumber;
    data[1]=boxnumber;
    socket.emit('forroommembers',data);
}

socket.on('nextinput',function(input){
    document.getElementById(input).style.backgroundColor="lightgreen";
    // document.getElementById(input).style.color="white";
});
socket.on('createres',function(mes){
    setTimeout(function() {
        document.getElementById("roomstatus").innerHTML="Room Number "+mes;
    }, 2500);
    
});
socket.on('joinres',function(mes){
    setTimeout(function() {
        document.getElementById("roomstatus").innerHTML="Room Number "+mes;
    }, 2500);
});
socket.on('resetgame',function(data){
    arr=[];
    getarray();
    console.log(arr);
    setTimeout(function(){
        for(var i=0;i<25;i++){
            box[i].innerHTML=arr[i];
            box[i].id=arr[i];
            box[i].style.backgroundColor="white";
        }
    },1500);
});
function getarray(){
    
    while(arr.length < 25){
        var randomnumber = Math.ceil(Math.random()*25)
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    
}
function assignid(){
    box = document.getElementsByTagName('td');

    getarray();

    setTimeout(function(){
        for(var i=0;i<25;i++){
            box[i].innerHTML=arr[i];
            box[i].id=arr[i];
        }
    },1500);
    
}
function resetgame(){
    socket.emit('resetgame',roomnumber);
}
function chatmessage(){
    var div = document.getElementById('chatbox');
    var mes=document.getElementById('input-chat').value,data=[];
    
    setTimeout(scrolldown,500);
    if(mes == ""){
        alert("Please Enter Message");  
        return false;
    }else{
        data[0]=roomnumber;
        data[1]=mes;
        socket.emit('chatmessage',data);
        div.innerHTML = div.innerHTML + '<div class="message-box-sender" style="float:right;"><p class="message">'+mes+'</p></div><br>';
    }
    document.getElementById('input-chat').value="";
}
socket.on('chatmessage',function(message){
    
    document.getElementById('input-chat').value="";
    var div = document.getElementById('chatbox');
    div.innerHTML = div.innerHTML + '<div class="message-box" style="float:left;"><p class="message">'+message+'</p></div><br>';
    setTimeout(scrolldown,500);

});
function scrolldown(){
    var div=document.getElementById('chatbox');
    div.scrollTop = div.scrollHeight;
}