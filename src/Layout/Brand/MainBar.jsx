import { Routes, Route } from 'react-router-dom';
import Home from './DashBoard/Pages/Home/Home';
import Search from './DashBoard/Pages/Search/Search';
import Predict from './DashBoard/Pages/Search/predict';
import Compaign from './DashBoard/Pages/Compaign/Compaign';

import Saved from './DashBoard/Pages/Saved/Saved';
import Message from './DashBoard/Pages/Message/Message';
import Info from './DashBoard/Pages/Info/Info';
import ErrorPage from './DashBoard/Pages/ErrorPage/ErrorPage';
import Spendings from './DashBoard/Pages/Home/Spendings';
import Influencers from './DashBoard/Pages/Home/Influencers';
import OverView from './DashBoard/Pages/Home/OverView';
import Engagement from './DashBoard/Pages/Home/Engagement';
import EngagementGrowth from './DashBoard/Pages/Home/EngagementGrowth';
import Media from './DashBoard/Pages/Home/Media';
import CurrentCompaign from './DashBoard/Pages/Compaign/CurrentCompaign';
import Workflow from './DashBoard/Pages/Compaign/Workflow';
import Payment from './DashBoard/Pages/Compaign/Payment';
import Content from './DashBoard/Pages/Compaign/Content';
import Dashbaord from './DashBoard/Pages/Compaign/Dashbaord';
import Report from './DashBoard/Pages/Compaign/Report';
import Blog from './DashBoard/Pages/Blog/Blog';
import Main from './DashBoard/Pages/Blog/Main';
import CreateBlog from './DashBoard/Pages/Blog/CreateBlog';
import EditBlog from './DashBoard/Pages/Blog/EditBlog';
import CreateCampaign from './DashBoard/Pages/Compaign/CreateCampaign';
import BrandProfile from '../../Components/DashBoardTemplate/BrandProfile';
import CreateGroupPage from './DashBoard/Pages/Message/CreateGroupPage';
import EditGroupPage from './DashBoard/Pages/Message/EditGroupPage';
import AddMember from './DashBoard/Pages/Message/AddMember';

const MainBar = () => {

  return (
    <div className='w-full bg-gray-200/90  min-h-screen'>
  {/* Your content */}


      <Routes>
        <Route index element={<Home />} />
        <Route path="Dashboard/*" element={<Home />}>
          <Route index element={< OverView />} />
          <Route path="OverView" element={< OverView />} />
          <Route path="Engagement" element={<Engagement />} />
          <Route path="Spendings" element={<Spendings />} />
          <Route path="Audience" element={<EngagementGrowth />} />
          <Route path="Influencers" element={<Influencers />} />
          <Route path="Media" element={<Media />} />
        </Route>

        <Route path="Search" element={<Search />} />
        <Route path='/Predict/' element={<Predict />} />
        <Route path='profile' element={<BrandProfile/>}/>
        
        <Route path="Compaign" element={< Compaign />} />
        <Route path="Compaign/CreateCampaign" element={<CreateCampaign />} /> 
        <Route path="Compaign/CurrentCompaign" element={< CurrentCompaign />} >
          <Route index element={< Dashbaord />} />
          <Route path="Workflow" element={< Workflow />} />
          <Route path="Payment" element={<Payment />} />
          <Route path="Content" element={<Content />} />
          <Route path="Report" element={<Report />} />
        </Route>

        <Route path="Saved" element={<Saved />} />

        <Route path="Blog" element={<Main />} >
          <Route index element={<Blog />} />
          <Route path="CreateBlog" element={<CreateBlog />} />
          <Route path="EditBlog/:blogId" element={<EditBlog />} /> {/* Add this route */}
        </Route>


       <Route path="Message" element={<Message />} />
        <Route path="create-group" element={<CreateGroupPage />} /> {/* Add this route */}
        <Route path="edit-group/:groupId" element={<EditGroupPage />} />
        <Route path="/groups/:groupId/add-members" element={<AddMember />} />
        <Route path="Info" element={<Info />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default MainBar;