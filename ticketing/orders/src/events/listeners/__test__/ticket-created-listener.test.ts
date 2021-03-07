import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { ITicketCreatedEvent } from '@dt-ticketing/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: ITicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
      listener, data, msg
  }
};

it('creates and saves a ticket', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price.toString());
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled()
});
