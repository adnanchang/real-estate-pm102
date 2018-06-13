/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');
var uniqueUsername = true;
var uniqueEmail = true;

module.exports = {

  autosubscribe: ['destroy', 'update'],

  types: {
    uniqueUsername: function () {
      return uniqueUsername;
    },

    uniqueEmail: function () {
      return uniqueEmail;
    }
  },

  attributes: {
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      uniqueEmail: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true,
      uniqueUsername: true
    },
    password: {
      type: 'string',
      required: true
    },
    loggedIn: {
      type: 'boolean'
    },

    userType: {
      type: 'string',
      required: 'true'
    },

    collectHistories: {
      collection: 'CollectHistory',
      via: 'user'
    },

    sentMessages: {
      collection: 'Message',
      via: 'sendingUser'
    },

    receivedMessages: {
      collection: 'Message',
      via: 'receivingUser'
    },

    SearchHistory: {
      collection: 'SearchHistory',
      via: 'user'
    }
  },

  beforeValidate: function(values, cb) {

    User.findOne({username: values.username}).exec(function (err, record) {
      console.log("The error is: " + err);
      console.log("The record is: " + record);
      if (record)
        uniqueUsername = false;
      else
        uniqueUsername = true;
      console.log("Username " + uniqueUsername);
      //cb();

      User.findOne({email: values.email}).exec(function (err, record) {
        console.log("The error is: " + err);
        console.log("The record is: " + record);
        if (record)
          uniqueEmail = false;
        else
          uniqueEmail = true;
        console.log("Email: " + uniqueEmail);
      });

      if (!uniqueEmail) {
        cb({
          status: 408,
          message: "Email is not unique"
        });
      }
      else if (!uniqueUsername) {
        cb({
          status: 409,
          message: "Username is not unique"
        });
      }
      else {
        cb();
      }

    });

  },

  beforeCreate: function (values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  },

  beforeUpdate: function (values, cb) {

    if (values.password){
      bcrypt.hash(values.password, 10, function(err, hash) {
        if(err) return cb(err);
        values.password = hash;
        //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
        cb();
      });
    }
    else{
      cb(); //Do Nothing just return.
    }
  }
};
