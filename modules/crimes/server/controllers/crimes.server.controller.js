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
exports.list = function(req, res) {
  var request = req.query;
  request.latitude = {
    $ne: 0
  };
  request.longitude = {
    $ne: 0
  };

  Crime.find(req.query).limit(5000).exec(function(err, crimes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(crimes);

    }
  });
};


exports.crimeTypes = function(req, res) {
  Crime.distinct('crm_cd_desc').exec(function(err, crimeTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crimeTypes);
    }
  });
};
