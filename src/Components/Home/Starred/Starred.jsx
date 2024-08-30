import React, { useEffect, useRef } from 'react'
import './Starred.css'
import { Link } from 'react-router-dom';

function Starred() {
     
    const starred = [
        { name: 'Porsch Cayanne', price: '10.000', image: '/cars/porsch (1).jpg', className: '' },
        { name: 'Range Rover', price: '12.000', image: '/cars/rangerover (1).jpg', className: ''},
        { name: 'Mercedes Benz', price: '9.000', image: '/cars/mercedes (1).jpg', className: ''},
        { name: 'Maserati', price: '49.900', image: '/cars/maserati (2).jpg', className: ''}
    ]

    const containerRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;

    useEffect(() => {
        const container = containerRef.current;

        const handleMouseDown = (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
        };

        const handleMouseUp = () => {
            isDown = false;
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 3; // Multiplica para aumentar la velocidad de desplazamiento
            container.scrollLeft = scrollLeft - walk;
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className='starredCarsContainer'>
            <h2>Coches destacados</h2>
            
            <div ref={containerRef} className='starredContainerMap'>
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
            <Link to='/cars' className='seeMore'>Ver todos los coches</Link>
        </div>
    )
}

export default Starred