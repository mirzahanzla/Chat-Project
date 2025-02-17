const SimpleCard = ({ name, price }) => {
  return (
    <div className="text-[10px] w-[160px] h-[120px] mdm:w-[150px] mdm:h-[120px] bg-white rounded-2xl flex flex-col justify-center OverViewBox1 justify-self-center">
      <div className="px-3 py-1 mdm:py-2 lato-regular">
        <p className="lato-regular text-sm mdm:text-xl">{name}</p>
        <p className="text-sm mdm:text-xl text-green-500 mt-3">{price}</p>
      </div>
    </div>
  );
};

export default SimpleCard;