'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crime = mongoose.model('Crime'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * List of Articles
 */
exports.list = function (req, res) {
  Crime.find().exec(function (err, crimes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crimes);
    }
  });
};
