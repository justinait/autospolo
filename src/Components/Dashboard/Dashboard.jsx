import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import {collection, getDocs, doc, updateDoc, getDoc} from "firebase/firestore"
import './Dashboard.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductsList from './ProductList';

function Dashboard() {

  const [isChange, setIsChange] = useState(false)
  const [products, setProducts] = useState([]);
  const currentYear = new Date().getFullYear(); // Año actual dinámico
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);
  const carroceria = ["Berlina", "Familiar","Berlina", "Coupe", "Monovolumen", "SUV", "Cabrio", "Pick Up"]
  const gear = ["Manual", "Automático"]

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
      const fetchData = async () => {
        try {
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
        } catch (err) {
          console.log(err);
        }
      }
        
      fetchData();
    }, [isChange])
  
  return (
    <div className='dashboardContainer' style={{minHeight:'90vh'}}>
      
      <h2>Administrador</h2>
      <ProductsList products={products} setIsChange={setIsChange} /> 
      
    </div>
  )
}

export default Dashboard