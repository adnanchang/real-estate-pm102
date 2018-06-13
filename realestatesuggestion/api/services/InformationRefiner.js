/**
 * Created by mhh on 11/1/2016.
 */

var http = require('http');
var htmlparser = require('htmlparser2');
var cheerio = require('cheerio');

var siteName = "http://www.wohnungsboerse.net";

function InformationRefiner(){

}

InformationRefiner.prototype.refineInformation=function (response) {
  var data = "";
  response.on('data', function (chunk) {
    data += chunk;
  });

  response.on('end', function (chunk) {

    var rawHtml = data;

    var ch = cheerio.load(rawHtml);

    var aTags = new Array();
    ch('.estatelist-thumbnail').find('a').each(function (index, element, body) {
      var b = ch(this).attr('href');
      aTags.push(siteName + b);
      // console.log(siteName + b);
    });

    for (var ii = 0; ii < aTags.length; ii++) {
      parsePage(aTags[ii]);
      //console.log(aTags[ii]);
    }

    var nextPage = new Array();
    //find the URL of the next page
    ch('.paging').find('a').each(function (index, element, body) {
      var b = ch(this).attr('href');
      nextPage.push(siteName + b);
      // console.log(siteName + b);
    });

    //If next page is founded, open it and go to the page
    if (nextPage.length > 0) {
      console.log(" :D:D Going to next new page: " + nextPage[0])
      http.get(nextPage[0], function (newResponse) {

        var newRefiner=new InformationRefiner;
        newRefiner.refineInformation(newResponse);
      }).on("error", function (error) {
        try {
          console.log("Error: Unable to get " + nextPage[0], "#ff0000");
          console.log(error, "#ff0000");
        }
        catch (error) {
          console.log(":D :D :D :D Error in Error: " + error);
        }

      });
    }

  });
}


//var parseResponse =

var parsePage = function (pageURL) {
  try {
    console.log("Parsing page " + pageURL);
    http.get(pageURL, function (response) {
      //Parsing the page to get required information
      var data = "";
      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end', function (chunk) {
        try{
          var rawHtml = data;

          var ch = cheerio.load(rawHtml);

          var price = ch('.kaltmiete-value').text();
          var size = ch('.flaeche-value').text();
          var location = ch('.home-box-heading-gray').text();

          price = price.replace(/^\s+/, '')
          size = size.replace(/^\s+/, '');

          const regex = /(\d+)/g;
          var m = regex.exec(size);
          size = m[0];

          var re = /(\d+(:\.\d{1,2})?)/m;
          price = (price.match(re))[0];

          console.log("\nPrice: " + price + "\nSize: " + size + "\nLocation: " + location + "\nURL: " + pageURL);

          //Check if the real estate with this url is already inserted
          sails.controllers.realestate.FindURL(pageURL, function (err, data) {
            if (err) {
              console.log(err);
            }
            else {
              if (data == undefined) {//Real estate not found, we add it

                //Adding the real estate to the database
                RealEstate.create({
                  size: size,
                  price: price,
                  URL: pageURL,
                  area:location,
                }).exec(function (err, finn) {
                  if (err) {
                    console.log("Error in writing to database: " + err);
                  }
                  else{
                    console.log("New Real estate added.");
                  }
                });
              }
              else {
                console.log("Real estate already found with: " + data.URL);
              }

            }
          });
        }
        catch (exception){
          console.log("Exception happened for the page: "+exception.toString());
        }
      });

    }).on("error", function (error) {
      try {
        console.log("Error: Unable to get " + pageURL + "\nError details " + error, "#ff0000");
      }
      catch (er) {
        console.log("Error in error :D " + er);
      }

      //callback(null);
    });
  }
  catch (error) {
    console.log("Error in parsing page: " + error);
  }

}


module.exports = InformationRefiner;
