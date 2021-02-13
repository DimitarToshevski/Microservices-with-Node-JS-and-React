import { ITicketCreatedEvent, Publisher, Subjects } from '@dt-ticketing/common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
