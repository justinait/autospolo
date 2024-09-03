import '@fontsource/poppins';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import AuthContextComponent from './context/AuthContext';
import Dashboard from './Components/Dashboard/Dashboard';
import Cars from './Components/Cars/Cars';
import Links from './Components/Links/Links';
import Detail from './Components/Detail/Detail';
import ProtectedAdmin from './ProtectedAdmin';

function App() {

  return (
    <AuthContextComponent>
      <BrowserRouter>
        {/* <CheckScroll pageNumber={activePage} /> */}
        <Navbar />
        <Routes>
          
          <Route path='/' element={< Home />} />
          <Route path='/cars' element={< Cars />} />
          <Route path='/cars/:id' element={< Detail />} />

          <Route path='/login' element={< Login />} />
          
          <Route element={<ProtectedAdmin/>} >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path='*' element={<Navigate to="/" />} />

        </Routes>
        <Links />
        <Footer />
      </BrowserRouter>
    </AuthContextComponent>
  )
}

export default App
