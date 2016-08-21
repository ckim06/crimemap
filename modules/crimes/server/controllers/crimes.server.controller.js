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
  var query = [];
  if (req.query.box) {
    var match = {
      '$match': {
        'coords': {
          '$geoWithin': {
            '$box': JSON.parse(req.query.box)
          }
        }
      }
    };
    query.push(match);
  }

  if (req.query.crimeTypeOption) {
    var crimeTypeMatch = {
      '$match': {
        crm_cd: req.query.crimeTypeOption
      }
    };
    query.push(crimeTypeMatch);
  }
  query.push({
    $group: {
      _id: '$coords',
      count: {
        $sum: 1
      },
      dr_nos: {
        $push: '$dr_no'
      },
      locations: {
        $push: '$location'
      },
      crm_cd_descs: {
        $push: '$crm_cd_desc'
      }
    }
  });

  query.push({
    $sort: {
      count: -1
    }
  });

  Crime.aggregate(query).limit(5000).exec(function(err, locations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var crimes = [];
      var id = 0;
      locations.forEach(function(location) {
        var marker = {
          id: id,
          latitude: location._id.latitude,
          longitude: location._id.longitude,
          count: location.count,
          crime_descs: {}
        };
        id = id + 1;

        location.crm_cd_descs.forEach(function(desc, index) {
          if (marker.crime_descs[desc]) {
            marker.crime_descs[desc].count++;
            marker.crime_descs[desc].dr_nos.push(location.dr_nos[index]);
          } else {
            marker.crime_descs[desc] = {
              'count': 1,
              'dr_nos': [location.dr_nos[index]]
            };
          }
        });
        crimes.push(marker);
      });
      res.json(crimes);
    }
  });
};
exports.crimeTypes = function(req, res) {
  var query = [{
    $group: {
      _id: {
        crm_cd: '$crm_cd',
        crm_cd_desc: '$crm_cd_desc'
      }
    }
  }];
  if (req.query.box) {
    var match = {
      '$match': {
        'coords': {
          '$geoWithin': {
            '$box': JSON.parse(req.query.box)
          }
        }
      }
    };
    query.unshift(match);
  }
  Crime.aggregate(query).exec(function(err, crimeTypes) {
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
