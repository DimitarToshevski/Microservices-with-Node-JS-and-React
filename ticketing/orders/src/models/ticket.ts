import { OrderStatus } from '@dt-ticketing/common';
import mongoose from 'mongoose';
import { Order } from './order';

// An interface that describes the properties that are required to describe a Ticket
interface ITicket {
  title: string;
  price: number;
}

// An interface that describes the properties that a Ticket model has
interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicket): ITicketDoc;
}

// An interface that describes the properties that a Ticket document has
export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
  // Make sure that this ticket is not already reserved
  // Run query to look at all orders. Find an order where the ticket
  // is the ticket we just found and the orders status is not cancelled.
  // If we find an order from that means the ticket is reserved.
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { Ticket };
