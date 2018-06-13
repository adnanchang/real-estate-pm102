/**
 * SearchHistoryController
 *
 * @description :: Server-side logic for managing Searchhistories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tools = require('../services/SuggestionAlgorithm');

module.exports = {
  Suggest:function (req,res) {
    if (req.param('location') == undefined|| req.param('size') == undefined) {
      console.log('Price suggestion request with invalid param.');
    }
    else{
      //start to suggest price
      var location=req.param('location');
      var size=req.param('size');
      var alg = new SuggestionAlgorithm;
      alg.algorithm(location,size,res);

    }
  }
};

