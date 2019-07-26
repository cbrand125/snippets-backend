const fs = require('fs').promises;
const path = require('path');

/**
 * accepts a file name to read an existing file from the DB
 *
 * @param {string} file name of the file (no type needed, ex.: '.json' can be omitted)
 *
 * @returns {JSON} JSON object containing the file data
 */
exports.readJSONFromDB = async file => {
  const dbpath = path.join(__dirname, '..', 'db', `${file}.json`);
  return JSON.parse(await fs.readFile(dbpath));
};

/**
 * accepts a file name and data to write a new file to the DB
 *
 * @param {string} file name of the file (no type needed, ex.: '.json' can be omitted)
 * @param {JSON} data JSON object to write to file to DB
 *
 * @returns {Promise<void>} the promise result from writeFile
 */
exports.writeJSONToDB = (file, data) => {
  const dbpath = path.join(__dirname, '..', 'db', `${file}.json`);
  return fs.writeFile(dbpath, JSON.stringify(data));
};
