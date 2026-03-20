export default function FooterComponent() {
  const socials = [
    { name: 'instagram', icon: '/icons/instagram.svg', href: 'https://www.instagram.com/docduit.id' }, 
    { name: 'tiktok', icon: '/icons/tiktok.svg', href: 'https://www.tiktok.com/@docduit.id' }, 
  ];
  return (
    <footer className='w-full px-6 py-6 pr-20 md:pr-24 bg-docduit-blue text-white min-h-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-t-[1.25rem]'>
      <p className='font-semibold text-xs lg:text-base'>
        © Copyright 2026 | docduit.com
      </p>
      <div className='flex gap-2 lg:gap-4'>
        {socials.map((social, idx) => (
          <a
            key={idx}
            href={social.href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={social.name}
          >
            <img
              src={social.icon}
              alt={social.name}
              className='w-4 h-4 lg:w-6 lg:h-6'
            />
          </a>
        ))}
      </div>
    </footer>
  );
}
