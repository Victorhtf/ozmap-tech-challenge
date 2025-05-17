import { TFunction } from 'i18next';

export interface RequestWithI18n {
  t: TFunction;
  language: string;
  i18n: {
    language: string;
    languages: string[];
    changeLanguage: (lng: string) => Promise<TFunction>;
    t: TFunction;
  };
}
