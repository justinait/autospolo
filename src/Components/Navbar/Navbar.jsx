import React from 'react'
import logo from '/logo.jpeg'
import './Navbar.css'

function Navbar() {
  return (
    <div>
        <img src={logo} alt="AUTOS POLO" className='logoNavbar' />
    </div>
  )
}

export default Navbar