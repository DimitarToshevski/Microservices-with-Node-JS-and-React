import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns a 404 of the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({ title: 'title', price: 20 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'title', price: 20 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const createTicketResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signup())
      .send({ title: 'title', price: 20 })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', global.signup())
      .send({ title: 'title', price: 30 })
      .expect(401);
});

it('returns a 401 if the user provides invalid title or price', async () => {
    const cookie = global.signup();

    const createTicketResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'title', price: 20 })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 30 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ price: 30 })
      .expect(400);
      
    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title', price: -30 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title' })
      .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signup();

    const createTicketResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'title', price: 20 })
      .expect(201);

    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'new title', price: 30 })
      .expect(200);

    const getTicketResponse = await request(app)
      .get(`/api/tickets/${createTicketResponse.body.id}`)
      .send()
      .expect(200);

      expect(getTicketResponse.body.title).toEqual('new title')
      expect(getTicketResponse.body.price).toEqual('30')
    });
