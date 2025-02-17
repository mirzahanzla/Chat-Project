
const ShowBlog = ({ Image, title, body, onClose }) => {

  return (
    <div className="bg-white mdm:w-[700px] md:w-[800px] lg:w-[900px] rounded-xl mx-auto mt-2 p-2 pr-5 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
      <div className="flex justify-end h-[34px] space-x-3">
        <img 
          src="/Svg/Close.svg" 
          alt="Close" 
          className="cursor-pointer" 
          onClick={onClose}  // Use the passed onClose function
        />
      </div>

      {/* Blog Image */}
      <div className="mt-10 w-[300px] flex mdm:h-[200px] mdm:w-[500px] md:h-[300px] md:w-[500px] mx-auto overflow-hidden md:items-center justify-center">
        <img className="aspect-square Avatar-v1" src={Image} alt="Blog Post" />
      </div>

      {/* Blog Post Details */}
      <div className="ml-5 xs:ml-10 sm:ml-24 text-[9px] xs:text-[10px] sm:text-[13px] md:text-[12px]">
        <p className="poppins-semibold mt-5 text-[16px]">{title}</p>
        <div className="mt-2">
          <p className="text-black/50">Content</p>
          <p className="font-medium">{body}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowBlog;