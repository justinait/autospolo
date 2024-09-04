import React, { useEffect, useState } from 'react'
import './Detail.css'
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Link, useParams } from 'react-router-dom';
import { Button, Carousel, Spinner } from 'react-bootstrap';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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

  const handleBook = () => {
    let whatsappMessage = `Hola! Me gustaría saber más acerca de ${product.model}.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=+34660485129&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

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
            <Link to='/cars'> <ArrowBackIosIcon /></Link>
            <h5 className='nameDetail'> <strong>{product.model}</strong> {product.brand}</h5>

            <Carousel>
              <Carousel.Item>
                <img src={product.image} alt={product.title} className='imageDetail'/>
              </Carousel.Item>
              {product.image2 &&
                <Carousel.Item>
                  <img src={product.image2} alt={product.title} className='imageDetail'/>
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
                
              <div className='priceBoxDetail'>
                <h4 className="cardPrice">{product.unit_price} €</h4>
                <p className="alContado">Al Contado</p>
              </div>
              <div className='garantiaContainer'>
                <GppGoodOutlinedIcon/><p className='garantia'> 12 meses de garantía.</p>
              </div>
              
            </div>
            <p className='subtitlesDetail'>Características</p>
            <div className="characteristicsDetail">
              <div className="caracItemDetail">
                <h6>Kilómetros</h6>
                <p>{product.km} km</p>
              </div>
              <div className="caracItemDetail">
                <h6>Año</h6>
                <p>{product.year}</p>
              </div>
              <div className="caracItemDetail">
                <h6>Combustible</h6>
                <p>{product.fuel}</p>
              </div>
              <div className="caracItemDetail">
                <h6>Puertas</h6>
                <p>{product.doors} puertas</p>
              </div>
              <div className="caracItemDetail">
                <h6>Plazas</h6>
                <p>{product.sits} plazas</p>
              </div>
              <div className="caracItemDetail">
                <h6>Tipología</h6>
                <p>{product.type}</p>
              </div>
              <div className="caracItemDetail">
                <h6>Cambio</h6>
                <p>{product.gear}</p>
              </div>
              <div className="caracItemDetail">
                <h6>Cubicaje</h6>
                <p>{product.capacity} cc</p>
              </div>
            </div>
            <br />
            <p className='subtitlesDetail'>Descripción</p>
            <p className='detailDescriptionText'>{product.description}</p>

            <Button variant='dark' onClick={handleBook} className='bookDetail'>Consultar por este coche</Button>
          </div>
        )
      }
    </div>
  )
}

export default Detail