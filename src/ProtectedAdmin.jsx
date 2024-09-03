import React, { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedAdmin() {
  const [handleLogOut, handleLogin, user, isLogged] = useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ROLADMIN
  
  console.log("User:", user);
  console.log("Is Logged:", isLogged);
  console.log("User (stringified):", JSON.stringify(user));

  if (isLogged && user?.rol === rolAdmin) {
    return <Outlet />
  } else {
    return <Navigate to="/" /> // Asegúrate de retornar el componente Navigate
  }

}

export default ProtectedAdmin