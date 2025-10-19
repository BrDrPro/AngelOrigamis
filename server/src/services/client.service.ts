import { Client } from '../models/client.model';

export default class ClientService {
  static async getAll() {
    return Client.findAll();
  }

  static async create(data: { email: string }) {
    return Client.create(data);
  }
}