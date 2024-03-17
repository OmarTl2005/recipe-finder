import React from 'react'

const Nav = () => {
  return (
    <div className='flex self-end justify-between w-full h-1/5'>
        <div className='w-3/4'>
        <a href='/'>Home</a>
        <a href='/login'>Login</a>
        <a href='/register'>register</a>
        </div>
    </div>
  )
}

export default Nav