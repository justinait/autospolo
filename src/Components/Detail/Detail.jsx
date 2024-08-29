import React, { useEffect, useState } from 'react'
import './Detail.css'
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Link, useParams } from 'react-router-dom';
import { Carousel, Spinner } from 'react-bootstrap';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EvStationIcon from '@mui/icons-material/EvStation';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';

function Detail() {

  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const refCollection = collection(db, 'products');
        const refDoc = doc(refCollection, id);
        const docSnap = await getDoc(refDoc);
        if (docSnap.exists()) {
          setProduct({ ...docSnap.data(), id: docSnap.id });
        } else {
          console.log('No such document!');
        }
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    setTimeout(() => {
      fetchProduct();
    }, 100);
  }, [id]);

  return (
    <div>
      {loading ? 
        <div className='spinner'>
            <Spinner animation="border" role="status" >
            <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
        : (
          <div className='detailContainer'>
            <div className='nameDetail'>
              <h5 className="cardModel">{product.model}</h5>
              <h5 className="cardBrand">{product.brand}</h5>
            </div>

            <Carousel>
              <Carousel.Item>
                <img src={product.image} alt={product.title} className='imageDetail'/>
              </Carousel.Item>
              {product.imageTwo &&
                <Carousel.Item>
                  <img src={product.imageTwo} alt={product.title} className='imageDetail'/>
                </Carousel.Item>
              }
              {product.image3 &&
                <Carousel.Item>
                  <img src={product.image3} alt={product.title} className='imageDetail'/>
                </Carousel.Item>
              }
              {product.image4 &&
                <Carousel.Item>
                  <img src={product.image4} alt={product.title} className='imageDetail'/>
                </Carousel.Item>
              }
              {product.image5 &&
                <Carousel.Item>
                  <img src={product.image5} alt={product.title} className='imageDetail'/>
                </Carousel.Item>
              }
              {product.image6 &&
                <Carousel.Item>
                  <img src={product.image6} alt={product.title} className='imageDetail'/>
                </Carousel.Item>
              }
            </Carousel>
            <div className="detailInfoBox">
                
              <div className='priceBoxCars'>
                <h4 className="cardPrice">{product.unit_price} €</h4>
                <p className="alContado">Al Contado</p>
              </div>
              <div className='garantiaContainer'>
                <GppGoodOutlinedIcon/><p className='garantia'> 12 meses de garantía.</p>
              </div>
              
            </div>
                <div className="characteristicsDiv">
                  <div className="caracItem">
                    <AddRoadIcon />
                    <p>{product.km} km</p>
                  </div>
                  <div className="caracItem">
                    <CalendarMonthIcon />
                    <p>{product.year}</p>
                  </div>
                  <div className="caracItem">
                    <EvStationIcon />
                    <p>{product.fuel}</p>
                  </div>
                </div>
          </div>
        )
      }
    </div>
  )
}

export default Detail