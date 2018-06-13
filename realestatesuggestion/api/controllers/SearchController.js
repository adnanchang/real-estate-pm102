/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  SearchResult: function (req, res, next) {
    SearchHistory.find(req.params[0]).limit(1).exec(function showSearchResult(err, searchResult) {

      if (err)
        return next(err);
      if (!searchResult)
        return next();
      if(searchResult.length==0)
        return next();
      //console.log("we are in search result " + req.param('id'));
      //res.json(searchResult);
      //res.view({SearcgResult: searchResult});
      console.log(searchResult[0].realEstate);
      var realEstates=JSON.parse(searchResult[0].realEstate);
      // res.view('real/searchresult.ejs', {result: searchResult[0], realEstates: realEstates});
      if (req.session.user){
        res.view('real/searchresult.ejs', {
          result: searchResult[0],
          realEstates: realEstates,
          user: req.session.user
        });
      }
      else {
        res.view('real/searchresult.ejs', {
          result: searchResult[0],
          realEstates: realEstates
        });
      }
    });


  },
  MapView: function (req, res, next) {
    res.view('real/mapView');
    // var ObjectId = require('mongodb').ObjectID;
    // console.log("id: "+req.params[0]);
    // RealEstate.find({id:req.param('id')}).exec(function (err, realEstate) {
    //   if(err){
    //     console.log("Error in getting real estate to show on map: "+err);
    //     res.json();
    //   }
    //   if(realEstate==undefined){
    //     console.log("No real estate found to show on map with id "+req.params[0]);
    //     res.json();
    //   }
    //   res.json(realEstate);
    // });
  }
};

