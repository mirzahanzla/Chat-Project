import { motion } from "framer-motion"

const LoginSignNavBar = ({User,setUser}) => {

  let users = [['Brand','Brand'], ['Influencer','influencer'], ['User','User']]
  
  return (
    <>

      <div className="flex flex-row justify-center mt-5 text-[8px] sm:text-[12px] w-[150px] xs:w-[200px] sm:w-[250px] mx-auto">
        <div className="flex flex-row bgColor py-1 w-full justify-around items-center rounded-3xl ">
          {
            users.map((user) => {
              return (
                user[0] === User[0] ? (<WhiteBackground  key={user} user={user} setUser={setUser}>
                 <motion.div className="absolute w-full bg-white h-full top-0 left-0   rounded-xl   -z-10" layoutId="underline" ></motion.div>
                </WhiteBackground>
                ) : <WhiteBackground  key={user} user={user} setUser={setUser} />
              );
            })
          }
        </div>
      </div>

      <div className=" my-1 sm:my-2     rounded-full   hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2 flex flex-row justify-center mt-5 text-[12px] w-[250px] mx-auto">
        <img className="w-5" src="Svg/Gmail.svg" alt="" />
        <p className=" ml-2 poppins-regular  text-[8px] sm:text-[12px] cursor-pointer"> Continue with google </p>
      </div>
    </>
  )
}

const WhiteBackground = ({ user, setUser, children }) => {
  return (
    <motion.div key={user} onMouseEnter={() => { setUser(user) }} className={ `poppins-regular px-2 py-1   relative z-30 cursor-pointer` }>
      <h1 >{user[0]}</h1>
      {children}
    </motion.div>
  );
};

export default LoginSignNavBar;