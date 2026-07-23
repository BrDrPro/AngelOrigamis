import { Request, Response } from 'express';
import { Order } from '../models';

const VALID_STATUSES = ['novo', 'em_andamento', 'concluido', 'cancelado'];

export default class OrderController {
  static async getAll(req: Request, res: Response) {
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json(orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { customerName, customerPhone, customerEmail, items, total } = req.body;

      if (!customerName || !customerPhone || !customerEmail || !items || total == null) {
        return res.status(400).json({ message: 'Nome, telefone, e-mail, itens e total são obrigatórios' });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'O pedido precisa ter ao menos um item' });
      }

      const order = await Order.create({
        customerName,
        customerPhone,
        customerEmail,
        items,
        total: Number(total),
        status: 'novo',
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Status inválido' });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      await order.update({ status });
      res.json(order);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).json({ message: 'Erro ao atualizar pedido' });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      await order.destroy();
      res.json({ message: 'Pedido excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      res.status(500).json({ message: 'Erro ao excluir pedido' });
    }
  }
}
