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
import { Button, Modal } from 'react-bootstrap';

function Cars() {
  
  const [dataProducts, setDataProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [options, setOptions] = useState({ colors: {}, brands: {} });
  const currentYear = new Date().getFullYear(); // Año actual dinámico
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);
  const carroceria = ["Berlina", "Familiar","Berlina", "Coupe", "Monovolumen", "SUV", "Cabrio", "Pick Up"]
  const gear = ["Manual", "Automático"]

  const [filters, setFilters] = useState({
    brand: '',
    price: '',
    year: '',
    typology: '',
    transmission: '',
    seats: '',
    color: '',
    fuel: '',
    condition: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const applyFilters = () => {
    const filtered = dataProducts.filter((product) => {
      return (
        (!filters.brand || product.brand === filters.brand) &&
        (!filters.price || product.unit_price <= filters.price) &&
        (!filters.year || product.year === filters.year) &&
        (!filters.typology || product.typology === filters.typology) &&
        (!filters.transmission || product.transmission === filters.transmission) &&
        (!filters.seats || product.seats === filters.seats) &&
        (!filters.color || product.color === filters.color) &&
        (!filters.fuel || product.fuel === filters.fuel) &&
        (!filters.condition || product.condition === filters.condition)
      );
    });
    setFilteredProducts(filtered);
    setShowFilters(false);
  };
  const clearFilters = () => {
    setFilters({
      brand: '',
      price: '',
      year: '',
      typology: '',
      transmission: '',
      seats: '',
      color: '',
      fuel: '',
      condition: '',
    });
    setFilteredProducts(dataProducts);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const refCollection = collection(db, 'products');
        const res = await getDocs(refCollection);
        let newArray = await Promise.all(
          res.docs.map(async (e) => {
            const data = e.data();
            let compressedImage = data.image;
            
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
        setFilteredProducts(newArray);
        // Obtener opciones de colors y brands
        const refOptions = collection(db, 'options');
        const resOptions = await getDocs(refOptions);
        let optionsData = {};
        resOptions.docs.forEach((doc) => {
          optionsData[doc.id] = doc.data(); // doc.id sería 'colors' o 'brands'
        });

        setOptions(optionsData);

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
        <p className='filterButton'  onClick={() => setShowFilters(true)}>FILTROS <KeyboardArrowDownIcon/> </p>
        <button onClick={clearFilters}>Eliminar todos los filtros</button>
      </div>
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filtros</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
          <div>
            <label>Marca</label>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">Todas</option>
              {Object.entries(options.brands).map(([key, brand]) => (
                <option key={key} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Precio (hasta)</label>
            <input
              type="number"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Color</label>
            <select
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              {Object.entries(options.colors).map(([key, color]) => (
                <option key={key} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Año</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="">Seleccionar año</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Carrocería</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Seleccionar año</option>
              {carroceria.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>  
          <div>
            <label>Transmición</label>
            <select
              name="gear"
              value={filters.gear}
              onChange={handleFilterChange}
            >
              <option value="">Seleccionar año</option>
              {gear.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          {/* 
          seats: '',
          fuel: '',
          condition: '', */}
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilters(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={applyFilters}>
            Aplicar Filtros
          </Button>
        </Modal.Footer>
      </Modal>
      
      <div className='cardsContainer'>
        {filteredProducts?.map((e, i) => (
          <div key={i} className="cardCar">
            <img
              src={e.image}
              alt=""
              className="carsImageCard"
              loading="lazy"
            />
            <div className="cardInfoBox">
              <h5 className="cardModel">{e.model}</h5>
              <h5 className="cardBrand">{e.brand}</h5>

              <div className="characteristicsDiv">
                <div className="caracItem">
                  <AddRoadIcon />
                  <p>{e.km} km</p>
                </div>
                <div className="caracItem">
                  <CalendarMonthIcon />
                  <p>{e.year}</p>
                </div>
                <div className="caracItem">
                  <EvStationIcon />
                  <p>{e.fuel}</p>
                </div>
              </div>

              <p className="alContado">Al Contado</p>
              <h4 className="cardPrice">{e.unit_price} €</h4>
            </div>
          </div>
        ))}


      </div>
    </div>
  )
}

export default Cars