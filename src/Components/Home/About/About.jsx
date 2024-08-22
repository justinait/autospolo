import React from 'react'
import './About.css'

function About() {
  return (
    <div className='aboutHomeContainer'>
        <h2>Sobre Nosotros</h2>
        <iframe
            className='iframeMap'
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.5155763604935!2d2.658606575969384!3d39.57052917158814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129793dead1cb5eb%3A0x1eb33984c07cf640!2sAUTOS%20POLO%20MALLORCA!5e0!3m2!1ses-419!2sar!4v1724356601480!5m2!1ses-419!2sar"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
    </div>
  )
}

export default About