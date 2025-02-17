import CardWithImage from "../../../../../Components/Card/CardWithImage";
import ProfileMedia from "../../../../../Components/Card/ProfileMedia";
import './Index.css';

const Media = () => {
  const mediaData = [
    {
      PostImageSrc: "/Media/p6.jpg",
      ProfileImage: "/Media/p10.jpg",
      name: "Rizwan Sabir",
      Likes: "2.3K",
      Comments: "2.3K",
      Reach: "4K",
      Engagement: "4K"
    },
    {
      PostImageSrc: "/Media/p7.jpg",
      ProfileImage: "/Media/p2.jpg",
      name: "Rizwan Sabir",
      Likes: "2.3K",
      Comments: "2.3K",
      Reach: "4K",
      Engagement: "4K"
    },
    {
      PostImageSrc: "/Media/p12.jpg",
      ProfileImage: "/Media/p1.jpg",
      name: "Rizwan Sabir",
      Likes: "2.3K",
      Comments: "2.3K",
      Reach: "4K",
      Engagement: "4K"
    },
    {
      PostImageSrc: "/Media/p1.jpg",
      ProfileImage: "/Media/p3.jpg",
      name: "Rizwan Sabir",
      Likes: "2.3K",
      Comments: "2.3K",
      Reach: "4K",
      Engagement: "4K"
    }
  ];

  return (
    <div className="bg-white w-full mt-10 rounded-3xl mb-10">
      <div className="px-5 py-5 flex flex-col">
        <p className="lato-bold text-lg">Media</p>
        <div className="mt-6 poppins-regular text-[10px] md:text-base">
          <div className="mt-2 grid xs:grid-cols-2 xs:grid-rows-3 gap-y-5 md:grid-cols-3 md:grid-rows-2 gap-y-5">
            {mediaData.map((media, index) => (
             
                <ProfileMedia
                  key={index}
                  PostImageSrc={media.PostImageSrc}
                  ProfileImage={media.ProfileImage}
                  name={media.name}
                  Likes={media.Likes}
                  Comments={media.Comments}
                  Reach={media.Reach}
                  Engagement={media.Engagement}
                />
              
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Media;