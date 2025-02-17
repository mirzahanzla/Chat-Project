import {  Routes,Route, useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import BrandDashBoard from './BrandDashBoard';
import ErrorPage from './DashBoard/Pages/ErrorPage/ErrorPage';
const BrandRoutes = () => {
const navigate=useNavigate()

useEffect(() => {
  navigate('/Dashboard/OverView')

  return () => {
   
  }
}, [])


  return (
    <>
    
    <Routes>

        <Route index path="/"  element={<BrandDashBoard />} />
        <Route  path="Error" element={<ErrorPage />} />
      
        
 
    </Routes>
    
    
    
    </>
  )
}

export default BrandRoutes