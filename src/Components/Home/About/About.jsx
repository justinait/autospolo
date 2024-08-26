import React from 'react'
import './About.css'
import local from '/images/stan.jpg'

function About() {
    const ventajas = [
        { name: 'Tasación Sin Costo', description: 'Te ofrecemos la posibilidad de tasar tu coche sin compromiso.', image: '/images/tasar.jpg', className: '' },
        { name: 'Financiación a Medida', description: 'Encontrarás planes de financiación que se ajustan a tus necesidades.', image: '/images/financia.jpg', className: ''},
        { name: '1 año de Garantía', description: 'Todos nuestros coches vienen con garantía por 12 meses.', image: '/images/garantia.jpg', className: ''},
        { name: 'Precios Justos', description: 'Ofrecemos precios competitivos para cada coche.', image: '/images/hero.jpg', className: ''}
    ]
  return (
    <div className='aboutHomeContainer'>
        <div className='aboutHomeOrange'>

            <h2>Sobre <br /> Autos Polo</h2>
            
            <p>En Autos Polo, nos dedicamos a ofrecerte la mejor experiencia en la compra de tu coche ideal. 
                Contamos con una amplia variedad de coches y una red de atención que cubre todo el territorio español, 
                desde Mallorca hasta Madrid, Valencia y más.
            </p>
        </div>
            <img className='aboutPolo' src={local} alt="" />
        <div className='aboutHomeWhy'>
            <h3>¿Por qué elegirnos?</h3>
            <div>
                {
                    ventajas.map((e, i)=> {
                        return(
                            <div key={i} className='advantagesCard'>
                                <img src={e.image} alt={e.name} />
                                <div className='advantagesAbout'>
                                    <h4>{e.name}</h4>
                                    <p>{e.description} </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>

        <div className='aboutMap'>
            <h4>Encontranos en Carrer de Joan Alcover, 13, Llevant, Palma, Illes Balears, España</h4>
            <iframe
                className='iframeMap'
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.5155763604935!2d2.658606575969384!3d39.57052917158814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129793dead1cb5eb%3A0x1eb33984c07cf640!2sAUTOS%20POLO%20MALLORCA!5e0!3m2!1ses-419!2sar!4v1724356601480!5m2!1ses-419!2sar"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    </div>
  )
}

export default About