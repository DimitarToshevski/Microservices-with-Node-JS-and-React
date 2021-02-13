import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@dt-ticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
