const express = require('express');
const cors = require('cors');
const router = require('./middleware/routes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorhandler');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT || port, () =>
  console.log(`Snippets listening on port ${port}!`)
);
