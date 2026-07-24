import { Request, Response } from 'express';
import { StoreSettings } from '../models';

const DEFAULT_SETTINGS = {
  whatsappPhone: '5531971842477',
  contactEmail: 'amgoulart@hotmail.com',
  hoursWeekdays: 'Seg a Sex: 9h - 18h',
  hoursSaturday: 'Sábado: 10h - 14h',
  hoursSunday: 'Domingo: Fechado',
};

const getOrCreateSettings = async () => {
  const existing = await StoreSettings.findOne();
  if (existing) return existing;
  return StoreSettings.create(DEFAULT_SETTINGS);
};

export default class StoreSettingsController {
  static async get(req: Request, res: Response) {
    try {
      const settings = await getOrCreateSettings();
      res.json(settings);
    } catch (error) {
      console.error('Erro ao buscar configurações da loja:', error);
      res.status(500).json({ message: 'Erro ao buscar configurações da loja' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { whatsappPhone, contactEmail, hoursWeekdays, hoursSaturday, hoursSunday } = req.body;

      if (!whatsappPhone || !contactEmail || !hoursWeekdays || !hoursSaturday || !hoursSunday) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const settings = await getOrCreateSettings();
      await settings.update({ whatsappPhone, contactEmail, hoursWeekdays, hoursSaturday, hoursSunday });

      res.json(settings);
    } catch (error) {
      console.error('Erro ao atualizar configurações da loja:', error);
      res.status(500).json({ message: 'Erro ao atualizar configurações da loja' });
    }
  }
}
