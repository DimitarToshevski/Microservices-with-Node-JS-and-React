import { ITicketUpdatedEvent, Publisher, Subjects } from '@dt-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
