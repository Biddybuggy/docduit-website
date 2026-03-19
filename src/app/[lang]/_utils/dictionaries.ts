type DictionaryLoader = () => Promise<{ [key: string]: any }>;
export type Dictionaries = {
  en: DictionaryLoader;
  id: DictionaryLoader;
};
export const dictionaries: Dictionaries = {
  en: () => import('../../../locales/en.json').then((module) => module.default),
  id: () => import('../../../locales/id.json').then((module) => module.default),
};

export type Locale = 'en' | 'id';

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return dictionaries['id']();
  }
  return dictionaries[locale]();
};
