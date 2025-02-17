
import { motion } from 'framer-motion';
const PopOver = ({msg,closePopOver}) => {

    return (

        
        
        (
        <motion.div
        // transition={{duration:}}
          initial={{ y: '-100%', opacity: 0 }} // Start off-screen
          animate={{ y: 0, opacity: 1 }} // Animate to visible
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ ease: "linear" }} 
           // Animate back off-screen
          className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-3 z-50 shadow-lg"
        >
          <p>{msg}</p>
          <button className="Button poppins-regular rounded-md py-[5px] md:py-[6px] px-5 cursor-pointer" onClick={closePopOver}>
            OK
          </button>
        </motion.div>
      )
        
    )
    
}

export default PopOver