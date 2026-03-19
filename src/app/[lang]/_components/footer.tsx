export default function FooterComponent() {
  const socials = [
    { name: 'instagram', icon: '/icons/instagram.svg', href: '#' },
    { name: 'tiktok', icon: '/icons/tiktok.svg', href: '#' },
    { name: 'facebook', icon: '/icons/facebook.svg', href: '#' },
    { name: 'youtube', icon: '/icons/youtube.svg', href: '#' },
  ];
  return (
    <footer className='w-full px-6 py-6 bg-docduit-blue text-white h-20 flex items-center rounded-t-[1.25rem] justify-between'>
      <p className='font-semibold text-xs lg:text-base'>
        © Copyright 2026 | docduit.com
      </p>
      <div className='flex gap-2 lg:gap-4'>
        {socials.map((social, idx) => (
          <img
            key={idx}
            src={social.icon}
            alt={social.name}
            className='w-4 h-4 lg:w-6 lg:h-6'
          />
        ))}
      </div>
    </footer>
  );
}
