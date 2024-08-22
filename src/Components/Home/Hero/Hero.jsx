import React from 'react'
import './Hero.css'

function Hero() {
  return (
    <div className='heroContainer'>

      <h2>Consulta, <br />Tasa, Elige</h2>
      {/* falta decir coches de 2da mano, en toda españa.. */}
      <h2>Coches a la carta y financiación a tu medida, sin complicaciones.</h2>

      <p className='button'>Encuentra tu auto</p>
      <p className='button learnMore'>Tasa tu auto</p>
        
    </div>
  )
}

export default Hero