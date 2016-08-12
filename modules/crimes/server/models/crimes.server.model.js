'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var CrimeSchema = new Schema({

  date_rptd: {
    type: Date,
    default: Date.now
  },
  dr_no: {
    type: String,
    default: '',
    trim: true
  },
  date_occ: {
    type: Date,
    default: Date.now
  },
  time_occ: {
    type: String,
    default: '',
    trim: true
  },
  area: {
    type: String,
    default: '',
    trim: true
  },
  area_name: {
    type: String,
    default: '',
    trim: true
  },
  rd: {
    type: String,
    default: '',
    trim: true
  },
  crm_cd: {
    type: String,
    default: '',
    trim: true
  },
  crm_cd_desc: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    default: '',
    trim: true
  },
  status_desc: {
    type: String,
    default: '',
    trim: true
  },
  location: {
    type: String,
    default: '',
    trim: true
  },
  latitude: Number,
  longitude: Number
});

mongoose.model('Crime', CrimeSchema);
/*
{
    "_id" : ObjectId("57a683886f96c8baad7042df"),
    "uid" : "A36D0BD2-357B-4E06-AF1F-8E7629E84401",
    "date_rptd" : "2015-12-02T00:00:00",
    "dr_no" : "150126705",
    "date_occ" : "2015-12-02T00:00:00",
    "time_occ" : "0150",
    "area" : "01",
    "area_name" : "Central",
    "rd" : "0145",
    "crm_cd" : "946",
    "crm_cd_desc" : "OTHER MISCELLANEOUS CRIME",
    "status" : "IC",
    "status_desc" : "Invest Cont",
    "location" : "  400 S  LOS ANGELES                  ST",
    "coord" : {
        "latitude" : "34.0473",
        "longitude" : "-118.2462"
    }
}

*/
