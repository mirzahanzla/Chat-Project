import { useState, useMemo, useContext } from 'react'
import LeftSideBar from './DashBoard/LeftSideBar.jsx/LeftSideBar';
import TopHeader from './DashBoard/TopHeader';

import HiddenSideBar from './DashBoard/HiddenSideBar';
import MiddlePart from './DashBoard/MainBar.jsx/MiddlePart';


const BrandDashBoardTemplate = ({ CustomButtons, IconNames, Pages, menuItems, children }) => {

  const [SideBar, setSideBar] = useState(false)
  const [activeButton, setactiveButton] = useState(0)


  // We used the Usememo Hook  to store these objects as they are being passed to Component and i donot
  // want to render the component because the  object reference changes on each render
  let DashBoardData = useMemo(() => {



    return { CustomButtons, IconNames, Pages, menuItems }
  }, [])

  return (
    <>
      <div  >

        <div className='flex      h-screen'>



          {/* Left Side Bar Showing the Home Search ... and other Icons  */}
          <LeftSideBar setactiveButton={setactiveButton} activeButton={activeButton} CustomButtons={DashBoardData.CustomButtons} IconNames={DashBoardData.IconNames} Pages={DashBoardData.Pages} />

          <div className='w-full  '>
            {/* Hidden Side Bar that is visible on Click */}
            <HiddenSideBar SideBar={SideBar} setSideBar={setSideBar} menuItems={DashBoardData.menuItems} />

            {/* DashBoard Top Heading i.e Dashboard with __-__-__ hanbuger sign  */
  /* As Hamburger Sign is on Header and we want to toggle it , that's is why we 
passed the state varibles to Hidden and top header 
      DashBoardData.Pages indicates the pages we want to display
*/}
            <TopHeader activeButton={activeButton} Pages={DashBoardData.Pages} SideBar={SideBar} setSideBar={setSideBar} />

            {/* Dashboard  Top Header Bottom Two Components  */}
            {/* Not passing any State because they are using the Location Hooks for the Path  */}


            {/* Whether to show the Inbox or not Like in /Search we donot want to show the Inbox  */}

              <MiddlePart>{children}</MiddlePart>


          </div>



        </div>


      </div>


    </>
  )
}

export default BrandDashBoardTemplate