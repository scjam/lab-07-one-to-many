const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Movie = require('../lib/models/Movie');
const pool = require('../lib/utils/pool');

describe('endpoints', () => {
  beforeEach(() => {
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
      year: '1997'
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

  it('finds all movies via GET', async() => {
    const movies = await Promise.all([
      {
        title: 'Titanic',
        director: 'James Cameron',
        year: '1997'
      },
      {
        title: 'Romeo + Juliet',
        director: 'Baz Luhrmann',
        year: '1996'
      },
      {
        title: 'Muriel\'s Wedding',
        director: 'P.J. Hogan',
        year: '1994'
      }
    ].map(movie => Movie.insert(movie)));

    const res = await request(app)
      .get('/movies');
      
    expect(res.body).toEqual(expect.arrayContaining(movies));
    expect(res.body).toHaveLength(movies.length);
  });

  it('updates a movie via PUT', async() => {
    const movie = await Movie.insert({
      title: 'Titanic',
      director: 'James Cameron',
      year: '1997'
    });

    const res = await request(app)
      .put(`/movies/${movie.id}`)
      .send({
        title: 'True Lies',
        director: 'James Cameron',
        year: '1994'
      });

    expect(res.body).toEqual({
      id: movie.id,
      title: 'True Lies',
      director: 'James Cameron',
      year: '1994' 
    });
  });

  it('deletes a movie via DELETE', async() => {
    const movie = await Movie.insert({
      title: 'Titanic',
      director: 'James Cameron',
      year: '1997'
    });

    const res = await request(app)
      .delete(`/movies/${movie.id}`);

    expect(res.body).toEqual(movie);
  });

});
