import request from 'supertest';
import { app } from '../../app';

const createTicket = () =>
  request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'title', price: 20 });

it('can fetch a list of tickets', async () => {
  await createTicket().expect(201);
  await createTicket().expect(201);
  await createTicket().expect(201);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
