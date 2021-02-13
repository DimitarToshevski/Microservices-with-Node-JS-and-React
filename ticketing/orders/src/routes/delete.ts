import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@dt-ticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    // new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   ticketId: order.ticketId,
    //   userId: order.userId,
    // });
    
    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
