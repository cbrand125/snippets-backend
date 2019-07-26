const fs = require('fs').promises;
const path = require('path');
const shortid = require('shortid');
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
  try {
    if (!author || !code || !title || !description || !language) {
      throw new ErrorWithHttpStatus('Missing properties', 400);
    }

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
  } catch (err) {
    throw err;
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
    const snippets = await readJSONFromDB('snippets');
    const filtered = snippets.filter(snippet =>
      Object.keys(query).every(key => query[key] === snippet[key])
    );
    return filtered;
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
  try {
    if (!snippetData.id) throw ErrorWithHttpStatus('Missing ID', 400);

    // read snippets.json
    const snippets = await readJSONFromDB('snippets');

    // update the intended snippet
    const foundSnippet = snippets.find(
      snippet => snippet.id === snippetData.id
    );
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
  } catch (err) {
    throw err;
  }
};

/**
 * Deletes an existing snippet from the db.
 * @param {string} id - the id of the snippet to delete
 * @returns {Promise<void>} the promise result from writeJSONToDB
 */
exports.delete = async id => {
  try {
    if (!id) throw new ErrorWithHttpStatus('Missing ID', 400);

    // read snippets.json
    const snippets = await readJSONFromDB('snippets');

    // delete the intended snippet
    const filteredSnippets = snippets.filter(snippet => snippet.id !== id);

    // check for no id
    if (snippets.length === filteredSnippets.length)
      throw new ErrorWithHttpStatus('ID not found', 400);

    // write back to the file
    return writeJSONToDB('snippets', filteredSnippets);
  } catch (err) {
    throw err;
  }
};
