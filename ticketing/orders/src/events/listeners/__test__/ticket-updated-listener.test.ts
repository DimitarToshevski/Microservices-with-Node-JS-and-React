import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { ITicketUpdatedEvent } from '@dt-ticketing/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });

  await ticket.save();

  const data: ITicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: '123',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
    ticket
  };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price.toString());
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
