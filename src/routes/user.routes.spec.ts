import request from 'supertest';

import app from '../app';

let token: string;

describe('user routes', () => {
  beforeAll(async () => {
    await app.startServer();

    const result = await request(app.express).post('/api/session/create').send({
      username: 'admin',
      password: 'Admin@123',
    });

    token = result.body.token;
  });

  afterAll(async () => {
    await app.closeServer();
  });

  describe('GET /find-many', () => {
    it('returns with status 200', async () => {
      const result = await request(app.express)
        .get('/api/user/find-many')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      const [users, usersCount] = result.body;

      expect(result.status).toEqual(200);
      expect(usersCount).toEqual(1);
      expect(users[0]).toHaveProperty('id', 1);
      expect(users[0]).toHaveProperty('name', 'Admin');
      expect(users[0]).toHaveProperty('username', 'admin');
      expect(users[0]).toHaveProperty('email', 'admin@admin.com');
      expect(users[0]).toHaveProperty('createdAt');
      expect(users[0]).toHaveProperty('updatedAt');
      expect(users[0]).toHaveProperty('deletionDate', null);
    });
  });

  describe('POST /user/create', () => {
    it('returns with status 200', async () => {
      const result = await request(app.express).post('/api/user/create').send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@doe.com',
        password: 'John@123',
      });

      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('id', 2);
      expect(result.body).toHaveProperty('name', 'John Doe');
      expect(result.body).toHaveProperty('username', 'johndoe');
      expect(result.body).toHaveProperty('email', 'john@doe.com');
      expect(result.body).toHaveProperty('createdAt');
      expect(result.body).toHaveProperty('updatedAt');
      expect(result.body).toHaveProperty('deletionDate', null);
    });
  });
});
