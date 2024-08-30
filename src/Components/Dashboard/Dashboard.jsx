import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import {collection, getDocs, doc, updateDoc, getDoc} from "firebase/firestore"
import './Dashboard.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductsList from './ProductList';

function Dashboard() {

  const [isChange, setIsChange] = useState(false)
  const [products, setProducts] = useState([]);

    useEffect(()=> {
      setIsChange(false)

      const productsCollection = collection(db, "products");
      getDocs(productsCollection).then(res =>{
      const newArr = res.docs.map(product=>{
        return {
        ...product.data(),
        id: product.id
        }
      })
      const productsWithNames = newArr.filter(product => product.name);
      productsWithNames.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(newArr)
      })
    }, [isChange])


    useEffect(()=> {
      setIsChange(false)

      let productsCollection = collection(db, "products");
      getDocs(productsCollection).then(res =>{
      let newArr = res.docs.map(product=>{
        return {
        ...product.data(),
        id: product.id
        }
      })
      setProducts(newArr)
      })
      console.log(products);
        
    }, [isChange])
  
  return (
    <div className='dashboardContainer' style={{minHeight:'90vh'}}>
      
      <h2>Administrador</h2>
      <ProductsList products={products} setIsChange={setIsChange} /> 
      
    </div>
  )
}

export default Dashboard