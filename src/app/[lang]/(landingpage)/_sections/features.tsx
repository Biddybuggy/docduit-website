import classNames from 'classnames';

export default function FeatureSection({
  vocabularies,
}: {
  vocabularies: any;
}) {
  const {
    home: {
      feature: { tagline, items },
    },
  } = vocabularies;
  const features = [
    {
      label: items.first.label,
      description: items.first.description,
      icon: '/icons/feature-1.svg',
      color: 'bg-docduit-red',
    },
    {
      label: items.second.label,
      description: items.second.description,
      icon: '/icons/feature-2.svg',
      color: 'bg-docduit-yellow',
    },
    {
      label: items.third.label,
      description: items.third.description,
      icon: '/icons/feature-3.svg',
      color: 'bg-docduit-blue',
    },
    {
      label: items.fourth.label,
      description: items.fourth.description,
      icon: '/icons/feature-4.svg',
      color: 'bg-docduit-green',
    },
  ];
  return (
    <div className='flex flex-col gap-8 w-full'>
      <div className='flex flex-col lg:gap-2 text-center'>
        <p className='font-bold text-2xl lg:text-3xl'>
          {tagline.first}&nbsp;
          <span className='text-docduit-blue'>{tagline.second}</span>&nbsp;
        </p>
        <p className='font-bold text-2xl lg:text-3xl'>{tagline.third}&nbsp;</p>
      </div>
      <div className='flex flex-col lg:flex-row gap-5'>
        {features.map((feature, index) => (
          <div
            key={index}
            className={classNames(
              'lg:w-1/4 h-64 rounded-xl shadow-lg shadow-slate-500 flex group',
              feature.color,
            )}
          >
            <div className='w-full h-60 group-hover:w-[85%] group-hover:h-[85%] group-hover:m-auto bg-white rounded-xl shadow-sm shadow-slate-50 group-hover:animate-in group-hover:fade-in duration-1000'>
              <div className='flex flex-col gap-8 items-center justify-center w-full h-full px-8 text-center my-auto group'>
                <img
                  src={feature.icon}
                  alt={feature.label}
                  className='min-w-6 min-h-6 group-hover:hidden'
                />
                <p className='font-medium text-xl group-hover:hidden'>
                  {feature.label}
                </p>
                <p className='font-medium text-sm hidden group-hover:block'>
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
