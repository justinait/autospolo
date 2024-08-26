import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"
import Alert from 'react-bootstrap/Alert';

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {
  const [isLoading, setIsLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState([])
  const [errorsArray, setErrorsArray] = useState([])
  const [details, setDetails] = useState([''])
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title:"",
    unit_price:0,
    image:"",
    description:"",
    category: []
  })

  const [imageValidation, setImageValidation] = useState(false);
  const [file, setFile] = useState(null);
  const categories = [  'Borlas y Sujetadores','Borlas', 'Sujetadores', 'Cortinas de baño', 'Rieles y Barrales', 'Rieles', 'Barrales', 'Cortinas estándar', 'Accesorios', 'SALE'    ]
  
  const handleAdditionalImage = async () => {
    setIsLoading(true);
    additionalFiles.map((e, i)=>{
      let imageNumber = 'image'+(2+i);
      if(e != (i+1)){
        uploadFile(e)
        .then(url => {
          if(productSelected) {
            setProductSelected(prevState => ({
              ...prevState,
              [imageNumber]: url,
            })); 
            productSelected.image2 &&
            setAdditionalFiles([1])
            productSelected.image3 &&
            setAdditionalFiles([1, 2])
            productSelected.image4 &&
            setAdditionalFiles([1, 2, 3])
            productSelected.image5 &&
            setAdditionalFiles([1, 2, 3, 4])           
          } 
        })
        .catch(error => {
          console.error("Error al cargar la imagen:", error);
        });
      }
    })
    setIsLoading(false);
  }
  const handleAdditionalImageChange = (e, index) => {
    const newFiles = [...additionalFiles];
    const selectedFile = e.target.files[0];
    const currentFile = newFiles[index];
    
    if (selectedFile !== currentFile) {
      newFiles[index] = selectedFile;
      setAdditionalFiles(newFiles);
    }
  };
  
  const handleAddImageInput = () => {
    setAdditionalFiles([...additionalFiles, null]);
  };
  const handleRemoveImageInput = (index) => {
    const newFiles = [...additionalFiles];
    newFiles.splice(index, 1);
    setAdditionalFiles(newFiles);
  };
  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file);

    if(productSelected) {
      setProductSelected({
        ...productSelected, image: url
      })
      setImageValidation(true);
    } else {
      setNewProduct({...newProduct, image: url})
      setImageValidation(true);
    }

    setIsLoading(false);
  }
   
  const handleChange = (e) => {
    if(productSelected) {
      setProductSelected({
        ...productSelected,  [e.target.name]: e.target.value
      })
    } else {
      setNewProduct({...newProduct, [e.target.name]: e.target.value})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const productsCollection = collection(db, "products")
    setErrorsArray([]);
    if(productSelected){
      let obj = {
        ...productSelected,
        unit_price: +productSelected.unit_price,
        category: newProduct.category,
        details: details
      }
      const result = validate(productSelected)
      if(!Object.keys(result).length){
        updateDoc(doc(productsCollection, productSelected.id), obj).then(()=>{
          setIsChange(true);
          handleCloseModal();
        })
      }
    } else{
      let obj = {
        ...newProduct,
        unit_price: +newProduct.unit_price,
        details: details
      }
      const result = validate(newProduct)
      
      if(!Object.keys(result).length){
        addDoc(productsCollection, obj).then(()=> {
          setIsChange(true);
          handleCloseModal();
        })
      }
    }
  }

  const handleCheckboxChange = (event, category) => {
    const { checked } = event.target;
    const updatedCheckboxes = { ...checkboxes, [category]: checked };
    setCheckboxes(updatedCheckboxes);
    updateCategoryArray(category, checked);
  };

  const updateCategoryArray = (category, checked) => {
    if (checked) {
      setNewProduct(prevState => ({
        ...prevState,
        category: [...prevState.category, category]
      }));
    } else {
      setNewProduct(prevState => ({
        ...prevState,
        category: prevState.category.filter(cat => cat !== category)
      }));
    }
  };
  useEffect(() => {
    if (productSelected) {
      const selectedCategories = productSelected.category;
      const updatedCheckboxes = {};
      categories.forEach(category => {
        updatedCheckboxes[category] = selectedCategories.includes(category);
      });
      setCheckboxes(updatedCheckboxes);
      setNewProduct(prevState => ({
        ...prevState,
        category: selectedCategories
      }));
      setDetails(productSelected.details)
      const existingImages = [];
      for (let i = 2; i <= 5; i++) {
        if (productSelected[`image${i}`]) {
          existingImages.push(productSelected[`image${i}`]);
        }
      }
      setAdditionalFiles(existingImages);
    }
  }, [productSelected]);

  const addColorInput = () => {
    setDetails([...details, '']);
  };

  const removeColorInput = () => {
    if(details.length > 0){
      const newDetails = [...details];
      newDetails.pop();
      setDetails(newDetails);
    }
  };

  const handleColorChange =(index, event)=> {
    const newDetails = [...details];
    newDetails[index] = {
      ...newDetails[index],
      color: event.target.value
    };

    setDetails(newDetails);
  }
  const handleStockChange = (index, event) => {
    const newDetails = [...details];
    newDetails[index] = {
      ...newDetails[index],
      stock: Number(event.target.value)
    };
    setDetails(newDetails);
  };

  const validate = (values) => {
    const errors = {}
    if(!values.title){
      errors.title = 'Este campo es obligatorio'
    }
    if(!values.unit_price || values.unit_price == 0){
      errors.unit_price = 'Este campo es obligatorio'
    }
    if(newProduct.category.length <= 0){
      errors.category = 'Este campo es obligatorio'
    }
    if(!values.description){
      errors.description = 'Este campo es obligatorio'
    } 
    
    if (details.some(detail => (detail === '') || (!detail))) {
      errors.details = 'Este campo es obligatorio';
    }
    
    if(!productSelected) {

      if(!imageValidation){
        errors.firstImage = 'Este campo es obligatorio'
      }
    }

    setErrorsArray(errors)
    
    return errors
  }
  const handleCloseModal = () => {
    setErrorsArray([]);
    handleClose();
  }

  return (
    <>
      <Modal.Header closeButton onClick={handleCloseModal}>
        <Modal.Title>{productSelected?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         
        <form className="form">

          <div className="">
            <p className='modalDescription'>Nombre</p>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.title}
            />
            {errorsArray.title && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.title}           </Alert> }
          </div>
          <div className="">
            <h6 className='modalDescription'>Precio</h6>
            <input
              type="number"
              name="unit_price"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.unit_price}
            />
            {errorsArray.unit_price && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
          </div>
          <div className="">
            <h6 className='modalDescription'>Descripción</h6>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.description}
            />
            {errorsArray.description && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.description}           </Alert> }
          </div>
          
          <h6 className='modalDescription'>Categorías</h6>
          <div className="inputModal">
            {categories.map((category, i)=>{    
              return (
                <div key={i}>
                  <input
                    type="checkbox"
                    name={category}
                    checked={checkboxes[category] || false}
                    id={`checkbox-${category}`}
                    onChange={(event)=>handleCheckboxChange(event, category)}
                  />
                  <label>{category}</label>
                </div>
              )
            })}
            {errorsArray.category && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.category}           </Alert> }
          </div>

          <div>
            <h6 className='modalDescription'>Colores y Stock</h6>
            {details?.map((e, index) => (
              <div key={index} className="inputModal inputModalColors">
                <input
                  type="text"
                  defaultValue={e.color}
                  name="color"
                  onChange={(event) => handleColorChange(index, event)}
                  placeholder="Color"
                  className="inputModal"
                />
                <input
                  type="number"
                  defaultValue={e.stock}
                  name="stock"
                  onChange={(event) => handleStockChange(index, event)}
                  placeholder="Stock"
                  className="inputModal"
                  />
              </div>
            ))}
            {errorsArray.details && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.details}           </Alert> }
            <div className='addMoreButtonContainer'>
              <p className='addMoreButton' onClick={addColorInput}>+</p>
              <p className='addMoreButton' onClick={()=> removeColorInput()}>-</p>
            </div>
          </div>


          <div className="">
          <p className='modalDescription'>Imagen Principal</p>
            <input
              type="file"
              onChange={(e)=>setFile(e.target.files[0])}
              className=""
            />
          </div>
          {
            file &&
            <button type='button' onClick={handleImage}>Confirmar imagen</button>
          }
          {errorsArray.firstImage && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.firstImage}           </Alert> }

          {additionalFiles.map((additionalFile, index) => (
            <div key={index}>
              <p>Imagen Nº {index +2}</p>
              <input
                type="file"
                onChange={(e) => handleAdditionalImageChange(e, index)}
                className="inputModal"
              />
              <p className="addMoreButton" onClick={() => handleRemoveImageInput(index)}>-</p>
            </div>
          ))}
          <p className="addMoreButton" onClick={handleAddImageInput}>+</p>
          {additionalFiles.length > 0 && (
            <>
              <button type="button" className="confirmImage" onClick={handleAdditionalImage}>Confirmar imágenes adicionales</button>
            </>
          )}
     
        </form>
         
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancelar
        </Button>
        
      {
        !isLoading &&
        <Button type='submit' onClick={handleSubmit} variant="primary">Guardar</Button>
      }
      
    </Modal.Footer>
    </>
  );
}

export default EditAddModal;