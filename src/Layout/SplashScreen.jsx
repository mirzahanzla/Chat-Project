import LogoAnimation from '../Components/LogoAnimation/LogoAnimation';
import {motion} from 'framer-motion';
const SplashScreen = () => {
    return (
        <>
            <motion.div
             layoutId='Logo'
            animate={{scale:[1,1.5,2,2.5]}}
             transition={{duration:2,delay:8,times:[0,0.3,0.5,.1]}}
            className='w-screen h-screen flex justify-center items-center flex-col'>
                <LogoAnimation />
                <div className='loader'></div>
            </motion.div>
        </>
    )
}

export default SplashScreen