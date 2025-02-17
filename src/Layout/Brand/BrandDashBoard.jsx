import { useMemo } from 'react'
// import MainBar from './DashBoard/MainBar.jsx/MainBar'
// import LeftSideBar from '../../Components/DashBoardTemplate/DashBoard/LeftSideBar.jsx/LeftSideBar';
// import RightSideBar from '../../Components/DashBoardTemplate/DashBoard/RightSideBar/RightSideBar';
// import TopHeader from '../../Components/DashBoardTemplate/DashBoard/TopHeader';



import BrandDashBoardTemplate from '../../Components/DashBoardTemplate/DashBoardBoardTemplate';
import HomeIcon from '../../Components/Svg/HomeIcon';
import CompaignIcon from '../../Components/Svg/CompaignIcon';
import SavedIcon from '../../Components/Svg/SavedIcon';
import GroupIcon from '../../Components/Svg/Group';
import Message from '../../Components/Svg/Messages';
import HelpIcon from '../../Components/Svg/Help';
import SearchIcon from '../../Components/Svg/SearchIcon';
import MainBar from './MainBar';


const BrandDashBoard = () => {

  // const navigate=useNavigate()
  //   useEffect(() => {
  //     navigate('/DashBoard')


  //   }, [])



  // We used the Usememo Hook  to store these objects as they are being passed to Component and i donot
  // want to render the component because the  object reference changes on each render
  let DashBoardData = useMemo(() => {

    // If You donot pass the Custom Buttons You have to do the {CustomButtons &&} to not add thoes buttons 
    let CustomButtons = [{ "name": "Search", "link": "/Search", "ImageSrc": "/Svg/SearchIcon.svg" },
   ]

    // Used to display the Icon and Its name on Hover and when Click address
    //image ,name hover,link 
    let IconNames = [['HomeIcon', 'Dashboard', '/Dashboard'], ['Compaign', 'Compaign', 'Compaign'], ['Saved', 'Your Network', 'Saved'], ['Blog', 'Blog Posts', 'Blog'], ['message', 'Message', 'Message']]

    // It will navigate the page upon the user itself add URL orr by navigate funtion when user Click 
    // It will the Active Button according to 0,1,2,3,4,5,6
    let Pages = ['/Dashboard', '/Compaign', '/Saved', '/Blog', '/Message', '/Search']


    let menuItems = [
      { icon: <SearchIcon color="white" />, label: 'Search', navigate: "/Search" },
      { icon: <HomeIcon color="white" />, label: 'Dashboard', navigate: "/Dashboard" },
      { icon: <CompaignIcon color="white" />, label: 'Compaign', navigate: "/Compaign" },
      { icon: <SavedIcon color="white" />, label: 'Saved Network', navigate: "/Saved" },
      { icon: <GroupIcon color="white" />, label: 'Blog Posts', navigate: "/Blog" },
      { icon: <Message color="white" />, label: 'Message', navigate: "/Message" },
      // { icon: <HelpIcon color="white" />, label: 'Help', navigate: "/Info" },
    ];

    return { CustomButtons, IconNames, Pages, menuItems }
  }, [])



  return (
    <>
      <BrandDashBoardTemplate CustomButtons={DashBoardData.CustomButtons} IconNames={DashBoardData.IconNames} Pages={DashBoardData.Pages} menuItems={DashBoardData.menuItems} >
        {/* // we pass the main bar as the children that contains the /Home /Search Routes and pages  */}
        <MainBar />

      </BrandDashBoardTemplate>

    </>
  )
}

export default BrandDashBoard