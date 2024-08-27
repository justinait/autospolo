import React, { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './Cars.css'
import AddRoadIcon from '@mui/icons-material/AddRoad';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

function Cars() {
  
  const [dataProducts, setDataProducts] = useState(null);

  useEffect(()=>{
    let refCollection = collection(db, 'products')
    getDocs(refCollection)
    .then((res)=>{
      let newArray = res.docs.map(e =>{
        return {
          ...e.data(), 
          id: e.id
        }
      })
      setDataProducts(newArray);
    })
    .catch((err)=>console.log(err))
  }, [])

  return (
    <div>
      <h2>Coches</h2>
      <div className='cardsContainer'>
        {
          dataProducts?.map((e, i)=> {
            return(
              <div key={i} className='cardCar'>
                <img src={e.image} alt="" className='carsImageCard' />
                <div className='cardInfoBox'>
                  <h5 className='cardModel'>{e.model}</h5>
                  <h5 className='cardBrand'>{e.brand}</h5>

                  <h4 className='cardPrice'>{e.unit_price} €</h4>

                  <div className='characteristicsDiv'>
                    <div className='caracItem' >
                      <AddRoadIcon />
                      <p>{e.km} km </p>
                    </div>
                    <div className='caracItem'>
                      <CalendarMonthIcon />
                      <p>{e.year}</p>
                    </div>
                    <div className='caracItem'>
                      <EvStationIcon />
                      <p>{e.fuel}</p>
                    </div>
                  </div>
                </div>

              </div>
            )

          })
        }


      </div>
    </div>
  )
}

export default Cars