import { Star } from 'lucide-react';

export default function TestimonySection({
  vocabularies,
}: {
  vocabularies: any;
}) {
  const {
    home: {
      testimony: { title, items },
    },
  } = vocabularies;
  const testimonies = [
    {
      name: items.first.name,
      occupation: items.first.occupation,
      testimony: items.first.testimony,
      avatar: '/avatar/testimony-1.jpeg',
      quot: '/icons/quot-blue.svg',
    },
    {
      name: items.second.name,
      occupation: items.second.occupation,
      testimony: items.second.testimony,
      avatar: '/avatar/testimony-2.jpeg',
      quot: '/icons/quot-red.svg',
    },
    {
      name: items.third.name,
      occupation: items.third.occupation,
      testimony: items.third.testimony,
      avatar: '/avatar/user-avatar.png',
      quot: '/icons/quot-green.svg',
    },
  ];
  return (
    <div id='testimonies' className='flex flex-col lg:px-24 lg:py-12'>
      <div className='flex items-center justify-center'>
        <p className='font-bold text-xl lg:text-4xl'>
          {title.first}&nbsp;
          <span className='text-docduit-blue'>{title.second}</span>&nbsp;
          {title.third}&nbsp;
          <span className='text-docduit-blue'>{title.fourth}</span>?
        </p>
      </div>
      <div className='flex flex-col gap-20 lg:flex-row lg:gap-8  items-center justify-center mt-24'>
        {testimonies.map((testimony, idx) => (
          <div
            key={idx}
            className='relative flex flex-col gap-4 items-center bg-white rounded-xl shadow-lg shadow-slate-600 p-8 border lg:w-1/3'
          >
            <img
              src={testimony.avatar}
              alt={testimony.name}
              className='w-28 h-28 rounded-full -mt-24 shadow-lg shadow-slate-500 bg-white'
            />
            <img
              src={testimony.quot}
              alt={`quot-${idx}`}
              className='w-14 h-14 absolute -top-7 right-0 '
            />
            <div>
              <p className='font-semibold text-center'>{testimony.name}</p>
              <p className='text-center text-sm'>{testimony.occupation}</p>
            </div>
            <p className='font-normal text-sm text-justify'>
              {testimony.testimony}
            </p>
            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((idx) => (
                <Star stroke='0' fill='#FEC524' key={idx} size={24} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
