import React, { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './Cars.css'
import AddRoadIcon from '@mui/icons-material/AddRoad';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

function Cars({handlePageChange, activePage}) {
  
  const [dataProducts, setDataProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [options, setOptions] = useState({ colors: {}, brands: {} });
  const currentYear = new Date().getFullYear(); // Año actual dinámico
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);
  const carroceria = ["Berlina", "Familiar","Berlina", "Coupe", "Monovolumen", "SUV", "Cabrio", "Pick Up"]
  const gear = ["Manual", "Automático"]
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    brand: '',
    price: '',
    year: '',
    typology: '',
    transmission: '',
    seats: '',
    color: '',
    fuel: '',
    condition: ''
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
    handlePageChange(1)
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
    handlePageChange(1)
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const refCollection = collection(db, 'products');
        const res = await getDocs(refCollection);
        let newArray = res.docs.map(e =>{
          return {
            ...e.data(), 
            id: e.id
          }
        })

        setDataProducts(newArray);
        setFilteredProducts(newArray);
        handlePageChange(1)
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

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts?.slice(startIndex, endIndex);

  return (
    <div className='generalCarsContainer'>
      <h2>Nuestros Coches</h2>
      <div className='filterButtons'>
        <p className='filterButton'  onClick={() => setShowFilters(true)}>FILTROS </p>
        <p className='eraseFilters' onClick={clearFilters}>Eliminar todos los filtros</p>
      </div>
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filtrar características</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
          <div className='filterInputContainer'>
            <label className='labelCarsFilter'>Marca</label>
            <select
              className='labelResponseFilter'
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">Todas las marcas</option>
              {Object.entries(options.brands).map(([key, brand]) => (
                <option key={key} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className='filterInputContainer'>
            <label className='labelCarsFilter'>Precio (hasta)</label>
            <input
              className='labelResponseFilter'
              type="number"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
            />
          </div>
          <div className='filterInputContainer'>
            <label className='labelCarsFilter'>Color</label>
            <select
              className='labelResponseFilter'
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
            >
              <option value="">Todos los colores</option>
              {Object.entries(options.colors).map(([key, color]) => (
                <option key={key} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className='filterInputContainer'>
            <label className='labelCarsFilter'>Año</label>
            <select
              className='labelResponseFilter'
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="">Todos los años</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className='filterInputContainer'>
            <label className='labelCarsFilter'>Carrocería</label>
            <select
              className='labelResponseFilter'
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Todas las Carrocerías</option>
              {carroceria.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>  
          <div className='filterInputContainer'>
            <label className='labelCarsFilter'>Transmición</label>
            <select
              className='labelResponseFilter'
              name="gear"
              value={filters.gear}
              onChange={handleFilterChange}
            >
              <option value="">Todas las Transmiciones</option>
              {gear.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" className='buttonWhiteBs' onClick={() => setShowFilters(false)}>
            Cerrar
          </Button>
          <Button variant="dark" className='buttonWhiteBs'  onClick={applyFilters}>
            Aplicar Filtros
          </Button>
        </Modal.Footer>
      </Modal>
      
      {
        filteredProducts &&
        <p className='countCars'>{filteredProducts?.length} coches encontrados.</p>
      }
      <div className='cardsContainer'>
        {filteredProducts?.length === 0 ? (
          <p>No hay coches que coincidan con esas características. <br /> Prueba utilizando menos filtros.</p>
        ) : (
          currentProducts?.map((e, i) => (
          <Link to={`/cars/${e.id}`}  key={i} className="cardCar">
            <img
              src={e.image}
              alt=""
              className="carsImageCard"
              loading="lazy"
              />
              {e.sold &&
                <p className='soldLabelCars'>Vendido</p> 
              }
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
                  <LocalGasStationIcon />
                  <p>{e.fuel}</p>
                </div>
              </div>
              <div className='priceBoxCars'>
                <h4 className="cardPrice">{e.unit_price} €</h4>
                <p className="alContado">Al Contado</p>
              </div>
            </div>
          </Link>
        )))}

      </div>

      <Pagination >
        <Pagination.Prev
          onClick={() => handlePageChange(activePage - 1)}
          disabled={activePage === 1}
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            variant="dark"
            key={index}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(activePage + 1)}
          disabled={activePage === totalPages}
        />
      </Pagination>
    </div>
  )
}

export default Cars