import React, { useEffect, useRef, useState } from 'react'
import './Starred.css'
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

function Starred() {
     
    const [starredCars, setStarredCars] = useState([])
    const containerRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;


    useEffect(() => {
        const fetchStarredCars = async () => {
            try {
                const refCollection = collection(db, 'products');
                const res = await getDocs(refCollection);
                const starredArray = res.docs
                    .map(doc => ({ ...doc.data(), id: doc.id }))
                    .filter(car => car.starred); // Filtrar solo los que tienen `starred: true`

                setStarredCars(starredArray);
            } catch (err) {
                console.log(err);
            }
        };

        fetchStarredCars();
    }, []);

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
                starredCars.map((e, i) => {
                    return(
                        <Link to={`/cars/${e.id}`} key={i} className='starredCarsCard'>
                           <img src={e.image} alt={e.model} className='starredCarsImg' />
                           <h5 className='starredTitle'>{e.model}</h5> 
                           <p className='starredPrice'>€{e.unit_price}</p>
                        </Link>
                    )
                })
                }
            </div>
            <Link to='/cars' className='seeMore'>Ver todos los coches</Link>
        </div>
    )
}

export default Starred