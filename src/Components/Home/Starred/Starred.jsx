import React from 'react'
import './Starred.css'

function Starred() {
     
    const starred = [
        { name: 'Peugeot', price: '10000', image: '/cars/peugeot.png', className: '' },
        { name: 'Smart', price: '10000', image: '/cars/smart.png', className: ''},
        { name: 'Mercedes Benz', price: '10000', image: '/cars/mercedes.png', className: ''},
        { name: 'Camioneta', price: '10000', image: '/cars/camioneta.png', className: ''}
    ]
    return (
        <div>
            <h2>Coches destacados</h2>
            <div className='starredContainerMap'>
            {
                starred.map((e, i) => {
                    return(
                        <div key={i} className='starredCarsCard'>
                           <img src={e.image} alt={e.name} className='starredCarsImg' />
                           <h5>{e.name}</h5> 
                           <p>€{e.price}</p>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Starred