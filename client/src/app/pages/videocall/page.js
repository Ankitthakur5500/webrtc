"use client"
import socket from '@/app/connection/page';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import peer from '@/app/services/peer';

export default function page() {
  const[remoteStream,setRemoteStream] = useState("");
  const[remoteSocketId,setRemoteSocketId] = useState(null);
  const[myStream,setMyStream] = useState(null);
  const handleOnClick = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit("user:call",{to:remoteSocketId,offer});
  }
  const handleUserJoined = ({email,id})=>{
    setRemoteSocketId(id);
    console.log("-->",email,id);
  }
  const handleIncommingCall = async({from,offer})=>{
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
    setMyStream(stream);
    console.log("incomming call",from,offer);
    const ans = await peer.getAnswer(offer);
    socket.emit('call;accepted',{to:from,ans});
  }
  const sendStream = ()=>{
    for(const track of myStream.getTracks()){
      peer.peer.addTrack(track,myStream);
    }
  }
  const handleCallAccepted = ({from,ans})=>{
    peer.setLocalDescription(ans);
    console.log('Call Accepted!');
    sendStream();
  }
  const handleNegoNeeded = async ()=>{
    const offer = await peer.getOffer();
    socket.emit('peer:nego:needed',{offer,to:remoteSocketId});
  }
  const handleNegoNeedIncomming = async ({from,offer})=>{
    const ans = await peer.getAnswer(offer);
    socket.emit('peer:nego:done',{to:from,ans});
  }
  const handleNegoNeedFinal = async({ans})=>{
    await peer.setLocalDescription(ans);
  }
  useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded',handleNegoNeeded);
    return ()=>{
      peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded);
    }
  },[handleNegoNeeded]);
  useEffect(()=>{
    peer.peer.addEventListener('track',async(event)=>{
      const remoteStream = event.streams;
      setRemoteStream(remoteStream[0]);
    });
  });
  useEffect(()=>{
    socket.on('incomming:call',handleIncommingCall);    
    socket.on('user:joined',handleUserJoined);
    socket.on('call:accepted',handleCallAccepted);
    socket.on('peer:nego:needed',handleNegoNeedIncomming);
    socket.on('peer:nego:final',handleNegoNeedFinal);

    return ()=>{
      socket.off('user:joined',handleUserJoined);
      socket.off('incomming:call',handleIncommingCall);   
      socket.off('call:accepted',handleCallAccepted);
      socket.off('peer:nego:needed',handleNegoNeedIncomming);
      socket.off('peer:nego:final',handleNegoNeedFinal);
    }
  },[socket,handleUserJoined,handleIncommingCall,handleCallAccepted,handleNegoNeedIncomming,handleNegoNeedFinal]);
  return (
    <div className='videoCallPage'>
      <h1>Hello this is the trial video call!!</h1>
      <h2>{remoteSocketId?"Connected":"Disconnected"}</h2>
      {/* {myStream && <button>Send Stream</button>} */}
      {remoteSocketId && <button className='videocallbtn'onClick={handleOnClick}>CALL</button>}
      <h3>My Stream</h3>
      {myStream && <ReactPlayer playing muted height={"300px"} width={"500px"} url={myStream}/>}
      <h3>Remote Stream</h3>
      {remoteStream && <ReactPlayer playing muted height={"300px"} width={"500px"} url={remoteStream}/>}
    </div>
  )
}
