import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc, getDocs} from "firebase/firestore"
import Alert from 'react-bootstrap/Alert';
import './Dashboard.css'

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {
  const [isLoading, setIsLoading] = useState(false);
  const [areLoading, setAreLoading] = useState(false);
  const [errorsArray, setErrorsArray] = useState([])
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [options, setOptions] = useState({ colors: {}, brands: {}, fuel: {} });
  const carroceria = ["Berlina", "Familiar", "Coupe", "Monovolumen", "SUV", "Cabrio", "Pick Up"]
  const [newProduct, setNewProduct] = useState({
    brand:"",
    unit_price:"",
    color:"",
    description:"",
    capacity:"",
    doors:0,
    fuel:"",
    gear:"",
    image: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    km:"",
    model:"",
    type:"",
    sits:0,
    year:0,
    new: false,
    sold: false
  })

  const [imageValidation, setImageValidation] = useState(false);
  const [file, setFile] = useState(null);

  const modalRef = useRef(null); 
  
  const handleAdditionalImage = async () => {
    setAreLoading(true);
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
            console.log('old');
            
          } else {
            console.log('new');
            
            setNewProduct(prevState => ({
              ...prevState,
              [imageNumber]: url,
            })); 
            newProduct.image2 &&
            setAdditionalFiles([1])
            newProduct.image3 &&
            setAdditionalFiles([1, 2])
            newProduct.image4 &&
            setAdditionalFiles([1, 2, 3])
            newProduct.image5 &&
            setAdditionalFiles([1, 2, 3, 4])           
          }
        })
        .catch(error => {
          console.error("Error al cargar la imagen:", error);
        });
      }
    })
    setAreLoading(false);
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
        unit_price: productSelected.unit_price
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
        unit_price: newProduct.unit_price
      }
      console.log(newProduct);
      const result = validate(newProduct)
      
      if(!Object.keys(result).length){
        
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

  useEffect(() => {
    if (Object.keys(errorsArray).length > 0) {
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [errorsArray]);
  const validate = (values) => {
    const errors = {}
    
    if(!values.brand){
      errors.brand = 'Este campo es obligatorio'
    }

    if(!values.unit_price){
      errors.unit_price = 'Este campo es obligatorio'
    }

    if(!values.description){
      errors.description = 'Este campo es obligatorio'
    }

    if(!values.model){
      errors.model = 'Este campo es obligatorio'
    }

    if(!values.year || values.year == 0){
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

    if(!values.doors || values.doors == 0){
      errors.doors = 'Este campo es obligatorio'
    }

    if(!values.sits || values.sits == 0){
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
  const handleRadioChangeBooleanos = (e) => {
    const booleanValue = e.target.value === 'yes';  // 'yes' se convierte en true, 'no' en false
  
    if (productSelected) {
      setProductSelected({
        ...productSelected,
        [e.target.name]: booleanValue,  // Almacenar como booleano
      });
    } else {
      setNewProduct({
        ...newProduct,
        [e.target.name]: booleanValue,  // Almacenar como booleano
      });
    }
  };
  const handleCheckbox = (event) => {
    const { name, checked } = event.target;
  
    if (productSelected) {
      setProductSelected(prevState => ({
        ...prevState,
        [name]: checked // 'starred': true o 'starred': false
      }));
    } else {
      // Si estamos creando un producto nuevo
      setNewProduct(prevState => ({
        ...prevState,
        [name]: checked // 'starred': true o 'starred': false
      }));
    }
  
    saveStarredStatusToDatabase(checked);
  };
  
  const saveStarredStatusToDatabase = (isStarred) => {
  
    const productsCollection = collection(db, "products")
    const productId = productSelected?.id || newProduct?.id; // ID del producto, depende de si es nuevo o existente
    if (productId) {
      const productDoc = doc(productsCollection, productId);
      const obj = { starred: isStarred }; // Aquí se agrega la propiedad starred al objeto
  
      updateDoc(productDoc, obj)
        .then(() => {
          console.log("Producto actualizado correctamente");
        })
        .catch(error => {
          console.error("Error al actualizar el producto:", error);
        });
    }
  };
  
  return (
    <>
      <Modal.Header closeButton onClick={handleCloseModal}>
        <Modal.Title>{productSelected?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={modalRef}>
              
        <form className="formDashboard">

          <div className="">
            <h6 className='modalDescription'>Marca</h6>
            <select
              name="brand"
              onChange={handleChange}
              className="input"
              value={productSelected?.brand || newProduct.brand}
            >
              <option value="">Seleccione una Marca</option>
              {Object.entries(options.brands).map(([key, brand]) => (
                <option key={key} value={brand}>{brand}</option>
              ))}
            </select>
            {errorsArray.brand && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.brand}           </Alert> }
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
            {errorsArray.model && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.model}           </Alert> }
          </div>

          <div className="">
            <h6 className='modalDescription'>Precio</h6>
            <input
            type="text"
            name="unit_price"
            onChange={handleChange}
            className="input"
            defaultValue={productSelected?.unit_price}
            />
            €
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
            {errorsArray.year && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.year}           </Alert> }
          </div>

          <div className="">
            <h6 className='modalDescription'>Descripción</h6>
            <textarea
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
            type="text"
            name="km"
            onChange={handleChange}
            className="input"
            defaultValue={productSelected?.km}
            />
            km
            {errorsArray.km && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.km}           </Alert> }
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
            {errorsArray.type && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.type}           </Alert> }
          </div>

          <div>
          <h6 className="modalDescription">Caja de cambio</h6>
            <input
            type="radio"
            name="gear"
            value="manual"
            checked={productSelected?.gear === "manual" || newProduct.gear === "manual"}
            onChange={handleRadioChange}
            />
            <label className='radioLabelMargin'>Manual</label>
            
            <input
            type="radio"
            name="gear"
            value="automatico"
            checked={productSelected?.gear === "automatico" || newProduct.gear === "automatico"}
            onChange={handleRadioChange}
            />
            <label className='radioLabelMargin'>Automático</label>
          </div>
          {errorsArray.gear && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.gear}           </Alert> }
          
          <div className="">
            <h6 className='modalDescription'>Cantidad de puertas</h6>
            <input
            type="number"
            name="doors"
            onChange={handleChange}
            className="input"
            defaultValue={productSelected?.doors}
            />
            {errorsArray.doors && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.doors}           </Alert> }
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
            {errorsArray.sits && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.sits}           </Alert> }
          </div>

          <div className="">
            <h6 className='modalDescription'>Cubicaje (cc)</h6>
            <input
            type="string"
            name="capacity"
            onChange={handleChange}
            className="input"
            defaultValue={productSelected?.capacity}
            />
            cc
            {errorsArray.capacity && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.capacity}           </Alert> }
          </div>

          <div>
            <h6 className='modalDescription'>Color</h6>
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
            {errorsArray.color && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.color}           </Alert> }
          </div>

          <div>
            <h6 className="modalDescription">Combustible</h6>
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
            {errorsArray.fuel && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.fuel}           </Alert> }
            </div>

          <div>
            <h6 className="modalDescription">¿Coche nuevo?</h6>
            <input
            type="radio"
            name="new"
            value="yes"
            checked={productSelected?.new === true || newProduct.new === true}
            onChange={handleRadioChangeBooleanos}
            />
            <label className='radioLabelMargin'>Nuevo</label>
            
            <input
            type="radio"
            name="new"
            value="no"
            checked={productSelected?.new === false || newProduct.new === false}
            onChange={handleRadioChangeBooleanos}
            />
            <label className='radioLabelMargin'>Usado</label>
          </div>
            
          <div>
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
              <p className="addMoreButton" onClick={() => handleRemoveImageInput(index)}>- Eliminar imagen</p>
              </div>
            ))}
            <p className="addMoreButton" onClick={handleAddImageInput}>+ Agregar imagen</p>
            {additionalFiles.length > 0 && (
              <>
                {additionalFiles &&
                <button type="button" className="confirmImage" onClick={handleAdditionalImage}>Confirmar imágenes adicionales</button>}
              </>
            )}
          </div>
        
          <div>
            
            <h6 className="modalDescription">¿COCHE VENDIDO?</h6>
            <div>
              <input
              type="radio"
              name="sold"
              value="yes"
              checked={productSelected?.sold === true || newProduct.sold === true}
              onChange={handleRadioChangeBooleanos}
              />
              <label className='radioLabelMargin'>SI</label>
              
              <input
              type="radio"
              name="sold"
              value="no"
              checked={productSelected?.sold === false  || newProduct.sold === false }
              onChange={handleRadioChangeBooleanos}
              />
              <label>NO</label>
            </div>

          </div>

          <div>
            <h6 className="modalDescription">¿Quieres destacar este producto en el incio?</h6>
            <p>Cuando quieras quitarlo de destacados, lo único que debes hacer es volver aquí y desmarcar la casilla.</p>
            <input
            type="checkbox"
            name="starred"
            value="starred"
            checked={productSelected?.starred === true || newProduct.starred === true}
            onChange={handleCheckbox}
            />
            <label className='radioLabelMargin'>SI</label>
            
          </div>
          
        </form>
              
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
        Cancelar
        </Button>
        {
          (!isLoading && !areLoading) &&
          <Button type='submit' onClick={handleSubmit} variant="primary">Guardar</Button>
        }
      </Modal.Footer>
    </>
  );
}

export default EditAddModal;