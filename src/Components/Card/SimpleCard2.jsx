const SimpleCard2 = ({ Heading, Value, ImageSource }) => {
    return (
      <div className="w-[160px] h-[120px] mdm:w-[250px] mdm:h-[120px] bg-white rounded-2xl flex flex-col justify-between OverViewBox1 justify-self-center">
        <div className="px-3 py-1 mdm:px-4 mdm:py-2 lato-regular">
          <p className="lato-regular text-sm mdm:text-xl">{Heading}</p>
  
          <div className="mdm:ml-5 lato-regular mdm:mt-2 flex justify-between items-center">
            <h3 className="text-2xl text-red-500 lato-bold">{Value}</h3>
            <img className="w-[50px] asp" src={`/Images/${ImageSource}`} alt="" />
          </div>
        </div>
      </div>
    );
};
  
export default SimpleCard2;