import React from 'react';

const ProfileMedia = ({ PostImageSrc, ProfileImage, name, Likes, Comments }) => {
  return (
    <div className="text-[10px] lg:text-[12px] w-[250px] h-[370px] mdm:w-[250px] mdm:h-[370px] bg-white rounded-2xl flex flex-col OverViewBox1 justify-self-center">
      <div className="w-[250px] rounded-xl overflow-hidden">
        {/* Post Image */}
        <div className="h-[250px] rounded-lg flex items-center">
          {PostImageSrc ? (
            <img
              className="aspect-square ProfileMedia"
              src={PostImageSrc} // Directly using the PostImageSrc
              alt="Post"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = ''; // Clear the source on error
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span>No Image Available</span> {/* Fallback message */}
            </div>
          )}
        </div>

        {/* Post Details */}
        <div className="mt-3 ml-3 flex items-center">
          <img src={ProfileImage} className="Avatar size-[45px]" alt="Profile" />

          <div className="ml-2 flex flex-col justify-center">
            <p>{name}</p>
            <div className="flex gap-x-3">
              {/* Likes */}
              <p className="flex items-center gap-x-1">
                <img src="/Svg/Heart.svg" className="Avatar size-[15px]" alt="Likes" />
                <span>{Likes}</span>
              </p>
              {/* Comments */}
              <p className="flex items-center gap-x-1">
                <img src="/Svg/Comment.svg" className="Avatar size-[15px]" alt="Comments" />
                <span>{Comments}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMedia;