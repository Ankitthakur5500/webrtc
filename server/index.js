import { Server } from "socket.io";

const io = new Server(8000,{
    cors:{
        origin:"*"
    }
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map(); 

io.on("connection",(socket)=>{
    console.log("A New Socket Connected",socket.id);

    socket.on("room:join",(data)=>{
        console.log(data);
        const {email,roomId} = data;
        emailToSocketIdMap.set(email,socket.id);
        socketIdToEmailMap.set(socket.id,email);
        io.in(roomId).emit("user:joined",{email,id:socket.id});
        socket.join(roomId);
        io.in(socket.id).emit("room:join",data);
    });

});
console.log("port started at 8000");