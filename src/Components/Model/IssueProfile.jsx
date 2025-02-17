import React from 'react'

const IssueProfile = () => {
    return (
        <div className='bg-black/50 h-screen flex items-center justify-center'>

            <div className='bg-white rounded-2xl w-[450px] h-[500px]'>

                <div className="flex justify-end h-[34px] space-x-3">
                    <div className="OrangeButtonWithText-v4   flex items-center  cursor-pointer "><p>Request Deal</p></div>
                    <img src="/Svg/Close.svg" alt="" className="cursor-pointer" />
                </div>

                <div className="DealsBorder">
                    <p className="text-black/50">Compaign Description</p>
                    <p className="font-medium">Our PHATOIL brand was founded based on our founder's personal journey exploring the healing powers of plants.
                        With a passion for wellness and nature, began researching essential oil uses from various cultures around the
                        world. Our product, PHATOIL Plant Essential Oils, is crafted from natural ingredients, focused on delivering a holistic healing
                        experience that nurtures both body and mind.</p>
                </div>
                
            </div>


        </div>
    )
}

export default IssueProfile