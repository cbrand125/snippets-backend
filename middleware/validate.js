const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  const auth = request.headers.authorization;
  if (!auth) return response.end(401);
  const token = auth.split(' ')[1];
  try {
    request.body.author = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    response.sendStatus(401);
  }
};
