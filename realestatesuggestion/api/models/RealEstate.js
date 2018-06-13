/**
 * RealEstate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    landType: {
      model: 'Land'
    },
    // latitude: {
    //   type: 'float',
    //   required: true
    // },
    // longitude: {
    //   type: 'float',
    //   required: true
    // },
    size: {
      type: 'float',
      required: true
    },

    locatedArea: {
     model: 'Area'
    },
    price: {
      type: 'integer',
      required: true
    },
    URL: {
      type: 'string'
      // required: true
    },

    SearchHistory: {
      collection : 'SearchHistory',
      via: 'realEstate'
    }
  }
};

