/**
 * LandController
 *
 * @description :: Server-side logic for managing Lands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

//   GetLandList: function (req, res) {
//     var landS = req.param('landType');
//     Land.find({landType: landS}).exec(function (err, data) {
//       if (err) return next(err);
//       res.json(data);
//     });
//   }
//


  GetLandTypefromRE: function (req, res) {

    Land.find({landType: req.param('landType')}).populate("realEstates").exec(function (err, data) {
      if (err)
        return next(err);

      res.json(data);
    });
  },


  GetLandTypefromSE: function (req, res) {

    Land.find({landType: req.param('landType')}).populate("SearchHistory").exec(function (err, data) {
      if (err)
        return next(err);

      res.json(data);
    });
  }

};
