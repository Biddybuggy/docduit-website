const ChatSkeleton = () => {
  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {/* Skeleton untuk pesan bot (kiri) */}
      <div className='flex items-end space-x-2'>
        <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none w-2/3 h-16 animate-pulse'></div>
      </div>
      {/* Skeleton untuk pesan user (kanan) */}
      <div className='flex items-end justify-end space-x-2'>
        <div className='p-4 rounded-lg bg-docduit-blue/10 rounded-br-none w-3/4 h-12 animate-pulse'></div>
      </div>
      {/* Skeleton untuk pesan bot kedua (kiri) */}
      <div className='flex items-end space-x-2'>
        <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none w-1/2 h-10 animate-pulse'></div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
