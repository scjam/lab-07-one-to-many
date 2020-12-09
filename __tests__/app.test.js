const request = require('supertest');
const app = require('../lib/app');

describe('endpoints', () => {
  it('creates a new movie via POST', async() => {
    const response = await request(app).get('/');

    expect(response.body).toEqual({ foo: 'bar' });
  });
});
