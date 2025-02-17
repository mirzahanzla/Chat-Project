import { Routes, Route,} from 'react-router-dom';
import BrandDashBoard from './BrandDashBoard';
import ErrorPage from './DashBoard/Pages/ErrorPage/ErrorPage';


const CustomerRoutes = () => {

  return (
    <>
      <Routes>

        <Route path="/*" element={<BrandDashBoard />} />
        <Route path="/Error" element={<ErrorPage />} />





      </Routes>



    </>
  )
}

export default CustomerRoutes