const pool = require('../utils/pool');
const LeadActress = require('./LeadActress');

module.exports = class Movie {
    id;
    title;
    director;
    year;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.director = row.director;
      this.year = String(row.year);
    }

    static async insert({ title, director, year }) {
      const { rows } = await pool.query(
        'INSERT INTO movies (title, director, year) VALUES ($1, $2, $3) RETURNING *',
        [title, director, year]
      );

      return new Movie(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `
        SELECT
          movies.*,
          array_to_json(array_agg(lead_actresses.*)) AS lead_actresses
        FROM movies
        JOIN lead_actresses
        ON movies.id = lead_actresses.movie_id
        WHERE movies.id=$1
        GROUP BY movies.id
        `,
        [id]
      );

      if(!rows[0]) throw new Error(`No movie with id ${id} found!`);
      return {
        ...new Movie(rows[0]),
        leadActresses: rows[0].lead_actresses.map(leadActresses => new LeadActress(leadActresses))
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM movies');

      return rows.map(row => new Movie(row));
    }

    static async update(id, { title, director, year }) {
      const { rows } = await pool.query(
        `UPDATE movies
          SET title=$1,
              director=$2,
              year=$3
          WHERE id=$4
          RETURNING *`,
        [title, director, year, id]
      );

      if(!rows[0]) throw new Error(`No movie with id ${id} found!`);
      return new Movie(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM movies WHERE id=$1 RETURNING *',
        [id]
      );

      return new Movie(rows[0]);
    }
};
