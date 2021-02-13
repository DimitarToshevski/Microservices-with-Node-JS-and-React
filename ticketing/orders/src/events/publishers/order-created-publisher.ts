import { IOrderCreatedEvent, Publisher, Subjects } from '@dt-ticketing/common';

export class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
