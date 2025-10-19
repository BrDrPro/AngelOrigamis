import { Request, Response } from 'express';
import ClientService from '../services/client.service';

export default class ClientController {
  static async getAll(req: Request, res: Response) {
    const clients = await ClientService.getAll();
    res.json(clients);
  }

  static async create(req: Request, res: Response) {
    const { email } = req.body;
    const client = await ClientService.create({ email });
    res.status(201).json(client);
  }
}