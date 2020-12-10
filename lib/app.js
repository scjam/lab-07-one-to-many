const express = require('express');
const Movie = require('./models/Movie');
const app = express();

app.use(express.json());

// endpoint
app.post('/movies', (req, res, next) => {
  Movie
    .insert(req.body)
    .then(movie => res.send(movie))
    .catch(next);
});

app.get('/movies/:id', (req, res, next) => {
  Movie
    .findById(req.params.id)
    .then(movie => res.send(movie))
    .catch(next);
});

module.exports = app;
