import { Routes, Route, } from 'react-router-dom';
import MainBar from './MainBar';
import ErrorPage from '../Brand/DashBoard/Pages/ErrorPage/ErrorPage';
import InfluencerDashBoard from './InfluencerDashBoard';

const InfluencerRoutes = () => {

  return (
    <>
      <Routes>
        <Route path="/*" element={<InfluencerDashBoard />} />
        <Route path="/Error" element={<ErrorPage />} />
      </Routes>
    </>
  )
}

export default InfluencerRoutes;