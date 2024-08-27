import React, { useEffect, useState } from 'react'
import logo from '/logo.jpeg'
import './Navbar.css'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {

  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [activeSection, setActiveSection] = useState(null);
  const [pendingScroll, setPendingScroll] = useState(null); 

  const navigate = useNavigate(); // Hook para navegación
  const location = useLocation();

  const updateWindowSize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', updateWindowSize);
      window.addEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    if (pendingScroll) {
      // Espera un momento para asegurarse de que el DOM esté actualizado
      setTimeout(() => {
        scrollToSection(pendingScroll);
        setPendingScroll(null); // Resetea el estado después de scrollear
      }, 100);
    }
  }, [location.pathname, pendingScroll]);


  const secciones = [
    { nombre: 'INICIO', id: 'home', className: '', route: '/' },
    { nombre: 'NOSOTROS', id: 'about', className: '', route: '/'},
    { nombre: 'VER COCHES', id: 'cars', className: '', route: '/cars'},
    { nombre: 'TASAR MI COCHE', id: 'contact', className: '', route: '/'}
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = section.offsetTop - 8 * window.innerHeight / 100;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };
  const handleScroll = () => {
    secciones.forEach((seccion) => {
      const section = document.getElementById(seccion.id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top - 11 * window.innerHeight / 100 <= 0 && rect.bottom >= 0) {
          setActiveSection(seccion.id);
        }
      }
    });
  };
  const handleClick =(seccion)=> {
    setShow(false);
    if (seccion.route !== location.pathname) {
      setPendingScroll(seccion.id);
      navigate(seccion.route);
    } else {
      scrollToSection(seccion.id);
    }
  }

  const navbar = (<div className='dropdownNavbar'>
    {secciones.map((seccion) => (
    <p 
      className={` ${seccion.className} ${seccion.id === activeSection ? 'active' : ''}`}
      key={seccion.id} 
      onClick={() => handleClick(seccion)}
    >
      {seccion.nombre}
    </p>
  ))}
  </div>)


  return (
    <div className='navbarContainer'>
      <a href="/">        <img src={logo} alt="AUTOS POLO" className='logoNavbar' />      </a>
      {width < 640 ? (
        <>
        <MenuRoundedIcon onClick={() => setShow(!show)}/>
          {show && navbar}
        </>
      ) : (
        <>{navbar}</>
      )}
    </div>
  )
}

export default Navbar