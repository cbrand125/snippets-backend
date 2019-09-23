const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const author = require('../models/author.model');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

require('dotenv').config();

exports.signup = async (request, response, next) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 2);
    const result = await author.insert({
      name: request.body.name,
      password: hashedPassword
    });
    return response.status(201).send(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (request, response, next) => {
  try {
    const authorData = await author.select(request.body.name);
    if (!authorData) {
      throw new ErrorWithHttpStatus('User does not exist', 404);
    }
    const isMatch = await bcrypt.compare(
      request.body.password,
      authorData.password
    );
    if (!isMatch) {
      throw new ErrorWithHttpStatus('Incorrect Password', 401);
    }
    const token = jwt.sign(authorData.name, process.env.JWT_SECRET);
    response.send({ message: 'Logged In', token });
  } catch (err) {
    next(err);
  }
};
