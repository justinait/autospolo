import React from 'react'
import './Starred.css'

function Starred() {
     
    const starred = [
        { name: 'Porsch Cayanne', price: '10.000', image: '/cars/porsch (1).jpg', className: '' },
        { name: 'Range Rover', price: '12.000', image: '/cars/rangerover (1).jpg', className: ''},
        { name: 'Mercedes Benz', price: '9.000', image: '/cars/mercedes (1).jpg', className: ''},
        { name: 'Maserati', price: '49.900', image: '/cars/maserati (2).jpg', className: ''}
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
                           <h5 className='starredTitle'>{e.name}</h5> 
                           <p className='starredPrice'>€{e.price}</p>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Starred