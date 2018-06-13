/**
 * SupportQuestionController
 *
 * @description :: Server-side logic for managing supportquestions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  FindByUser: function (req, res) {
    var username = req.user.userId;


    var results = SupportQuestion.find({'user':'582854ae326ac9c711aeb082' }).exec(function (err, r) {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(r);
      return r;

    });
  },

  FindUnreadSupport: function (req, res) {


    var results = SupportQuestion.find({}).exec(function (err, r) {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(r);
      return r;

    });
  },

  AskOffline: function (req, res) {

    res.view('real/askOffline.ejs', {user: req.session.user, error: false});
  },
  update: function (req, res, next) {
    var now = new Date();
    SupportQuestion.update(
      {id: req.param('id')},
      {
        responseDetail: req.param('res'),
        isRead: true,
        responseDate: now
      }).exec(function (err, supQuestion) {
      if (err)
        return next(err);

      res.view('real/supportHome.ejs', {user: req.session.user, error: false});
    });
  }
};
