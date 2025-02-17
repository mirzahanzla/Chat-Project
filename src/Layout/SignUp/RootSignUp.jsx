import React from 'react'
import { Outlet } from 'react-router-dom'

const RootSignUp = () => {

    //  this is only used to if accdentically user input /Signup instaed of /SignUp/Brand ....
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default RootSignUp