/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {


    sendingUser: {
      model: 'User'
    },

    sendingUsername: {
      type: 'string'
    },

    receivingUser: {
      model: 'User'
    },

    receivingUsername: {
      type: 'string'
    },

    body: {
      type: 'text',
      required: true
    }

  }
};

