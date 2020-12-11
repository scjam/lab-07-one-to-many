const express = require('express');
const LeadActress = require('./models/LeadActress');
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

app.get('/movies', (req, res, next) => {
  Movie
    .find()
    .then(movies => res.send(movies))
    .catch(next);
});

app.put('/movies/:id', (req, res, next) => {
  Movie
    .update(req.params.id, req.body)
    .then(movie => res.send(movie))
    .catch(next);
});

app.delete('/movies/:id', (req, res, next) => {
  Movie
    .delete(req.params.id)
    .then(movie => res.send(movie))
    .catch(next);
});

app.post('/actresses', (req, res, next) => {
  LeadActress
    .insert(req.body)
    .then(leadActress => res.send(leadActress))
    .catch(next);
});

app.get('/actresses/:id', (req, res, next) => {
  LeadActress
    .findById(req.params.id)
    .then(leadActress => res.send(leadActress))
    .catch(next);
});

app.get('/actresses', (req, res, next) => {
  LeadActress
    .find()
    .then(leadActresses => res.send(leadActresses))
    .catch(next);
});

app.put('/actresses/:id', (req, res, next) => {
  LeadActress
    .update(req.params.id, req.body)
    .then(leadActress => res.send(leadActress))
    .catch(next);
});

app.delete('/actresses/:id', (req, res, next) => {
  LeadActress
    .delete(req.params.id)
    .then(leadActress => res.send(leadActress))
    .catch(next);
});

module.exports = app;
