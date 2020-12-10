const { O_TRUNC } = require('constants');
const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Movie = require('../lib/models/Movie');
const pool = require('../lib/utils/pool');

describe('endpoints', () => {
  beforeAll(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new movie via POST', async() => {
    const res = await request(app)
      .post('/movies')
      .send({
        title: 'Titanic',
        director: 'James Cameron',
        year: '1997'
      });

    expect(res.body).toEqual({
      id: '1',
      title: 'Titanic',
      director: 'James Cameron',
      year: 1997
    });
  });

  it('finds a movie by id via GET', async() => {
    const movie = await Movie.insert({
      title: 'Titanic',
      director: 'James Cameron',
      year: '1997'
    });

    const res = await request(app)
      .get(`/movies/${movie.id}`);

    expect(res.body).toEqual(movie);
  });
});
