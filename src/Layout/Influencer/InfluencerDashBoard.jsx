import { useMemo } from 'react';
import BrandDashBoardTemplate from '../../Components/DashBoardTemplate/DashBoardBoardTemplate';
import HomeIcon from '../../Components/Svg/HomeIcon';
import CompaignIcon from '../../Components/Svg/CompaignIcon';
import SavedIcon from '../../Components/Svg/SavedIcon';
import GroupIcon from '../../Components/Svg/Group';
import Message from '../../Components/Svg/Messages';
import HelpIcon from '../../Components/Svg/Help';
import SearchIcon from '../../Components/Svg/SearchIcon';
import MainBar from './MainBar';

const InfluencerDashBoard = () => {

  // Use useMemo to memoize dashboard data to avoid unnecessary re-renders
  const DashBoardData = useMemo(() => {
    // Custom buttons for the dashboard
    const CustomButtons = [
      // { name: "Search", link: "/Search", ImageSrc: "/Svg/SearchIcon.svg" },
      { name: "Info", link: "/Info", ImageSrc: "/Svg/Help.svg" }
    ];

    // Icons with names and links
    const IconNames = [
      ['HomeIcon', 'Dashboard', '/Dashboard'],
      ['Dollar', 'Brand Deals', '/BrandDeals'],
      ['Work', 'Brand Work', '/BrandWork/WD'],
      ['Blog', 'Blog Posts', 'Blog'],
      ['message', 'Message', 'Message']
    ];

    // Page URLs
    const Pages = [
      '/Dashboard',
      '/BrandDeals',
      '/BrandWork',
      '/Blog',
      '/Message',
      // '/Search',
      // '/Info'
    ];

    // Menu items with icons and navigation links
    const menuItems = [
      // { icon: <SearchIcon color="white" />, label: 'Search', navigate: "/Search" },
      { icon: <HomeIcon color="white" />, label: 'Dashboard', navigate: "/Dashboard" },
      { icon: <CompaignIcon color="white" />, label: 'Brand Deals', navigate: "/BrandDeals" },
      { icon: <SavedIcon color="white" />, label: 'Brand Work', navigate: "/BrandWork" },
      { icon: <GroupIcon color="white" />, label: 'Blog Posts', navigate: "/Blog" },
      { icon: <Message color="white" />, label: 'Message', navigate: "/Message" },
      { icon: <HelpIcon color="white" />, label: 'Help', navigate: "/Info" }
    ];

    return { CustomButtons, IconNames, Pages, menuItems };
  }, []);

  return (
    <>
      <BrandDashBoardTemplate
        CustomButtons={DashBoardData.CustomButtons}
        IconNames={DashBoardData.IconNames}
        Pages={DashBoardData.Pages}
        menuItems={DashBoardData.menuItems}
      >
        {/* Pass the main bar as the child, which contains the /Home /Search routes and pages */}
        <MainBar />
      </BrandDashBoardTemplate>
    </>
  );
};

export default InfluencerDashBoard;