'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crime = mongoose.model('Crime'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * List of Crimes
 */
exports.list = function(req, res) {
  var request = req.query;
  request['coords.latitude'] = {
    $ne: 0
  };
  request['coords.longitude'] = {
    $ne: 0
  };

  var query = req.query;
  if (req.query.box) {
    query.coords = {
      '$geoWithin': {
        '$box': JSON.parse(req.query.box)
      }
    };
    delete req.query.box;
  }

  Crime.find(query).limit(1000).exec(function(err, crimes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      crimes.forEach(function(crime) {
        crime.latitude = crime.coords.latitude;
        crime.longitude = crime.coords.longitude;
      });
      res.json(crimes);
    }
  });
};
exports.crimeTypes = function(req, res) {
  Crime.aggregate([{
    $group: {
      _id: {
        crm_cd: '$crm_cd',
        crm_cd_desc: '$crm_cd_desc'
      }
    }
  }]).exec(function(err, crimeTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crimeTypes);
    }
  });
};

exports.getTop = function(req, res) {
  var request = [{
    $group: {
      _id: '$crm_cd_desc',
      count: {
        $sum: 1
      }
    }
  }, {
    $sort: {
      count: -1
    }
  }];

  if (req.params.box) {
    request.unshift({
      $match: {
        coords: {
          $geoWithin: {
            $box: JSON.parse(req.params.box)
          }
        }
      }
    });
  }
  Crime.aggregate(request).exec(function(err, crimeTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crimeTypes);
    }
  });
};
