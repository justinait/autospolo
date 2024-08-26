import React from 'react'
import logo from '/logo.jpeg'
import './Navbar.css'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

function Navbar() {
  return (
    <div className='navbarContainer'>
      <a href="/">
        <img src={logo} alt="AUTOS POLO" className='logoNavbar' />
      </a>
      <MenuRoundedIcon/>
    </div>
  )
}

export default Navbar