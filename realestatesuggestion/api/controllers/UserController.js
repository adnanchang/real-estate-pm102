/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

function checkSession(req, res, pageToLoadNormal, pageToLoadSupport) {
  if (req.session.user) {
    console.log("checkSession HAS RAN " + pageToLoadNormal + ' ' + pageToLoadSupport);
    User.findOne(req.session.user.id, function (err, user) {
      if (err) {
        res.view('real/home.ejs', {error: 'Error logging in'});
      } else {
        if (user) {
          if (user.userType == 'normal'){
            res.view(pageToLoadNormal, {user: user, error: false});
          }
          else if (user.userType == 'admin'){
            res.view(pageToLoadSupport, {user: user, error: false});
          }

        } else {
          res.view('real/home.ejs', {user: false, error: 'Error finding user'});
        }
      }
    });
  } else {
    res.view('real/home.ejs', {user: false, error: false});
  }
}



module.exports = {
  main: function (req, res) {
    checkSession(req, res, 'real/home.ejs', 'real/supportHome.ejs');
  },


  login: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    console.log("Iamhere");

    User.findOneByUsername(username, function (err, user) {
      if (err) res.view('real/home.ejs', { user: false, error: 'Error finding user.' });

      if (user){
        bcrypt.compare(password, user.password, function (err, match) {
          if (match){
            req.session.user = user;
            User.update(
              {id: user.id},
              {
                loggedIn: 1,
              }).exec(function (err, foundUser) {
              if (err)
                return next(err);
              console.log(foundUser[0].username + " is now online");
            });


            if (user.userType == 'normal'){
              res.view('real/home.ejs', {
                user:user
              });
            }
            else if (user.userType == "admin"){
              res.view('real/supportHome.ejs', {
                user:user
              });
              // res.redirect('/getSupportData');
            }
          }
          else{
            console.log("Iamhere_now_matchNOT");
            res.view('real/home.ejs', { error: 'Invalid password', user: false });
          }
        });
      }
      else {
        res.view('real/home.ejs', {error: 'User not found', user: false});
      }
    });
  },

  logout: function (req, res) {
    User.update(
      {id: req.session.user.id},
      {
        loggedIn: 0
      }).exec(function (err, user) {
      if (err)
        return next(err);

      //console.log(req.session.user.username + " is now offline");
      req.session.user = null;
      res.view('real/home.ejs', {
        user: false,
        error: false
      });
    });
  },

  announce: function (req, res) {
    // Get the socket ID from the reauest
    var socketId = sails.sockets.getId(req);

    // Get the session from the request
    //var session = req.session;

    // Create the session.users hash if it doesn't exist already
    req.session.theUsers = req.session.theUsers || {};

    User.update(
      {id: req.session.user.id},
      {
        socketId: socketId
      }).exec(function (err, user) {
      req.session.theUsers[socketId] = user[0];
      // Subscribe the connected socket to custom messages regarding the user.
      // While any socket subscribed to the user will receive messages about the
      // user changing their name or being destroyed, ONLY this particular socket
      // will receive "message" events.  This allows us to send private messages
      // between users.
      User.subscribe(req, user[0], 'message');
      // Get updates about users being created
      User.watch(req);

      User.publishUpdate(req.session.user.id, {
        socketId: socketId
      }, req);

      res.json(user);

    });
  },

  changeData: function (req, res) {
    checkSession(req, res, 'real/changeData.ejs', 'real/changeData.ejs');
  },

  updateUser: function (req, res, next) {
    console.log("I AM TRIGGERED");
    if (req.session.user) {
      User.update(
        {id: req.session.user.id},
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }).exec(function (err, user) {
        if (err)
          return next(err);

        checkSession(req, res, 'real/home.ejs', 'real/supportHome.ejs');
      });
    }
    else{
      this.main();
    }
  },

  updatePassword: function (req, res, next) {
    console.log("I AM TRIGGERED");

    if (req.session.user) {
      User.update(
        {id: req.session.user.id},
        {
          password: req.body.password
        }).exec(function (err, user) {
        if (err)
          return next(err);

        checkSession(req, res, 'real/home.ejs', 'real/supportHome.ejs');
      });
    }
    else {
      this.main();
    }
  },

  getOnlineUser: function (req, res) {
    if (req.session.user) {
      res.json(req.session.user);
    }
    else{
      res.json([]);
    }
  },

  update: function (req, res, next) {
    console.log("I AM TRIGGERED");
      User.update(
        {id: req.param('id')},
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }).exec(function (err, user) {
        if (err)
          return next(err);

        // res.redirect('/getSupportData');
        checkSession(req, res, 'real/home.ejs', 'real/supportHome.ejs');
      });
  },

  getOnlineSupport: function (req, res, next) {
    User.find({
      id : { '!' : req.session.user.id },
      loggedIn : true,
      userType: 'admin'
    }).exec(function (err, user) {
      if (err)
        return next(err);

      res.json(user);
    });
  },

  sendEmail: function (req, res, next) {
    var email = req.body.email;
    var time = new Date();
    User.find({
      email: email
    }).exec(function (err, user) {
      if (err){
        // do something here
      }

      if (user){
        sails.hooks.email.send(
          "testEmail",
          {
            recipientName: user[0].lastName,
            senderName: "Real Estate Team",
            id: user[0].id,
            password: user[0].password,
            time: time
          },
          {
            to: user[0].email,
            subject: "Hi There"
          },
          function (err) {
            console.log(err || "It worked!");
          }
        ) // <= Here we using
        res.view('real/home.ejs', {user: false, error: false});
      }
    });
  },

  changePassword: function (req, res, next) {
    var id = req.param('idem');
    var password = req.param('tessera');
    var timeInString = req.param('tempus');
    var time = new Date(timeInString);

    time.setHours(time.getHours() - 1);

    var thirtyMinutes = 30 * 60000;
    var now = new Date();
    var thirtyMinutesAgo = new Date(now - thirtyMinutes);

    if (time > thirtyMinutesAgo){
      User.find({
        id : id
      }).exec(function (err, user) {
        if (err)
          res.view('real/home.ejs', {user: false, error: false});

        if (user){
          if (password.localeCompare(user[0].password.toString()) == 0)
            res.view('real/changePassword.ejs', {thisUser: user, error: false});
          else
            res.view('real/home.ejs', {user: false, error: false});
        }
      });
    }
    else{
      res.view('real/home.ejs', {user: false, error: false});
    }
  },

  changePasswordNow: function (req, res, next) {
    var id = req.param('idem');

    User.update(
      {id: id},
      {
        password: req.body.password
      }).exec(function (err, user) {
      if (err)
        res.view('real/home.ejs', {user: false, error: false});

      res.view('real/home.ejs', {user: false, error: false});
    });
  },

  registerSupport: function (req, res) {
    checkSession(req, res, 'real/home.ejs', 'real/register-support');
  },

  mapView: function (req, res) {
    if (req.session.user){
      res.view('real/mapView', {user: req.session.user, error: false});
    }
    else{
      res.view('real/mapView', {user: false, error: false});
    }
  }
};

