import { Routes, Route,} from 'react-router-dom';
import ErrorPage from './DashBoard/Pages/ErrorPage/ErrorPage';
import UserDashBoard from './UserDashBoard';


const UserRoutes = () => {

  return (
    <>
      <Routes>
        <Route path="/*" element={<UserDashBoard />} />
        <Route path="/Error" element={<ErrorPage />} />
      </Routes>
    </>
  )
}

export default UserRoutes;