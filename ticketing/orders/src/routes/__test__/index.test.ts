import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
}

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  const userTwoCookie = global.signup();

  const { body: userTwoOrderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: userTwoOrderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2

  const userTwoOrdersResponse = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwoCookie)
    .send()
    .expect(200);

    expect(userTwoOrdersResponse.body.length).toEqual(2);
    expect(userTwoOrdersResponse.body[0]).toEqual(userTwoOrderOne);
    expect(userTwoOrdersResponse.body[1]).toEqual(userTwoOrderTwo);
});
