import { Routes, Route } from 'react-router-dom';

import Home from './Dashboard/Pages/Home/Home';
import OverView from './Dashboard/Pages/Home/OverView';
import Engagement from './Dashboard/Pages/Home/Engagement';
import EngagementGrowth from './Dashboard/Pages/Home/EngagementGrowth';
import Influencers from './Dashboard/Pages/Home/Brands';
import Media from './Dashboard/Pages/Home/Media';
import Search from './Dashboard/Pages/Search/Search';
import BrandDeals from './Dashboard/Pages/BrandDeals/BrandDeals';
import Deals from './Dashboard/Pages/BrandDeals/Deals';
import Response from './Dashboard/Pages/BrandDeals/Response';
import BrandWork from './Dashboard/Pages/BrandWork/BrandWork';
import WD from './Dashboard/Pages/BrandWork/WD';
import WorkOverView from './Dashboard/Pages/BrandWork/WorkOverView';
import WorkDetails from './Dashboard/Pages/BrandWork/WorkDetails';
import WorkContent from './Dashboard/Pages/BrandWork/WorkContent';
import Main from './Dashboard/Pages/Blog/Main';
import Blog from './Dashboard/Pages/Blog/Blog';
import CreateBlog from './Dashboard/Pages/Blog/CreateBlog';
import Message from './Dashboard/Pages/Message/Message';
import Info from './Dashboard/Pages/Info/Info';
import ErrorPage from './Dashboard/Pages/ErrorPage/ErrorPage';
import UserProfile from '../../Components/DashBoardTemplate/userProfile';
import EditBlog from './Dashboard/Pages/Blog/EditBlog';
import CreateGroupPage from './DashBoard/Pages/Message/CreateGroupPage';
import EditGroupPage from './DashBoard/Pages/Message/EditGroupPages';
import AddMembers from './DashBoard/Pages/Message/AddMembers';
import Settings from '../../Components/DashBoardTemplate/DashBoard/Settings';

const MainBar = () => {
  return (
    <div className='w-full bg-gray-200/90 min-h-screen z-1'>
      <Routes>
        <Route index element={<Home />} />
        
        <Route path="Dashboard/*" element={<Home />}>
          <Route index element={<OverView />} />
          <Route path="OverView" element={<OverView />} />
          <Route path="Engagement" element={<Engagement />} />
          <Route path="Audience" element={<EngagementGrowth />} />
          <Route path="Influencers" element={<Influencers />} />
          <Route path="Media" element={<Media />} />
        </Route>

        <Route path='profile' element={<UserProfile/>}/>

        <Route path="Search" element={<Search />} />
        <Route path='Settings' element={<Settings/>}/>

        <Route path="BrandDeals/*" element={<BrandDeals />}>
          <Route index element={<Deals />} />
          <Route path="Deals" element={<Deals />} />
          <Route path="Response" element={<Response />} />
        </Route>

        <Route path="BrandWork" element={<BrandWork />}>
          <Route index element={<WD />} />
          <Route path="WD" element={<WD />}>
            <Route index element={<WorkOverView />} />
            <Route path="WorkOverView" element={<WorkOverView />} />
            <Route path="WorkDetails" element={<WorkDetails />} />
          </Route>
          <Route path="Content" element={<WorkContent />} />
        </Route>

        <Route path="Blog" element={<Main />}>
        <Route index element={<Blog />} />
          <Route path="CreateBlog" element={<CreateBlog />} />
          <Route path="EditBlog/:blogId" element={<EditBlog />} /> {/* Add this route */}
        </Route>

        <Route path="Message" element={<Message />} />
          <Route path="create-group" element={<CreateGroupPage />} /> {/* Add this route */}
          <Route path="edit-group/:groupId" element={<EditGroupPage />} />
          <Route path="/groups/:groupId/add-members" element={<AddMembers />} />
          <Route path="Info" element={<Info />} />
          <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default MainBar;