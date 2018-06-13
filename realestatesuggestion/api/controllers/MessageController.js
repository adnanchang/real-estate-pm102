/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  private: function(req, res, next) {
    // Get the ID of the currently connected socket
    var socketId = sails.sockets.getId(req.socket);
    // Use that ID to look up the user in the session
    // We need to do this because we can have more than one user
    // per session, since we're creating one user per socket
    //req.session.theUsers[socketId].id
    User.findOne(req.param('sendingUser')).exec(function(err, sender) {
      // Publish a message to that user's "room".  In our app, the only subscriber to that
      // room will be the socket that the user is on (subscription occurs in the onConnect
      // method of config/sockets.js), so only they will get this message.
      User.message(req.param('receivingUser'), {
        from: sender,
        msg: req.param('body')
      });

      Message.create({
        sendingUser: sender,
        sendingUsername: req.param('sendingUsername'),
        receivingUser: req.param('receivingUser'),
        receivingUsername: req.param('receivingUsername'),
        body: req.param('body')
      }).exec(function (err, message) {
        if (err)
          return next;

        res.json(message);
      });
    });
  }

};

