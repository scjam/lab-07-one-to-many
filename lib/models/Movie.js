const pool = require('../utils/pool');

module.exports = class Movie {
    id;
    title;
    director;
    year;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.director = row.director;
      this.year = row.year;
    }

    static async insert({ title, director, year }) {
      const { rows } = await pool.query(
        'INSERT INTO movies (title, director, year) VALUES ($1, $2, $3) RETURNING *',
        [title, director, year]
      );

      return new Movie(rows[0]);
    }
};
