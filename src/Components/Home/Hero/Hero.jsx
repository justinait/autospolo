import React, { useEffect, useState } from 'react'
import './Hero.css'
import { Link } from 'react-router-dom';

function Hero() {

  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowFirst(true), 500);
    setTimeout(() => setShowSecond(true), 1500);
    setTimeout(() => setShowButtons(true), 2500);
  }, []);

  const scrollToContactSection = () => {
    const section = document.getElementById('contact');
    if (section) {
      const offset = section.offsetTop - 8 * window.innerHeight / 100;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='heroContainer' id='home'>
      
      <div className='heroText'>
        <h2 className={`fade-in ${showFirst ? 'visible' : ''}`}>Consulta, Tasa, Elige.</h2>
        <h2 className={`fade-in ${showSecond ? 'visible' : ''}`}>Sin complicaciones.</h2>
      </div>

      {/* falta decir coches de 2da mano, en toda españa.. */}
      {/* <h2>Coches a la carta y financiación a tu medida, sin complicaciones.</h2> */}
      <Link to='/cars' className={`fade-in button ${showButtons ? 'visible' : ''}`}>Encuentra tu auto</Link>
      <p onClick={scrollToContactSection} className={`fade-in button learnMore ${showButtons ? 'visible' : ''}`}>Tasa tu auto</p>
      <div  className={`fade-in ${showButtons ? 'visible' : ''}`}>
      </div>
        
    </div>
  )
}

export default Hero