import {
  IOrderCancelledEvent,
  Publisher,
  Subjects,
} from '@dt-ticketing/common';

export class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
