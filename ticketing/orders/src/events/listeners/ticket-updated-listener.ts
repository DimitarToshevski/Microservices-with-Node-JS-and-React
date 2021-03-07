import {
  Listener,
  ITicketUpdatedEvent,
  Subjects,
  NotFoundError,
} from '@dt-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = 'orders-service';

  async onMessage(data: ITicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data)

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
