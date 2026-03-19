export const percentageDifferences = [
  2.47, 3.47, 20.26, 2.61, 10.29, 1.08, 4.61, 0.05, 2.11, 6.49, 0.54, 1.54,
  0.39, 1.32, 7.57, 0.34, 0.65, 1.72, 7.62, 1.62, 2.58, 5.05, 0.55, 2.93, 10.87,
  0.24, 2.4, 0.68, 10.2, 4.02, 1.2, 0.75, 4.82, 4.96, 6.72,
];
export const goldCAGR = 0.111873; // In percentage => 11.1873%
export const goldBuyPrice = 1414742;
export const goldSellPrice = 1365139;
export const usdCAGR = 0.027429; // In percentage => 2.7429%
export const referalLink = 'https://app.adjust.com/1jubr3z3';
export const forexReferalLink = 'https://bdi.co.id/dlpro';

export type Article = {
  title: string;
  date: Date;
  source: string;
  link: string;
  image: string;
};

export const articlesData: Article[] = [
  {
    title: 'Penting! Menabung untuk Mencapai Kemerdekaan Finansial',
    date: new Date('2024-08-15'),
    source: 'Metro TV News',
    link: 'https://www.metrotvnews.com/read/kM6CaDz2-penting-menabung-untuk-mencapai-kemerdekaan-finansial',
    image: '/illustrations/articles/news_1.jpg',
  },
  {
    title: 'Masa Depan Cerah Investasi Emas: Peluang di Era Ketidakpastian',
    date: new Date('2024-12-10'),
    source: 'Kompas',
    link: 'https://money.kompas.com/read/2024/12/10/114111426/masa-depan-cerah-investasi-emas-peluang-di-era-ketidakpastian?page=all',
    image: '/illustrations/articles/news_2.jpg',
  },
  {
    title: "Generasi 'Sandwich' Bisa Hidup Tenang di Hari Tua",
    date: new Date('2021-06-06'),
    source: 'CNN Indonesia',
    link: 'https://www.cnnindonesia.com/ekonomi/20210604191235-297-650569/generasi-sandwich-bisa-hidup-tenang-di-hari-tua',
    image: '/illustrations/articles/news_3.jpeg',
  },
  {
    title: "Financial Planners Plus AI: Why We're Better Together",
    date: new Date('2024-05-28'),
    source: 'Forbes',
    link: 'https://www.forbes.com/councils/forbesfinancecouncil/2024/05/28/financial-planners-plus-ai-why-were-better-together/',
    image: '/illustrations/articles/news_4.webp',
  },
];
