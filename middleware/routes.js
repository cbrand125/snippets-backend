const express = require('express');
const Snippet = require('../models/Snippet.model');
const snippets = require('../controllers/Snippet.controller');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.send('Welcome to Snips!');
});

router.get('/api', (request, response, next) => {
  response.send('Welcome to the Snips API!');
});

/* Snippets routes */
router.post('/api/snippets', snippets.createSnippet);
router.get('/api/snippets', snippets.getAllSnippets);
router.get('/api/snippets/:id', snippets.getSnippetById);
router.patch('/api/snippets/:id', snippets.updateSnippet);
router.delete('/api/snippets/:id', snippets.deleteSnippet);

module.exports = router;
