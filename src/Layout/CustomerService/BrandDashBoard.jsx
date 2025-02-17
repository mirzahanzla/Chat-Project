import { useMemo } from 'react'



import BrandDashBoardTemplate from '../../Components/DashBoardTemplate/DashBoardBoardTemplate';
import HomeIcon from '../../Components/Svg/HomeIcon';
import CompaignIcon from '../../Components/Svg/CompaignIcon';
import MainBar from './MainBar';
import InfluencerIcon from '../../Components/Svg/InfluencerIcon';
import WithDrawPaymentIcon from '../../Components/Svg/WithDrawPaymentIcon';
import PaymentIcon from '../../Components/Svg/PaymentIcon';


const BrandDashBoard = () => {


  // We used the Usememo Hook  to store these objects as they are being passed to Component and i donot
  // want to render the component because the  object reference changes on each render
  let DashBoardData = useMemo(() => {

    
    // Used to display the Icon and Its name on Hover and when Click address
    //image ,name hover,link 
    let IconNames = [['HomeIcon', 'Dashboard', '/Dashboard'], ['Queries', 'Queries', 'Queries'],['Payment', 'Payment', 'Payment'],['Influencer', 'Verify Influencer', 'Influencer'],['WithDraw', 'WithDraw Request', 'WithDraw'],['ContactUs', 'Contact Us', 'ContactUs']]

    // It will navigate the page upon the user itself add URL orr by navigate funtion when user Click 
    // It will the Active Button according to 0,1,2,3,4,5,6
    let Pages = ['/Dashboard', '/Queries','/Payment','/Influencer','/WithDraw','/Contact']


    let menuItems = [
      { icon: <HomeIcon color="white" />, label: 'Dashboard', navigate: "/Dashboard" },
      { icon: <CompaignIcon color="white" />, label: 'Queries', navigate: "/Queries" },
      { icon: <PaymentIcon color="white" />, label: 'Payment', navigate: "/Payment" },
      { icon: <InfluencerIcon color="white" />, label: 'Verify Influencer', navigate: "/Influencer" },
      { icon: <WithDrawPaymentIcon color="white" />, label: 'WithDraw Request', navigate: "/WithDraw" },
      { icon: <WithDrawPaymentIcon color="white" />, label: 'Contact Us', navigate: "/ContactUs" },
      
    ];

    return {  IconNames, Pages, menuItems }
  }, [])



  return (
    <>
      <BrandDashBoardTemplate IconNames={DashBoardData.IconNames} Pages={DashBoardData.Pages} menuItems={DashBoardData.menuItems} >
        {/* // we pass the main bar as the children that contains the /Home /Search Routes and pages  */}
        <MainBar />

      </BrandDashBoardTemplate>

    </>
  )
}

export default BrandDashBoard