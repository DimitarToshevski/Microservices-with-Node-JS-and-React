import { OrderStatus } from '@dt-ticketing/common';
import mongoose from 'mongoose';
import { ITicketDoc } from './ticket';

// An interface that describes the properties that are required to create a new Order
interface IOrder {
  ticket: ITicketDoc;
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
}

// An interface that describes the properties that a Order model has
interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrder): IOrderDoc;
}

// An interface that describes the properties that a Order document has
interface IOrderDoc extends mongoose.Document {
  ticket: ITicketDoc;
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
}

const orderSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

orderSchema.statics.build = (attrs: IOrder) => {
  return new Order(attrs);
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order };
