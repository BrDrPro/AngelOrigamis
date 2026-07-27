import { Request, Response } from 'express';
import { Order, Product } from '../models';

const VALID_STATUSES = ['novo', 'em_andamento', 'concluido', 'cancelado'];

type IncomingItem = {
  productId: number;
  quantity: number;
};

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
      const { customerName, customerPhone, customerEmail, items } = req.body;

      if (!customerName || !customerPhone || !customerEmail || !items) {
        return res.status(400).json({ message: 'Nome, telefone, e-mail e itens são obrigatórios' });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'O pedido precisa ter ao menos um item' });
      }

      // Preço e nome vêm sempre do banco, nunca do que o cliente mandou -
      // evita que alguém manipule o total editando o payload no navegador.
      const resolvedItems = [];
      for (const rawItem of items as IncomingItem[]) {
        const quantity = Math.max(1, Math.floor(Number(rawItem?.quantity) || 0));
        const product = await Product.findByPk(rawItem?.productId);

        if (!product || quantity < 1) {
          return res.status(400).json({ message: 'Um ou mais produtos do pedido são inválidos' });
        }

        resolvedItems.push({
          productId: product.get('id') as number,
          name: product.get('name') as string,
          price: product.get('price') as number,
          quantity,
        });
      }

      const total = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const order = await Order.create({
        customerName,
        customerPhone,
        customerEmail,
        items: resolvedItems,
        total,
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
