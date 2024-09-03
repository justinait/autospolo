import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc, getDocs} from "firebase/firestore"
import Alert from 'react-bootstrap/Alert';
import './Dashboard.css'

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorsArray, setErrorsArray] = useState([])
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [options, setOptions] = useState({ colors: {}, brands: {}, fuel: {} });
  const carroceria = ["Berlina", "Familiar", "Coupe", "Monovolumen", "SUV", "Cabrio", "Pick Up"]
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
      console.log('add new');
      console.log(result);
      
      if(!Object.keys(result).length){
        console.log('add sin error');
        
        addDoc(productsCollection, obj).then(()=> {
          setIsChange(true);
          handleCloseModal();
        })
      }
    }
  }
  useEffect(()=> {
    const fetchData = async () => {
      try {
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
    }
    fetchData();
  }, [])

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

  if(!values.model){
    errors.model = 'Este campo es obligatorio'
  }

  if(!values.year){
    errors.year = 'Este campo es obligatorio'
  }

  if(!values.km){
    errors.km = 'Este campo es obligatorio'
  }

  if(!values.type){
    errors.type = 'Este campo es obligatorio'
  }

  if(!values.gear){
    errors.gear = 'Este campo es obligatorio'
  }

  if(!values.doors){
    errors.doors = 'Este campo es obligatorio'
  }

  if(!values.sits){
    errors.sits = 'Este campo es obligatorio'
  }

  if(!values.capacity){
    errors.capacity = 'Este campo es obligatorio'
  }

  if(!values.color){
    errors.color = 'Este campo es obligatorio'
  }

  if(!values.fuel){
    errors.fuel = 'Este campo es obligatorio'
  }

  if(values.new === undefined){
    errors.new = 'Este campo es obligatorio'
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
            <select
              name="brand"
              onChange={handleChange}
              className="input"
              value={productSelected?.brand || newProduct.brand}
            >
              {Object.entries(options.brands).map(([key, brand]) => (
                <option key={key} value={brand}>{brand}</option>
              ))}
            </select>
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
            <h6 className='modalDescription'>Carrocería</h6>
            <select
              name="type"
              onChange={handleChange}
              className="input"
              value={productSelected?.type || newProduct.type}
            >
              <option value="">Seleccione una carrocería</option>
              {carroceria.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
            <select
              name="color"
              onChange={handleChange}
              className="input"
              value={productSelected?.color || newProduct.color}
            >
              <option value="">Seleccione un color</option>
              {Object.entries(options.colors).map(([key, color]) => (
                <option key={key} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <h6 className="modalDescription">Combustible</h6>
          <div>
            <select
              name="fuel"
              onChange={handleChange}
              className="input"
              value={productSelected?.fuel || newProduct.fuel}
            >
              <option value="">Seleccionar combustible</option>
              
              {Object.entries(options.fuel).map(([key, fuel]) => (
                <option key={key} value={fuel}>{fuel}</option>
              ))}
            </select>
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