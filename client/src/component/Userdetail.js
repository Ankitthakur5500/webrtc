import React from 'react'

export default function Userdetail() {
  return (
    <div className='container'>
      <div>
        <form className='form'>
          <h1>Sign In</h1>
          <input className='attrAlignment' placeholder='Enter your email'></input>
          <input className='attrAlignment' placeholder='Enter your Room ID'></input>
          <button className='attrAlignment btn'>Join</button>
        </form>
      </div>
    </div>
  )
}
