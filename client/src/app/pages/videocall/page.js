"use client"
import socket from '@/app/connection/page';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

export default function page() {
  const[connectionStatus,setConnectionStatus] = useState(null);
  const[myStream,setMyStream] = useState(null);
  const handleOnClick = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
    setMyStream(stream);
  }
  const handleUserJoined = ({email,id})=>{
    setConnectionStatus(id);
    console.log("-->",email,id);
  }
  useEffect(()=>{
    socket.on('user:joined',handleUserJoined);
    return ()=>{
      socket.off('user:joined',handleUserJoined);
    }
  },[socket,handleUserJoined]);
  return (
    <div className='videoCallPage'>
      <h1>Hello this is the trial video call!!</h1>
      <h2>{connectionStatus?"Connected":"Disconnected"}</h2>
      {connectionStatus && <button className='videocallbtn'onClick={handleOnClick}>CALL</button>}
      {myStream && <ReactPlayer playing muted height={"300px"} width={"500px"} url={myStream}/>}
    </div>
  )
}
