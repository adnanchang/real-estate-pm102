/**
 * RealEstateController
 *
 * @description :: Server-side logic for managing realestates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tools = require('../services/InformationCollector');

module.exports = {

  suggestPrice: function (req, res) {
    var area = 'kiel';
    var size1 = 20;
    var size2 = 40;
    RealEstate.find({area: {contains: area}, size: {'>=': size1, '<=': size2}}).exec(function (err, data) {
      if (err) {
        return next(err);
      }
      res.json(data);
    });
  },

  suggestPriceInner: function (size, area, callback) {
    var sizeD = size - 10;
    var sizeU = 0;
    sizeU = parseInt(size) + 10;
    console.log("size down: " + sizeD + " size up: " + sizeU);
    RealEstate.find({area: {contains: area}, size: {'>=': sizeD, '<=': sizeU}}, callback);
  },

  searchRE: function (req, res) {
    if (req.query.areaName == null) {
      console.log('Search with invalid param.');
    }
    else {
      try {
        var areaToSearch = req.param('areaName');
        console.log("New search Request " + areaToSearch);
        //tools.collect(areaToSearch);
        var myc = new InformationCollector;
        myc.collect(areaToSearch);

        var currentUser = req.session.user;
        CollectHistory.create({user: currentUser}).exec(function (err, r) {
          if (err) {
            console.log("Error in writing Collecting information to database: " + err);
          }
          else {
            console.log("Collecting information logged.");
          }
        });
      }
      catch (err) {
        console.log("Error in collecting information" + err);
      }
    }

    res.view('real/home.ejs', {
      user: false,
      error: false
    });


  },
  GetSizeList: function (req, res) {
    var sizeS = req.param('size');
    RealEstate.find({size: sizeS}).exec(function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  },

  FindURL: function (inputurl, callback) {
    RealEstate.findOne({URL: inputurl}, callback);
  },

  GetrealEstatefromSE: function (req, res) {

    Land.find({landType: req.param('realEstate')}).populate("SearchHistory").exec(function (err, data) {
      if (err)
        return next(err);

      res.json(data);
    });
  },

  GetrealEstateNumber: function (req, res) {
    RealEstate.count(function (err, num) {
      if (err) {
        return next(err);
      }
      res.json(num);
    })
  }

};

