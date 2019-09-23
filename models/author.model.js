const db = require('../db');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

/**
 * @typedef {Object} author
 * @property {string} name
 * @property {string} password
 */

/**
 * Inserts a new author into the db.
 * @param {author} newAuthor the data to create the author with
 * @returns {string} success message
 */
exports.insert = async ({ name, password }) => {
  if (!name || !password) {
    throw new ErrorWithHttpStatus('Missing properties', 400);
  }

  try {
    await db.query(
      `INSERT INTO author (name, password) VALUES ($1, $2) RETURNING *;`,
      [name, password]
    );
    return `${name} successfully registered`;
  } catch (err) {
    throw new ErrorWithHttpStatus('Database error', 500);
  }
};

/**
 * Selects author from db using name and password
 * @param string name of author
 * @returns {author} author's data
 */
exports.select = async name => {
  try {
    const author = await db.query(`SELECT * FROM author WHERE name = $1`, [
      name
    ]);
    return author.rows[0];
  } catch (err) {
    throw new ErrorWithHttpStatus('Database error', 500);
  }
};
