
import { useLayoutEffect, useState } from 'react';

import './Index.css';
import Logo from '../../../../Components/Logo/Logo';
import { useNavigate } from 'react-router-dom';



const LeftSideBar = ({CustomButtons,IconNames,Pages,activeButton,setactiveButton}) => {

  //Set  the State of hover on button Hover 
  //Search and Info has different Hover State variable in there respective Component Class

  const [isHover, setisHover] = useState(-1)
  
console.log("Custome button are")
console.log(CustomButtons)
  // let Pages = ['/Home', '/Compaign', '/Saved', '/Groups', '/Message', '/Search', '/Help']
  // It will the Active Button according to 0,1,2,3,4,5,6

  // Used for Link when user click on any Button of side Bar 
  const navigate = useNavigate();

   // Get the index and set the active button accordingly
   const getIndexPage = (pathname) => {
    const pathParts = pathname.split('/');
    // Use the first part after splitting by '/' that is not empty
    const relevantPath = `/${pathParts[1]}`;
   
    return Pages.indexOf(relevantPath);
  };
 // Get the Index and set the Active button accordingly 
  let IndexPage = getIndexPage(location.pathname);
  
 
  //Change the Layout before its paint to the User screen ....that why used the layout not the UseEffect

  // also i have to used it because let take an example user search for /search but when the component mounts it take 
  //  the state of useState(0) but in the nav bar it is /Search then displyig the home Screen
  useLayoutEffect(() => {
    // so that user only type localhost:3000 then use the / to open the home page
    if (location.pathname.includes('Dashboard/')||location.pathname==='/') {
      
      setactiveButton(0)
   
    } else {
      setactiveButton(IndexPage)
    }
  }, [IndexPage])



  const HandleClick = (setactiveButtonValue, navigateValue) => {
    setactiveButton(setactiveButtonValue);
    navigate(navigateValue)
  }


  return (
    <>
      <div className='  hidden  md:flex md:justify-center   md:border-r-2  '>

        <div className=' w-[50px]   flex flex-col items-center  justify-between  h-screen'>
          {/* Setting the Width - Height of Container  */}
          <div className='flex flex-col items-center gap-5'>
            <div className='mt-4'>
              {/* Logo Settings */}
              <Logo />
            </div>
            <div className='  '>
              {/* Contains the Buttons of Left Side Bar */}
              {/* Search Icon  */}
              {CustomButtons && CustomButtons[0] &&<div
                onClick={() => { HandleClick(5, CustomButtons[0]['link']) }}
                onMouseEnter={() => { setisHover(0) }}
                onMouseLeave={() => { setisHover(-1) }}
                className={`size-[30px] rounded-xl   grid place-items-center bg-gray-200/90         hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2  ${activeButton === 5 ? 'Button' : ''} relative`}>

                {isHover === 0 ? <div className=' absolute w-[120px] right-[-135px] text-center border-[2px] rounded-lg  border-red-400 Button'>{CustomButtons[0]['name']}</div> : ""}

                {CustomButtons[0] &&   <img src={CustomButtons[0]['ImageSrc']} alt="" /> }
              </div>}

              {/* Other's Icon  */}
              <div className=' mt-10 flex flex-col gap-4'>
                {/* Giving the Value of active Button and also the Handle Function that will handle the active button state State  */}
                <SideBarIcons
                  names={IconNames}
                  active={activeButton}
                  HandleClick={HandleClick} />

              </div>
            </div>
            
          </div>

          {/* Info Icon  */}
          {CustomButtons  && CustomButtons[1] && <div
            onMouseEnter={() => { setisHover(1) }}
            onMouseLeave={() => { setisHover(-1) }}
            onClick={() => { HandleClick(6, CustomButtons[1]['link']) }}
            className={`size-[30px] rounded-xl    grid place-items-center bg-gray-200/90         hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2 mb-2 ${activeButton == 6 ? 'Button' : ''} relative`}>

            {isHover === 1 ? <div className=' absolute w-[120px] right-[-135px] text-center border-[2px] rounded-lg  border-red-400 Button'>{CustomButtons[1]['name']}</div> : ""}

            {CustomButtons[1] && <img src={CustomButtons[1]['ImageSrc']} alt="" />}

          </div>}
        </div>
      </div>
    </>
  )
}


const SideBarIcons = ({ names, active, HandleClick }) => {
  const [isHover, setisHover] = useState(-1)
  return (<>

    {/* let Pages = ['/Home', '/Compaign', '/Saved', '/Group', '/Message',] */}
    {/* Setting the above Icon and there hover State so that it will not cause whole sidebar Render  */}

    {names.map((v, i) => {

      return (

        <div key={i}
          onMouseEnter={() => { setisHover(i) }}
          onMouseLeave={() => { setisHover(-1) }}
          onClick={() => { HandleClick(i, v[2]) }} className={`size-[30px] rounded-xl    grid place-items-center bg-gray-200/90         hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2  ${i === active ? 'Button' : ''}   relative`}>

          {isHover === i ? <div className=' absolute w-[120px] right-[-135px] text-center border-[2px] rounded-lg  border-red-400 Button z-40'>{v[1]}</div> : ""}

          <img src={`/Svg/${v[0]}.svg`} alt="" />

        </div>

      )
    })}

  </>)

}

export default LeftSideBar;