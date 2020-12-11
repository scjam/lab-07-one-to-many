const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Movie = require('../lib/models/Movie');
const LeadActress = require('../lib/models/LeadActress');

describe('endpoints', () => {
  let movie;
  let leadActress;
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    movie = await Movie.insert({
      title: 'Titanic',
      director: 'James Cameron',
      year: 1997
    });
    leadActress = await LeadActress.insert({
      name: 'Kate Winslet',
      movieId: movie.id
    });
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
      id: '2',
      title: 'Titanic',
      director: 'James Cameron',
      year: '1997'
    });
  });

  it('finds a movie by id and associated lead actress via GET', async() => {
    const movie = await Movie.insert({
      title: 'Titanic',
      director: 'James Cameron',
      year: '1997'
    });

    const leadActresses = await Promise.all([
      { name: 'Kate Winslet', movieId: movie.id },
      { name: 'Claire Danes', movieId: movie.id },
      { name: 'Toni Collette', movieId: movie.id }
    ].map(leadActress => LeadActress.insert(leadActress)));

    const res = await request(app)
      .get(`/movies/${movie.id}`);
    
    expect(res.body).toEqual({
      ...movie,
      leadActresses: expect.arrayContaining(leadActresses)
    });
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
    expect(res.body).toHaveLength(movies.length + 1);
  });

  it('updates a movie via PUT', async() => {
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

  it('creates a new lead actress via POST', async() => {
    const res = await request(app)
      .post('/actresses')
      .send({
        name: 'Claire Danes',
        movieId: movie.id
      });

    expect(res.body).toEqual({
      id: '2',
      name: 'Claire Danes',
      movieId: movie.id
    });
  });

  it('gets an actress by id via GET', async() => {
    const res = await request(app)
      .get(`/actresses/${leadActress.id}`);
    
    expect(res.body).toEqual(leadActress);
  });

  it('gets all actresses via GET', async() => {
    const leadActresses = await Promise.all([
      {
        name: 'Kate Winslet',
        movieId: LeadActress.movie_id
      },
      {
        name: 'Claire Danes',
        movieId: LeadActress.movie_id
      },
      {
        name: 'Toni Collette Winslet',
        movieId: LeadActress.movie_id
      }
    ].map(leadActress => LeadActress.insert(leadActress)));
  
    const res = await request(app)
      .get('/actresses');
        
    expect(res.body).toEqual(expect.arrayContaining(leadActresses));
    expect(res.body).toHaveLength(leadActresses.length + 1);
  });

  it('updates an actress via PUT', async() => {
    const res = await request(app)
      .put(`/actresses/${leadActress.id}`)
      .send({
        name: 'Kate E. Winslet',
        movieId: movie.id
      });

    expect(res.body).toEqual({
      id: leadActress.id,
      name: 'Kate E. Winslet',
      movieId: movie.id
    });
  });

  it('deletes an actress via DELETE', async() => {
    const res = await request(app)
      .delete(`/actresses/${leadActress.id}`);

    expect(res.body).toEqual(leadActress);
  });
});
