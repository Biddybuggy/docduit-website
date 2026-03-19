export default function ProfileComponentSkeleton() {
  return (
    <div className='flex gap-1 items-center p-4 rounded-lg animate-pulse'>
      {/* Skeleton untuk Avatar */}
      <div className='h-8 w-8 rounded-lg bg-gray-300 dark:bg-gray-700'></div>

      {/* Skeleton untuk Nama dan Email */}
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <div className='h-4 w-32 rounded-md bg-gray-300 dark:bg-gray-700 mb-1'></div>
        <div className='h-3 w-40 rounded-md bg-gray-300 dark:bg-gray-700'></div>
      </div>

      {/* Skeleton untuk Icon ChevronsUpDown */}
      <div className='ml-auto size-4 rounded-full bg-gray-300 dark:bg-gray-700'></div>
    </div>
  );
}