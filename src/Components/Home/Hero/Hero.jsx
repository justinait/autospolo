import React, { useEffect, useState } from 'react'
import './Hero.css'

function Hero() {

  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowFirst(true), 500);
    setTimeout(() => setShowSecond(true), 1500);
    setTimeout(() => setShowButtons(true), 2500);
  }, []);

  return (
    <div className='heroContainer' id='home'>

      <h2 className={`fade-in ${showFirst ? 'visible' : ''}`}>Consulta, Tasa, Elige.</h2>
      <h2 className={`fade-in ${showSecond ? 'visible' : ''}`}>Sin complicaciones.</h2>

      {/* falta decir coches de 2da mano, en toda españa.. */}
      {/* <h2>Coches a la carta y financiación a tu medida, sin complicaciones.</h2> */}
      <p className={`fade-in button ${showButtons ? 'visible' : ''}`}>Encuentra tu auto</p>
      <p className={`fade-in button learnMore ${showButtons ? 'visible' : ''}`}>Tasa tu auto</p>
      <div  className={`fade-in ${showButtons ? 'visible' : ''}`}>
      </div>
        
    </div>
  )
}

export default Hero