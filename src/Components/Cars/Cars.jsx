import React, { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './Cars.css'
import AddRoadIcon from '@mui/icons-material/AddRoad';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import imageCompression from 'browser-image-compression';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Cars() {
  
  const [dataProducts, setDataProducts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const refCollection = collection(db, 'products');
        const res = await getDocs(refCollection);
        let newArray = await Promise.all(
          res.docs.map(async (e) => {
            const data = e.data();
            let compressedImage = data.image;
            
            // Comprimir la imagen
            if (data.image) {
              try {
                const options = {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 800,
                  useWebWorker: true,
                };
                compressedImage = await imageCompression.getDataUrlFromFile(
                  await imageCompression.loadImage(data.image, options)
                );
              } catch (error) {
                console.error('Error al comprimir la imagen:', error);
              }
            }

            return {
              ...data,
              id: e.id,
              image: compressedImage, // Imagen optimizada
            };
          })
        );
        setDataProducts(newArray);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='generalCarsContainer'>
      <h2>Nuestros Coches</h2>
      <div>
        <p className='filterButton'>FILTROS <KeyboardArrowDownIcon/> </p>
      </div>
      <div className='cardsContainer'>
        {
          dataProducts?.map((e, i)=> {
            return(
              <div key={i} className='cardCar'>
                <img src={e.image} alt="" className='carsImageCard'  loading="lazy" />
                <div className='cardInfoBox'>
                  <h5 className='cardModel'>{e.model}</h5>
                  <h5 className='cardBrand'>{e.brand}</h5>

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

                  <p className='alContado'>Al Contado</p>
                  <h4 className='cardPrice'>{e.unit_price} €</h4>
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