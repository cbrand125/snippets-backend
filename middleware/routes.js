const express = require('express');
const Snippet = require('../models/Snippet.model');
const snippets = require('../controllers/Snippet.controller');
const author = require('../controllers/author.controller');
const validate = require('./validate');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.send('Welcome to Snips!');
});

router.get('/api', (request, response, next) => {
  response.send('Welcome to the Snips API!');
});

/* Snippets routes */
router.post('/api/snippets', validate, snippets.createSnippet);
router.get('/api/snippets', snippets.getAllSnippets);
router.get('/api/snippets/:id', snippets.getSnippetById);
router.patch('/api/snippets/:id', validate, snippets.updateSnippet);
router.delete('/api/snippets/:id', validate, snippets.deleteSnippet);

/* author routes */
router.post('/api/signup', author.signup);
router.post('/api/login', author.login);

module.exports = router;
