import React, { useState } from 'react'
import './Contact.css'
import { Button } from 'react-bootstrap';

function Contact() {

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [option, setOption] = useState('quiero comprar'); 

  const handleSubmit = (event) => {
    event.preventDefault();

    const whatsappMessage = `Hola Autos Polo, soy ${name}. ${option} mi coche. 
    Mensaje: ${message}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+34660485129&text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className='contactContainer'  id='contact'>
      <h6>¿Estás pensando en vender tu coche? <br className='onlyMobile' /> <strong>  Tasalo ya.</strong></h6>
      <h6>¿Tienes alguna consulta?  <strong>  Escribinos.</strong></h6>

      <form onSubmit={handleSubmit}>
        <div className='inputContainer'>
          <label htmlFor="name">Nombre y apellido</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            // placeholder='Name*' 
            className='inputContact'
          />
        </div>
        <div className='inputContainer'>
          <label htmlFor="message">Mensaje</label>
          <textarea 
            id="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
            // placeholder='Your message*' 
            className='inputContact inputContactMessage'
          />
        </div>
        <div className='inputContainer'>
          <label htmlFor="option">Mi consulta</label>
          <select 
            id="option" 
            value={option} 
            onChange={(e) => setOption(e.target.value)} 
            required 
            className='inputContact inputContactSelect'
          >
            <option value="quiero comprar">Quiero comprar</option>
            <option value="quiero vender">Quiero vender</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>
       <Button variant='dark' className='formButton'>Enviar</Button>
      </form>
    </div>
  )
}

export default Contact