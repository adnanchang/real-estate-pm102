/**
 * CollectHistoryController
 *
 * @description :: Server-side logic for managing Collecthistories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  GetLatestCollectHistory: function (req, res) {
    CollectHistory.find().sort({"createdAt":-1}).exec(function (err, data) {
      if (err) return res.json(err);
      else if(data==undefined){return res.json("nothing")}
      return res.json(data);
    });
  },


};

