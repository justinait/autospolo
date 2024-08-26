import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div className='footerContainer'>
        <div className='footerInfoContainer'>
            <h6>Ubicación</h6>
            <p>Carrer de Joan Alcover, 13, <br />Palma, Illes Balears, España</p>


            <h6>Horario</h6>
            <p>Lunes a Viernes <br /> 9.30am a 1.30pm <br />4.00pm a 8.00pm</p>


            <h6>Contacto</h6>
            <p>automovilespolo@gmail.com <br /> +34 660 48 51 29</p>
        </div>
        
        <p className='justina'>Powered by <a target='_blank' to="https://www.imjustwebs.com/"><strong > I'mJustWebs</strong></a></p>
    </div>
  )
}

export default Footer