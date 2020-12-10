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

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM lead_actresses WHERE id=$1',
        [id]
      );

      if(!rows[0]) throw Error(`No actress with id ${id} found!`);
  
      return new LeadActress(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query(
        'SELECT * FROM lead_actresses'
      );

      return rows.map(row => new LeadActress(row));
    }

    static async update(id, { name, movieId }) {
      const { rows } = await pool.query(
        `UPDATE lead_actresses
            SET name=$1,
                movie_id=$2
            WHERE id=$3
            RETURNING *`,
        [name, movieId, id]
      );
  
      if(!rows[0]) throw new Error(`No actress with id ${id} found!`);
      return new LeadActress(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM lead_actresses WHERE id=$1 RETURNING *',
        [id]
      );

      return new LeadActress(rows[0]);
    }
};
