import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './Index.css';
import Card from '../../../../../Components/Card/Card';
import CardWithImage from '../../../../../Components/Card/CardWithImage';
import SimpleCard2 from '../../../../../Components/Card/SimpleCard2';
import SimpleBarChart from '../../../../../Components/Charts/SimpleBarChart';
import Media from '../Home/Media';
import ScreenSizeDisplay from '../../../../../useCurrentScreenSize';
const InfluencerProfile = ({setShowInfluencerProfile}) => {

    const navItems = ['Overview', 'Engagement', 'Brand', 'Media'];
    const BrandItems = ['Categories', 'Fashion', 'Clothing', 'Other'];

    return (
        <>
    <div className=" flex justify-end  w-[300px] xs:w-[500px] gap-x sm:w-[640px] md:w-[740px] lg:w-[800px] mx-auto pt-3 pb-3 cursor-pointer" onClick={() => {
        setShowInfluencerProfile(0)
    }}>
        <img src="Svg/Close.svg" alt="" />
    </div>
            <ProfileInformation />

            <div className="navBgColor  xs:flex rounded-full py-2  px-2  hidden xs:w-[300px] mdm:w-[400px]  lg:gap-x-4 lg:w-[500px]  mx-auto mt-5">
                <NavBarItems items={navItems} path={"Search"} />
            </div>


            {/* OverView */}
            <div className=" w-[300px] xs:w-[550px] sm:w-[700px]  mdm:w-[820px] lg:w-[900px] mx-auto">

                <div className="bg-white w-full   mt-10 rounded-3xl  mx-auto">
                    <div className="px-5 py-3 flex flex-col">

                        <p className="lato-bold   text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px]">OverView</p>

                        <div className="mt-6 ">
                            <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-3 gap-y-5  md:grid-cols-3 md:grid-rows-2  justify-center items-center  gap-y-5 ">
                                <Card Heading="Total Followers" totalNumbers="30,412" Percentage="1.5" time="LastMonth" Status={1} />
                                <Card Heading="Engagement Rate" totalNumbers="30,412" Percentage="1.5" time="LastMonth" Status={0} />
                                <Card Heading="Auidence Eagagement" totalNumbers="30,412" Percentage="1.5" time="LastMonth" Status={1} />

                                <SimpleCard2 Heading="Post Frequency " Value="8 / Week" ImageSource="card1.png" />
                                <Card Heading="Total Likes" totalNumbers="30,412" Percentage="1.5" time="LastMonth" Status={1} />
                                <SimpleCard2 Heading="Budget Spent" Value="12,345 $" ImageSource="card2.png" />

                            </div>
                        </div>
                    </div>
                </div>

                <Engagement />

                {/* Work with Brands  */}
                <div className="bg-white w-full   mt-10 rounded-3xl  mx-auto">
                    <div className="px-5 py-3 flex flex-col">

                        <p className="lato-bold text-lg">Brand</p>
                        <p className="lato-light">15 Brands</p>

                        <div className="navBgColor hidden xs:flex rounded-xl xs:py-2 xs:px-2 sm:flex-nowrap  mdm:gap-x-0 lg:gap-x-4 mdm:w-[300px] lg:w-[500px] mt-5 mx-auto">
                            <NavBarItems items={BrandItems} path={"Search"} />
                        </div>

                        <div className="mt-8 flex  justify-around flex-col sm:flex-row items-center gap-y-5">
                            <SimpleCard />
                            <SimpleCard />
                            <SimpleCard />
                        </div>
                    </div>
                </div>


                <Media />

            </div>




        </>
    )
}

const ProfileInformation = ({ ProfileImage, name, UserName, Followers, ER, Instagram, Likes, Comments, Bio, pic1, pic2, pic3, pic4 }) => {

    return (

        <>
            <div className="  border-2">
                {/* wrapper div orr background of list  */}
                <div className="bg-white grid grid-cols-12 OverViewBox2  w-[300px] xs:w-[500px] gap-x sm:w-[640px] md:w-[740px] lg:w-[800px] p-2 border-2 mx-auto  rounded-xl">


                    {/* Profile Picture  */}
                    <div className="col-span-2 flex justify-center items-center">
                        <div className="flex size-[60px] xs:size-[80px] sm:size-[100px] md:size-[100px] items-center ">
                            <img className=" aspect-square Avatar" src="Media/p1.jpg" alt="" />
                        </div>
                    </div>

                    {/* Middle part general information  */}
                    <div className="col-span-7 mt-4 ml-2 ">
                        <p className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] " >Sana Sabir</p>
                        {/* Id of Influencer  */}
                        <p className="lato-regular text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] text-black/50 ">@sanasabir321</p>
                        <p className="poppins-regular text-[9px]  sm:text-[13px] md:text-[11px] mt-2  xs:text-[10px]  ">Embrace the Ashin Aura: Where Tradition Meets Trend.</p>
                        <div className=" hidden xs:flex  gap-2 mt-2 mb-2">
                            <p className='SilverButtonWithText text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px]  cursor-pointer'>Fashion</p>
                            <p className='SilverButtonWithText text-[9px] sm:text-[12px] lg:text-[11px] xs:text-[10px]  cursor-pointer'>Shoppings </p>

                        </div>
                    </div>

                    {/* Right Part with followers and following  */}
                    <div className="col-span-3 justify-self-center  mt-4">

                        <div className="flex items-center  gap-x-1">
                            <img src="/Svg/Instagram.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="" />
                            <p className="text-[9px] lato-light  xs:text-[10px] sm:text-[11px]">  2.3K Followers</p>
                        </div>

                        <div className=" hidden  xs:flex justify-center gap-x-3 mt-2">
                            <div className=" flex items-center gap-x-1 ">
                                <img src="/Svg/Heart.svg" className="Avatar   xs:size-[15px] sm:h-[16px]" alt="" />
                                <p className="text-[9px] lato-light  xs:text-[10px] sm:text-[11px]"> 23.1K</p>
                            </div>
                            <div className="flex items-center  gap-x-1">
                                <img src="/Svg/Comment.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="" />
                                <p className="text-[9px] lato-light  xs:text-[10px] sm:text-[11px]">  2.3K</p>
                            </div>
                        </div>

                        <div className="flex  gap-2 mt-2 mb-2">
                            <div className='SilverButtonWithText   cursor-pointer'>
                                <img src="/Svg/Saved.svg" className="Avatar  size-[12px] xs:size-[15px] sm:h-[16px]" alt="" />
                            </div>
                            <div className='SilverButtonWithText  cursor-pointer'>
                                <img src="/Svg/message2.svg" className="Avatar size-[12px] xs:size-[15px] sm:h-[16px]" alt="" />
                            </div>

                        </div>

                    </div>

                    {/* End Wrapper div */}
                </div>
                {/* end of influencer List */}
            </div>

        </>
    )

}


const NavBarItems = ({ items, path }) => {
    const [isHover, setIsHover] = useState(-1);
    const [isActive, setIsActive] = useState(0);
    const navigate = useNavigate();

    return (
        <>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="poppins-semibold relative  z-50 w-full px-2 text-center sm:py-1 cursor-pointer text-sm "
                    onMouseEnter={() => setIsHover(index)}
                    onMouseLeave={() => setIsHover(-1)}
                    onClick={() => {
                        setIsActive(index);
                        navigate(`/${path}/${item}`);
                    }}
                >
                    <li className={`${isActive === index || isHover === index ? 'text-primary' : ''} list-none`}>
                        <p className="poppins-bold text-[9px] xs:text-[10px] sm:text-[13px] md:text-[11px] ">{item}</p>
                        {isActive === index && (
                            <motion.div layoutId="1" className="absolute w-full bg-white h-full top-0 left-0 p-2 rounded-full -z-10"></motion.div>
                        )}
                    </li>
                </div>
            ))}
        </>
    );
};


const Engagement = () => {
    return (
        <>
            <>

                <div className="bg-white mx-auto  mt-10 rounded-3xl">

                    <div className="px-5 py-5 flex flex-col">

                        <p className="lato-bold text-lg">Engagement</p>

                        <div className="mt-6 ">

                            <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-1 gap-y-5  md:grid-cols-3 md:grid-rows-1  gap-y-5 ">
                                <Card Heading="Total Likes" totalNumbers="30,412" Percentage="1.5" time="LastMonth" Status={1} />
                                <Card Heading="Total Comments" totalNumbers="30,412" Percentage="1.5" time="LastMonth" Status={0} />

                            </div>
                            <p className="lato-regular mt-12 ml-7">Total Likes and Comments</p>
                            {/* 2px border and Bar chart */}
                            <div className="  border-2 rounded-xl lato-regular text-[10px]  mdm:text-base">

                                <div className="flex justify-between mx-10 w-[200px] mx-auto mb-5 mt-5 ">

                                    <div className="flex items-center gap-x-2">
                                        <div className="size-[10px] bg-blue-500 rounded-full"></div>
                                        <p>Likes</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="size-[10px] bg-green-500 rounded-full"></div>
                                        <p>Comments</p>
                                    </div>

                                </div>
                                <div className="w-full h-[200px] overflow-scroll  scroll-container ">
                                    <div className=" w-[900px] h-full  md:w-full">

                                        <SimpleBarChart />
                                    </div>
                                </div>

                            </div>

                        </div>



                    </div>
                </div>

            </>


        </>
    )
}


const SimpleCard = ({ name, price }) => {
    return (
        <>

            <div className=" text-[10px] xs:px-5 w-[200px] h-[200px] mdm:w-[200px] mdm:h-[200px] bg-white rounded-2xl flex  flex-col  OverViewBox1 justify-self-center">
                <div className=" px-3 py-1   mdm:py-2 lato-regular  mt-2">
                    <div className="flex items-center size-[80px] mx-auto">
                        <img className="Avatar  aspect-square" src="Media/p1.jpg" alt="" />
                    </div>
                    <div className="flex flex-col items-center ">
                        <p className="lato-regular text-sm">Rizwan Sabir</p>
                        <p className="lato-regular text-[10px] text-black/50">@rizwansabir</p>
                        <p className="lato-regular  mt-5 text-[14px] lato-bold text-green-500">3 Collaboration</p>

                    </div>

                </div>

            </div>

        </>
    )
}


export default InfluencerProfile;