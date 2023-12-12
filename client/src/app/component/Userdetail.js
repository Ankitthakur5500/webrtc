"use client"
import socket from '@/app/connection/page';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';



export default function Userdetail() {
  const [email,setEmail] = useState("");
  const [roomId,setRoomID] = useState("");
  const router = useRouter();

  function handleSubmitForm(event){    
    socket.emit("room:join",{email,roomId});
    event.preventDefault();
    setEmail("");
    setRoomID("");
  }
  
  const handleJoinRoom = (data)=>{
    const {email,roomId} = data;
    console.log("-->",email,roomId);
    router.push("/pages/videocall");   
  }

  useEffect(()=>{
    socket.on("room:join",handleJoinRoom);
    return ()=>{
      socket.off("room:join")
    }
  },[socket,handleJoinRoom]);

  return (
    <div className='container'>
      <div>
        <form className='form' onSubmit={handleSubmitForm}>
          <h1>Sign In</h1>
          <input  value={email} className='attrAlignment' placeholder='Enter your email' required type='email' onChange={(event)=>setEmail(event.target.value)}></input>
          <input value={roomId} className='attrAlignment' placeholder='Enter your Room ID'required onChange={(event)=>setRoomID(event.target.value)}></input>
          <button className='attrAlignment btn' type='submit'>Join</button>
        </form>
      </div>
    </div>
  )
}
