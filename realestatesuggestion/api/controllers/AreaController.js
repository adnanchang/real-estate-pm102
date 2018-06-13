/**
 * AreaController
 *
 * @description :: Server-side logic for managing Areas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

//   GetAreaList: function (req, res) {
//   var areaS = req.param('locatedArea');
//   Area.find({locatedArea: areaS}).exec(function (err, data) {
//     if (err) return next(err);
//     res.json(data);
//   });
// }

  GetLocatedAreafromRE: function (req, res, next) {

    Area.find({locatedArea: req.param('locatedArea')}).populate("realEstates").exec(function (err, data) {
      if (err)
        return next(err);

      res.json(data);
    });
  },

  GetLocatedAreafromSE: function (req, res, next) {
    Area.find({locatedArea: req.param('locatedArea')}).populate("SearchHistory").exec(function (err, data) {
      if (err) {
        return next(err);

        res.json(data);
      }
      else if (data == undefined) {
        Area.create({

          locatedArea: data
        })
      }
      else {
        return (data);
      }

    });
  },


  FindURL: function(req, res) {
    var inputurl = req.param('URL');
    RealEstate.find({URL: inputurl}).exec(function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  },

};

