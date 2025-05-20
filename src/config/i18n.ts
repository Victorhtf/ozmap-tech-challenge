import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import fs from 'fs';

const localesPath = path.join(__dirname, '../locales');
const availableLanguages = fs.readdirSync(localesPath).filter(file => 
  fs.statSync(path.join(localesPath, file)).isDirectory()
);


i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'pt-BR',
    supportedLngs: availableLanguages,
    preload: availableLanguages,
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupHeader: 'accept-language',
      caches: ['cookie'],
      cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18next;
