import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'

export const AuthContext = createContext();

function AuthContextComponent({children}) {
    
  let storedUserInfo;
  try {
    storedUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  } catch (error) {
    storedUserInfo = {};
  }
  const [user, setUser] = useState(storedUserInfo);
  const [isLogged, setIsLogged] = useState(JSON.parse(localStorage.getItem("isLogged")) || false);
  console.log(user);
  console.log(localStorage.getItem("userInfo"));

  
  const handleLogin= (finallyUser)=>{
    setUser(finallyUser);
    setIsLogged(true);
    localStorage.setItem("userInfo", JSON.stringify(finallyUser))
    localStorage.setItem("isLogged", JSON.stringify(true))
  }
  
  const handleLogOut = () =>{
    setUser({});
    setIsLogged(false);
    localStorage.removeItem("userInfo")
    localStorage.removeItem("isLogged")
  }

  let data =[
    handleLogOut,
    handleLogin,
    user,
    isLogged
  ]
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextComponent