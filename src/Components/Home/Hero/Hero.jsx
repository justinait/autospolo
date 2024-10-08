import React, { useEffect, useState } from 'react'
import './Hero.css'
import { Link } from 'react-router-dom';

function Hero() {

  const [showFirst, setShowFirst] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowButtons(true), 1500);
    setTimeout(() => setShowFirst(true), 500);
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
      <div className='h2Container'>
        <h2>Compra y vende <br className='onlyMobile' /> tu coche usado.</h2>
        <h2 className='onlyTablet'>Sin complicaciones</h2>
      </div>
      <Link to='/cars' className={`fade-in button ${showFirst ? 'visible' : ''}`}>Encuentra tu coche</Link>
      <p onClick={scrollToContactSection} className={`fade-in button learnMore ${showButtons ? 'visible' : ''}`}>Tasa tu coche</p>
      
      <div  className={`fade-in ${showButtons ? 'visible' : ''}`}></div>
        
    </div>
  )
}

export default Hero