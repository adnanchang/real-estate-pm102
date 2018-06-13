/**
 * Area.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

//   attributes: {
//     locatedArea: {
//       type: 'string',
//       required: true
//     },
//     owner: {
//       model:'RealEstate',
//     }
//   }
// };

  attributes: {
    locatedArea: {
      type: 'string',
      required: true
    },

      realEstates: {
        collection:'RealEstate',
        via: 'locatedArea'
        }

    // SearchHistory: {
    //   collection: 'SearchHistory',
    //   via: 'locatedArea'
    // }
  }
}
