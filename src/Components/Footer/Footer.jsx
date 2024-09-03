import React from 'react'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

function Footer() {
  return (
    <div className='footerContainer'>
      <div className='footerInfoContainer'>
        <div className='footerInfoItem'>
          <h6>Ubicación</h6>
          <p>Carrer de Joan Alcover, 13, <br />Palma, Illes Balears, España</p>
        </div>

        <div className='footerInfoItem'>
          <h6>Contacto</h6>
          <p> 
            <PhoneIcon fontSize='small'/> +34 660 48 51 29 <br /> 
            <a  className='contactText' href='https://www.instagram.com/autos_polomallorca/' target='blank'><InstagramIcon fontSize='small'/>@autos_polomallorca</a> <br />
            <MailOutlineIcon fontSize='small'/> <a href="automovilespolo@gmail.com" target='_blank' className='contactText'>automovilespolo@gmail.com</a>
          </p>
        </div>

        <div className='footerInfoItem'>
          <h6>Horario</h6>
          <p>Lunes a Viernes <br /> 9.30hs a 13.30hs - 16hs a 18hs</p>
        </div>
      </div>
      
      <p className='justina'>Powered by <a className='contactText' target='_blank' href="https://www.imjustwebs.com/"><strong > I'mJustWebs</strong></a></p>
    </div>
  )
}

export default Footer