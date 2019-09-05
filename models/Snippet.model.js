const fs = require('fs').promises;
const path = require('path');
const shortid = require('shortid');
const db = require('../db');
const { readJSONFromDB, writeJSONToDB } = require('../utils/db');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

/**
 * @typedef {Object} Snippet
 * @property {string} id
 * @property {string} author
 * @property {string} code
 * @property {string} title
 * @property {string} description
 * @property {string} language
 * @property {string[]} comments
 * @property {number} favorites
 */

/**
 * Inserts a new snippet into the db.
 * @param {Snippet} newSnippet - the data to create the snippet with
 * @returns {Promise<Snippet>} the created snippet
 */
exports.insert = async ({ author, code, title, description, language }) => {
  if (!author || !code || !title || !description || !language) {
    throw new ErrorWithHttpStatus('Missing properties', 400);
  }

  /*
  const snippets = await readJSONFromDB('snippets');

  snippets.push({
    id: shortid.generate(),
    author,
    code,
    title,
    description,
    language,
    comments: [],
    favorites: 0
  });

  await writeJSONToDB('snippets', snippets);
  return snippets[snippets.length - 1];
  */

  try {
    const result = await db.query(
      `INSERT INTO snippet (author, code, title, description, language) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [author, code, title, description, language]
    );
    return result.rows[0];
  } catch (err) {
    throw new ErrorWithHttpStatus('Database error', 500);
  }
};

/**
 * Selects snippets from db.
 * Can accept optional query object to filter results.
 * @param {Object} [query]
 * @returns {Promise<Snippet[]>} array of Snippet objects
 */
exports.select = async (query = {}) => {
  try {
    /*
    const snippets = await readJSONFromDB('snippets');
    const filtered = snippets.filter(snippet =>
      Object.keys(query).every(key => query[key] === snippet[key])
    );
    return filtered;
    */
    const snippetValues = [];
    const conditions = [];
    let count = 0;

    if (query.author) {
      count++;
      conditions.push(`author = $${count}`);
      snippetValues.push(query.author);
    }
    if (query.code) {
      count++;
      conditions.push(`code = $${count}`);
      snippetValues.push(query.code);
    }
    if (query.title) {
      count++;
      conditions.push(`title = $${count}`);
      snippetValues.push(query.title);
    }
    if (query.description) {
      count++;
      conditions.push(`description = $${count}`);
      snippetValues.push(query.description);
    }
    if (query.language) {
      count++;
      conditions.push(`language = $${count}`);
      snippetValues.push(query.language);
    }
    if (query.id) {
      count++;
      conditions.push(`id = $${count}`);
      snippetValues.push(query.id);
    }

    let snippets;
    if (conditions.length > 0) {
      snippets = await db.query(
        `SELECT * FROM snippet WHERE ${conditions.join(' AND ')}`,
        snippetValues
      );
    } else {
      snippets = await db.query(`SELECT * FROM snippet`);
    }
    return snippets.rows;
  } catch (err) {
    throw new ErrorWithHttpStatus('Database error', 500);
  }
};

/**
 * Updates an existing snippet in the db.
 * @param {Snippet} snippetData - the data to update the snippet with
 * @param {string} snippetData.id - the id of the snippet to update
 * @returns {Promise<Snippet>} the updated snippet
 */
exports.update = async (snippetData = {}) => {
  if (!snippetData.id) throw ErrorWithHttpStatus('Missing ID', 400);

  /*
  // read snippets.json
  const snippets = await readJSONFromDB('snippets');

  // update the intended snippet
  const foundSnippet = snippets.find(snippet => snippet.id === snippetData.id);
  if (!foundSnippet) {
    throw new ErrorWithHttpStatus('ID not found', 400);
  }

  Object.keys(foundSnippet).forEach(key => {
    if (key in snippetData) {
      foundSnippet[key] = snippetData[key];
    }
  });

  // write back to the file
  await writeJSONToDB('snippets', snippets);
  return foundSnippet;
  */

  try {
    const snippetValues = [];
    let query = 'UPDATE snippet SET';
    let count = 0;

    if (snippetData.author) {
      count++;
      query = `${query} author = $${count},`;
      snippetValues.push(snippetData.author);
    }
    if (snippetData.code) {
      count++;
      query = `${query} code = $${count},`;
      snippetValues.push(snippetData.code);
    }
    if (snippetData.title) {
      count++;
      query = `${query} title = $${count},`;
      snippetValues.push(snippetData.title);
    }
    if (snippetData.description) {
      count++;
      query = `${query} description = $${count},`;
      snippetValues.push(snippetData.description);
    }
    if (snippetData.language) {
      count++;
      query = `${query} language = $${count},`;
      snippetValues.push(snippetData.language);
    }

    count++;
    query = `${query.slice(0, -1)} WHERE id = $${count} RETURNING *`;

    const result = await db.query(query, [...snippetValues, snippetData.id]);
    if (result.rowCount === 0) {
      throw new ErrorWithHttpStatus(
        `Snippet with ID ${snippetData.id} not found`,
        404
      );
    }
    return result.rows[0];
  } catch (err) {
    if (err instanceof ErrorWithHttpStatus) throw err;

    throw new ErrorWithHttpStatus('Database Error', 500);
  }
};

/**
 * Deletes an existing snippet from the db.
 * @param {string} id - the id of the snippet to delete
 * @returns {Promise<void>} the promise result from writeJSONToDB
 */
exports.delete = async id => {
  if (!id) throw new ErrorWithHttpStatus('Missing ID', 400);

  /*
  // read snippets.json
  const snippets = await readJSONFromDB('snippets');

  // delete the intended snippet
  const filteredSnippets = snippets.filter(snippet => snippet.id !== id);

  // check for no id
  if (snippets.length === filteredSnippets.length)
    throw new ErrorWithHttpStatus('ID not found', 400);

  // write back to the file
  return writeJSONToDB('snippets', filteredSnippets);
  */

  try {
    const result = await db.query(`DELETE FROM snippet WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      throw new ErrorWithHttpStatus(`Snippet with ID ${id} not found`, 404);
    }
  } catch (err) {
    if (err instanceof ErrorWithHttpStatus) throw err;

    throw new ErrorWithHttpStatus('Database Error', 500);
  }
};
