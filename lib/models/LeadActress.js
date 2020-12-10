const pool = require('../utils/pool');

module.exports = class LeadActress {
    id;
    name;
    movieId;

    constructor(row) {
      this.id = String(row.id);
      this.name = row.name;
      this.movieId = String(row.movie_id);
    }

    static async insert({ name, movieId }) {
      const { rows } = await pool.query(
        'INSERT INTO lead_actresses (name, movie_id) VALUES ($1, $2) RETURNING *',
        [name, movieId]
      );

      return new LeadActress(rows[0]);
    }
};
