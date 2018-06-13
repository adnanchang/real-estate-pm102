/**
 * Created by mhh on 10/31/2016.
 */

var refiner = require('../services/InformationRefiner');

var Bing = require('node-bing-api')({
  accKey: "T7ngXkcPiB17235pJQz3gVOWthW/d+TN750b+2/1LmE"
});

var http = require('http');
var htmlparser = require('htmlparser2');
var cheerio = require('cheerio');
//var re = require('../models/RealEstate.js');

var siteName = "http://www.wohnungsboerse.net";




function InformationCollector() {

};

InformationCollector.prototype.collect = function (location) {
  console.log("someone idiot called information collector " + location);

  var query = "FLÄCHE " + location + " site:" + siteName;
  Bing.web(query, {
    top: 50
  }, function (error, res, body) {

    try {
      var results = body.d.results;
      console.log("Searching in " + siteName);
      console.log("Query used " + query);
      console.log("Results found: " + results.length);

      if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          var url = "http://" + body.d.results[i].DisplayUrl;
          console.log("URL: " + url);
          http.get(url, function (response) {
            //parseResponse(response);
            var informationRefiner= new InformationRefiner;
            informationRefiner.refineInformation(response);
            //informationRefiner.refineInformation(response);
          }).on("error", function (error) {
            console.log("Error: Unable to get " + url, "#ff0000");
            console.log(error, "#ff0000");
            //callback(null);
          });
        }
      }

    }
    catch (err) {
      console.log("Error in calling Bing web service: \n" + err);
    }

  });
  return "";
};


module.exports = InformationCollector;
