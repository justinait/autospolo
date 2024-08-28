import '@fontsource/poppins';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/anton-sc';
import '@fontsource/kulim-park';
import '@fontsource/kulim-park/400.css';
import '@fontsource/kulim-park/700.css';
import '@fontsource-variable/raleway';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import AuthContextComponent from './context/AuthContext';
import ProtectedAdmin from './ProtectedAdmin';
import Dashboard from './Components/Dashboard/Dashboard';
import Cars from './Components/Cars/Cars';

function App() {

  return (
    <AuthContextComponent>
      <BrowserRouter>
        {/* <CheckScroll pageNumber={activePage} /> */}
        <Navbar />
        <Routes>
          
          <Route path='/' element={< Home />} />
          <Route path='/cars' element={< Cars />} />
                  


          <Route path='/login' element={< Login />} />
          <Route element={<ProtectedAdmin/>} >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path='*' element={<Navigate to="/" />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthContextComponent>
  )
}

export default App
