import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../firebaseConfig';
import {deleteDoc, doc} from "firebase/firestore"
import EditAddModal from './EditAddModal';
import Modal from 'react-bootstrap/Modal';
import EditIcon from '@mui/icons-material/Edit';
import './Dashboard.css'

function ProductsList({products, setIsChange}) {

  const [productSelected, setProductSelected] = useState(null)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleOpen = (product) => {
    setShow(true);
    setProductSelected(product);
  }

  const deleteProduct = (id) => {
    deleteDoc(doc(db, "products", id));
    setIsChange(true);
  }

  return (
    <div>
    
      <button className='dashboardButton addButton' onClick={()=>handleOpen(null)}>Nuevo Coche +</button>
      
      <div className='cardsContainerDashboard'>
      {products?.map((e, i) => (
        <div to={`/cars/${e.id}`}  key={i} className="dashboardCard">
          
          <div className='crudButtonsDashboard'>
              <button className='dashboardButton editButton' onClick={()=> handleOpen(e) }> <EditIcon/> </button>
              <button className='dashboardButton deleteButton' onClick={()=>deleteProduct(e.id)}> <DeleteIcon/></button>
          </div>
          <img
            src={e.image}
            alt=""
            className="carsImageCard"
            loading="lazy"
          />
          <div className="cardInfoBox">
              
            <h5 className="cardModel">{e.model}</h5>
            <h5 className="cardBrand">{e.brand}</h5>
            
            <div className="dashboardMainItemsContainer">
              <p>{e.km} km</p>
              <p>{e.year}</p>
              <p>{e.fuel}</p>
            </div>

            <h4 className="cardDashboardPrice">{e.unit_price} €</h4>

          </div>
        </div>
      ))}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <EditAddModal handleClose={handleClose} setIsChange={setIsChange} productSelected={productSelected} setProductSelected={setProductSelected} />
          
      </Modal>
      </div>
  </div>
  )
}

export default ProductsList