import { Request, Response } from 'express';
import SiteVisitService from '../services/siteVisit.service';

export default class SiteVisitController {
  static async register(req: Request, res: Response) {
    try {
      const { path } = req.body;
      await SiteVisitService.register(typeof path === 'string' ? path : undefined);
      res.status(201).json({ message: 'Visita registrada' });
    } catch (error) {
      console.error('Erro ao registrar visita:', error);
      res.status(500).json({ message: 'Erro ao registrar visita' });
    }
  }

  static async getTodayCount(req: Request, res: Response) {
    try {
      const count = await SiteVisitService.countToday();
      res.json({ count });
    } catch (error) {
      console.error('Erro ao buscar visitas de hoje:', error);
      res.status(500).json({ message: 'Erro ao buscar visitas de hoje' });
    }
  }
}
