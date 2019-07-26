const Snippet = require('../models/Snippet.model');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

exports.createSnippet = async (request, response, next) => {
  try {
    const snippet = await Snippet.insert(request.body);
    return response.status(201).send(snippet);
  } catch (err) {
    next(err);
  }
};

exports.getAllSnippets = async ({ query }, response, next) => {
  try {
    const snippets = await Snippet.select(query);
    return response.send(snippets);
  } catch (err) {
    next(err);
  }
};

exports.getSnippetById = async ({ params: { id } }, response, next) => {
  try {
    const snippet = await Snippet.select({ id });
    if (snippet.length === 0) {
      throw new ErrorWithHttpStatus('ID does not exist', 404);
    }
    return response.send(snippet[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateSnippet = async (request, response, next) => {
  try {
    const snippetWithID = { ...request.body, ...request.params };
    const snippet = await Snippet.update(snippetWithID);
    return response.status(201).send(snippet);
  } catch (err) {
    next(err);
  }
};

exports.deleteSnippet = async ({ params: { id } }, response, next) => {
  try {
    await Snippet.delete(id);
    return response.status(201).send('Delete Successful');
  } catch (err) {
    next(err);
  }
};
