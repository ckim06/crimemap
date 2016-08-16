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
  query.push({
    $group: {
      _id: {
        coords: '$coords'
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


  Crime.aggregate(query).limit(500).exec(function(err, locations) {
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
          latitude: location._id.coords.latitude,
          longitude: location._id.coords.longitude,
          location: location.location,
          crimes: []
        };
        id = id + 1;

        location.dr_nos.forEach(function(dr_no, index) {
          var crime = {
            dr_no: dr_no,
            location: location.locations[index],
            crm_cd_desc: location.crm_cd_descs[index]
          };
          marker.crimes.push(crime);
        });
        crimes.push(marker);
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
