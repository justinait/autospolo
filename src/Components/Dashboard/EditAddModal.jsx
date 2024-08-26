import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"
import Alert from 'react-bootstrap/Alert';
import './Dashboard.css'

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorsArray, setErrorsArray] = useState([])
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [newProduct, setNewProduct] = useState({
    brand:"",
    unit_price:0,
    color:"",
    description:"",
    capacity:"",
    doors:0,
    fuel:"",
    gear:"",
    image: [],
    km:"",
    model:"",
    type:"",
    sits:5,
    year:2010,
    new: false
  })

  const [imageValidation, setImageValidation] = useState(false);
  const [file, setFile] = useState(null);
  
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
        unit_price: +productSelected.unit_price
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
            unit_price: +newProduct.unit_price
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

  useEffect(() => {
    if (productSelected) {
      
      const existingImages = [];
      for (let i = 2; i <= 5; i++) {
        if (productSelected[`image${i}`]) {
          existingImages.push(productSelected[`image${i}`]);
        }
      }
      setAdditionalFiles(existingImages);
    }
  }, [productSelected]);

  const validate = (values) => {
    const errors = {}
    if(!values.brand){
      errors.brand = 'Este campo es obligatorio'
    }
    if(!values.unit_price || values.unit_price == 0){
      errors.unit_price = 'Este campo es obligatorio'
    }
    if(!values.description){
      errors.description = 'Este campo es obligatorio'
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
  const handleRadioChange = (e) => {
    if (productSelected) {
      setProductSelected({
        ...productSelected,
        [e.target.name]: e.target.value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <>
        <Modal.Header closeButton onClick={handleCloseModal}>
          <Modal.Title>{productSelected?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                
          <form className="form">

            <div className="">
              <h6 className='modalDescription'>Marca</h6>
              <input
              type="text"
              name="brand"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.brand}
              />
              {errorsArray.brand && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.title}           </Alert> }
            </div>
            <div className="">
              <h6 className='modalDescription'>Modelo</h6>
              <input
              type="text"
              name="model"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.model}
              />
              {errorsArray.model && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.title}           </Alert> }
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
              <h6 className='modalDescription'>Año</h6>
              <input
              type="number"
              name="year"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.year}
              />
              {errorsArray.year && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
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
            
            <div className="">
              <h6 className='modalDescription'>Kilometros</h6>
              <input
              type="number"
              name="km"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.km}
              />
              {errorsArray.km && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
            </div>
            
            <div className="">
              <h6 className='modalDescription'>Tipología</h6>
              <input
              type="string"
              name="type"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.type}
              />
              {errorsArray.type && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
            </div>

            <h6 className="modalDescription">Caja de cambio</h6>
            <div>
              <input
              type="radio"
              name="gear"
              value="manual"
              checked={productSelected?.gear === "manual" || newProduct.gear === "manual"}
              onChange={handleRadioChange}
              />
              <label>Manual</label>
              
              <input
              type="radio"
              name="gear"
              value="automatico"
              checked={productSelected?.gear === "automatico" || newProduct.gear === "automatico"}
              onChange={handleRadioChange}
              />
              <label>Automático</label>
            </div>
            
            <div className="">
              <h6 className='modalDescription'>Cantidad de puertas</h6>
              <input
              type="number"
              name="doors"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.doors}
              />
              {errorsArray.doors && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
            </div>
            
            <div className="">
              <h6 className='modalDescription'>Plazas</h6>
              <input
              type="number"
              name="sits"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.sits}
              />
              {errorsArray.sits && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
            </div>

            <div className="">
              <h6 className='modalDescription'>Cubicaje (cc)</h6>
              <input
              type="number"
              name="capacity"
              onChange={handleChange}
              className="input"
              defaultValue={productSelected?.capacity}
              />
              {errorsArray.capacity && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
            </div>

            <h6 className='modalDescription'>Color</h6>
            <div>
              {["rojo", "negro", "blanco", "gris oscuro", "gris claro", "amarillo", "verde", "azul"].map((color) => (
              <div key={color}>
                <input
                type="radio"
                name="color"
                value={color}
                checked={productSelected?.color === color || newProduct.color === color}
                onChange={handleRadioChange}
                />
                <label>{color.charAt(0).toUpperCase() + color.slice(1)}</label>
              </div>
              ))}
            </div>
            <h6 className="modalDescription">Combustible</h6>
            <div>
              {["hibrido", "gas", "diesel", "electrico"].map((fuel) => (
              <div key={fuel}>
                <input
                type="radio"
                name="fuel"
                value={fuel}
                checked={productSelected?.fuel === fuel || newProduct.fuel === fuel}
                onChange={handleRadioChange}
                />
                <label>{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</label>
              </div>
              ))}
            </div>
            <h6 className="modalDescription">¿Coche nuevo?</h6>
            <div>
              <input
              type="radio"
              name="new"
              value="true"
              checked={productSelected?.new === true || newProduct.new === true}
              onChange={handleRadioChange}
              />
              <label>Nuevo</label>
              
              <input
              type="radio"
              name="new"
              value="false"
              checked={productSelected?.new === false || newProduct.new === false}
              onChange={handleRadioChange}
              />
              <label>Usado</label>
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