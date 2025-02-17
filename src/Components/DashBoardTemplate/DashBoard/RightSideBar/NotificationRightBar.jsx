const NotificationRightBar = () => {
  return (
    <div className="bg-white hidden lg:block lg:col-span-2 mt-1">
      <div className="mr-5 ml-4 sm:hidden lg:block bg-white text-[7px] sm:text-[8px] mdm:text-[10px]">
        <p className='poppins-semibold text-[14px] mt-2'>Work Notification</p>
        <InboxMessages name="Rizwan Sabir" image="p1" time="01:20 PM" message="Requested +2 posts" unread={2} />
        <InboxMessages name="Rizwan Sabir" image="p2" time="Yesterday" message="Nice..." />
        <InboxMessages name="Rizwan Sabir" image="p3" time="12:20 AM" message="I am here" />
        <InboxMessages name="Rizwan Sabir" image="p10" time="Yesterday" message="Where?" unread={4} />
        <InboxMessages name="Rizwan Sabir" image="p9" time="09:20" message="Down here" />
      </div>
    </div>
  );
};

const InboxMessages = ({ image, name, time, message, unread = 0 }) => {
  return (
    <div className='flex my-4 text-[9px] sm:text-[10px] mdm:text-[10px]'>
      <img className='w-[30px] h-[30px] rounded-full' src={`/Media/${image}.jpg`} alt={`${name}'s avatar`} />
      <div className='flex flex-1 flex-col ml-2'>
        <div className='flex justify-between items-center'>
          <p className='poppins-semibold'>{name}</p>
          <p className='poppins-medium'>{time}</p>
        </div>
        <div className='flex justify-between text-black/70 text-[10px]'>
          <p>{message}</p>
          {unread > 0 && (
            <p className='bg-primary/90 px-2 text-white flex items-center rounded-full'>
              {unread}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationRightBar;