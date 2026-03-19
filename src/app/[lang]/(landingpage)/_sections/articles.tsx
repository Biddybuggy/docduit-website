'use client';
import useUserSessionQuery from '@/hooks/use-user-session';
import { Article, articlesData } from '@/lib/constants';
import Link from 'next/link';
import { safeSendGAEvent } from '@/lib/analytics';

export default function ArticleSection({
  vocabularies,
  lang,
}: {
  vocabularies: any;
  lang: string;
}) {
  const { userInfo } = useUserSessionQuery();
  const {
    home: {
      article: { title, navigation },
    },
  } = vocabularies;
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  const mainBlog = articlesData[0];
  const featuredBlogs = articlesData.slice(1, 4);

  const onNavigationClicked = (article: Article) => {
    safeSendGAEvent('event', 'click_article', {
      title: article.title,
      source: article.source,
      link: article.link,
      email: userInfo?.email,
      fullName: userInfo?.name,
    });
  };
  return (
    <div id='articles' className='flex flex-col gap-4 lg:gap-8'>
      <div className='flex items-center justify-center lg:justify-between'>
        <p className='font-bold text-xl lg:text-4xl'>
          <span className='text-docduit-blue'>{title.first}</span>&nbsp;
          {title.second}&nbsp;
        </p>
        {/* <div className='hidden lg:flex gap-2'>
          <p className='font-semibold'>{navigation}</p>
          <ArrowRight
            strokeWidth={3}
            fontWeight={600}
            size={24}
            className='text-docduit-red'
          />
        </div> */}
      </div>
      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='lg:w-1/2'>
          <Link
            href={mainBlog.link}
            target='_blank'
            className='flex flex-col gap-2'
            onClick={(e) => {
              onNavigationClicked(mainBlog);
            }}
          >
            <img
              src={mainBlog.image}
              alt='main-blog'
              className='w-auto h-auto rounded-xl'
            />
            <div className='flex flex-col'>
              <p className='text-sm font-normal'>
                {mainBlog.date.toLocaleDateString(locale, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className='font-normal text-gray-400'>{mainBlog.source}</p>
              <p className='text-lg lg:text-2xl font-semibold'>
                {mainBlog.title}
              </p>
            </div>
          </Link>
        </div>
        <div className='flex flex-col gap-4 lg:w-1/2'>
          {featuredBlogs.map((blog: Article, idx) => (
            <Link
              key={idx}
              className='flex gap-4 items-center'
              href={blog.link}
              target='_blank'
              onClick={(e) => {
                onNavigationClicked(blog);
              }}
            >
              <img
                src={blog.image}
                alt={`blog-${idx}`}
                className='min-w-[200px] max-w-[200px] h-auto rounded-xl'
              />
              <div className='flex flex-col'>
                <p className='text-sm font-normal'>
                  {blog.date.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className='font-normal text-gray-400'>{blog.source}</p>
                <p className='text-sm font-semibold'>{blog.title}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* <div className='lg:hidden flex gap-2 justify-end'>
          <p className='font-semibold'>{navigation}</p>
          <ArrowRight
            strokeWidth={3}
            fontWeight={600}
            size={24}
            className='text-docduit-red'
          />
        </div> */}
      </div>
    </div>
  );
}
