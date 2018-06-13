/**
 * SearchHistory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    landType: {
      type: 'string',
      required: true
    },

    locatedArea: {
      type: 'string',
      required: true
    },

    realEstate: {
      model: 'realEstate'
    },

    suggestedPrice: {
      type: 'integer',
      required: true
    },

    searchDate: {
      type: 'string',
      required: true
    },

    user: {
      model: 'User'
    }


  }
};



