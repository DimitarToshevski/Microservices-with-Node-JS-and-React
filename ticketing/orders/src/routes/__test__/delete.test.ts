import { OrderStatus } from '@dt-ticketing/common';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('cancels the order', async () => {
  const ticket = await buildTicket();
  const userCookies = global.signup();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookies)
    .send({ ticketId: ticket.id })
    .expect(201);
    

  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userCookies)
    .send()
    .expect(200);

  expect(cancelledOrder.id).toEqual(order.id);
  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401);
});
