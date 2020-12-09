const express = require('express');
const app = express();

// endpoint
app.get('/', (req, res, next) => {
  res.send({ foo: 'bar' });
});

module.exports = app;
