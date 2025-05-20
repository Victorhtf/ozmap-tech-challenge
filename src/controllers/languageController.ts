import { Request, Response } from 'express';
import { RequestWithI18n } from '../types/i18n';
import i18next from '../config/i18n';

export default class LanguageController {
  static async changeLanguage(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const { language } = req.body;

      if (!language) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('language.error.required'),
        });
        return;
      }

      const supportedLanguages = i18next.options.supportedLngs || ['pt-BR', 'en', 'es'];
      if (!supportedLanguages.includes(language)) {
        res.status(400).json({
          status: req.t('common.status.error'),
          message: req.t('language.error.unsupported', {
            language,
            supported: supportedLanguages.join(', '),
          }),
        });
        return;
      }

      await req.i18n.changeLanguage(language);

      res.status(200).json({
        status: req.t('common.status.success'),
        message: req.t('language.success.changed', { language }),
        currentLanguage: language,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('language.error.change'),
      });
    }
  }

  static async getCurrentLanguage(req: Request & RequestWithI18n, res: Response): Promise<void> {
    try {
      const supportedLanguages = (i18next.options.supportedLngs || ['pt-BR', 'en', 'es']).filter(
        (lang) => lang !== 'cimode' && lang !== 'dev'
      );

      res.status(200).json({
        status: req.t('common.status.success'),
        currentLanguage: req.language,
        supportedLanguages,
      });
    } catch (error) {
      res.status(500).json({
        status: req.t('common.status.error'),
        message: error instanceof Error ? error.message : req.t('language.error.get'),
      });
    }
  }
}
