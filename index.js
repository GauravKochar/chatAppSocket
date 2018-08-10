var app=require('express')();
var socket= require('socket.io');
var users=[];
var onlineuser = [];
var server= app.listen(9000,(req,res)=> {
    console.log("Server is running in 9000 port")
});

var io = socket(server);

app.set('view engine','ejs');
app.get("/",(req,res)=> {

    res.render('index');
});
app.get("/chat",(req,res)=> {

    res.render('chat');
});
io.on('connection',(socket)=> {
    users.push(socket);
  
   console.log("user is connected"+users.length);

   socket.on("disconnect",(socket)=> {
    users.splice(users.indexOf(socket),1);
    onlineuser.splice(onlineuser.indexOf(socket.username),1);    
    console.log('user is disconnected',users.length);
   });
    
    socket.on('new user',function(data) {
        console.log(data);
        socket.username = data; 
        onlineuser.push(socket.username);   
        console.log(socket.username);
     
    socket.emit('get user',socket.username);
       // updateuser();
    });
    socket.on('msg', function(name,message) {
        console.log(name,message);
        io.sockets.emit('rmsg',{name:name,msg:message});


    })
    socket.on('typing',function(data) {
        socket.broadcast.emit('showTypingMsg',data);

    });
  

});




