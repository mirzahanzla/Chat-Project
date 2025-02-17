const CardWithImage = ({ Heading, totalNumbers, Percentage, time, ImageSource }) => {
  return (
    <div className="w-[160px] h-[120px] mdm:w-[250px] mdm:h-[170px] bg-white rounded-2xl flex flex-col justify-between OverViewBox1 justify-self-center">
      <div className="px-3 py-1 mdm:px-4 mdm:py-2 lato-regular">
        <p className="lato-regular text-sm mdm:text-xl">{Heading}</p>
        <p className="text-sm mdm:text-xl text-green-600">{totalNumbers}</p>
        <div className="mdm:ml-5 lato-regular mdm:mt-2 flex justify-between">
          <div>
            <div className="flex items-center">
           
              <span className="text-sm text-green-500">{Percentage} %</span>
            </div>
            <span className="text-sm text-gray-400">vs {time}</span>
          </div>
          <img
            className="w-[50px] aspect-square"
            src={`/Images/${ImageSource}`}
            alt="Card Image"
          />
        </div>
      </div>
    </div>
  );
};

export default CardWithImage;