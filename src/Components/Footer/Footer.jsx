import React from 'react'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

function Footer() {
  return (
    <div className='footerContainer'>
      <div className='footerInfoContainer'>
        <h6>Ubicación</h6>
        <p>Carrer de Joan Alcover, 13, <br />Palma, Illes Balears, España</p>

        <h6>Horario</h6>
        <p>Lunes a Viernes <br /> 9.30am a 1.30pm <br />4.00pm a 8.00pm</p>

        <h6>Contacto</h6>
        
        <p> 
          <MailOutlineIcon fontSize='small'/> <a href="automovilespolo@gmail.com" target='_blank' className='contactText'>automovilespolo@gmail.com</a> <br />
          <PhoneIcon fontSize='small'/> +34 660 48 51 29 <br /> 
          <a  className='contactText' href='https://www.instagram.com/autos_polomallorca/' target='blank'><InstagramIcon fontSize='small'/>@autos_polomallorca</a>
        </p>
      </div>
      
      <p className='justina'>Powered by <a target='_blank' to="https://www.imjustwebs.com/"><strong > I'mJustWebs</strong></a></p>
    </div>
  )
}

export default Footer