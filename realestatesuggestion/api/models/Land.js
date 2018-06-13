/**
 * Land.js
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

   realEstates: {
       collection :'RealEstate',
       via: 'landType'
     }


    // SearchHistory: {
    //   collection: 'SearchHistory',
    //   via: 'landType'
    // }
  }
};

//   attributes: {
//     landType: {
//       type: 'string',
//       required: true
//     },
//     owner: {
//       model:'RealEstate',
//     }
//   }
// };

