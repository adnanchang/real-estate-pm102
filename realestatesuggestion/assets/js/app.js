(function (io) {

  var loginForm = $("#loginForm form"),
    username = loginForm.find("input[name=username]"),
    password = loginForm.find("input[name=password]"),
    signIn = loginForm.find("button[name=signIn_btn]");

  // as soon as this file is loaded, connect automatically,
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }
  var setChatHeight = function () {
    $('#chat').animate({scrollTop: $('#chat')[0].scrollHeight}, 600);
  };

  io.socket.on('connect', function socketConnected() {

    io.socket.get('/getOnlineUser', function (data) {
      if (data.length != 0){
        io.socket.get('/announce', function (newData) {
          console.log(newData);
        });
      }
    });

    // signIn.click(function () {
    //   io.socket.get('/announce', function (newData) {
    //     console.log(newData);
    //   });
    // });

    // Listen for Comet messages from Sails
    io.socket.on('message', function messageReceived(message) {


      log('New comet message received :: ', message);
      setChatHeight();
      //////////////////////////////////////////////////////

    });

    io.socket.on('user', function messageReceived(message) {


      log('New comet user received :: ', message);
      setChatHeight();
      //////////////////////////////////////////////////////

    });


    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
      'Socket is now connected and globally accessible as `socket`.\n' +
      'e.g. to send a GET request to Sails, try \n' +
      '`socket.get("/", function (response) ' +
      '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = io.socket;


  // Simple log function to keep the example simple
  function log() {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }


})(
  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io
);


/**
 * Register Form
 */

(function ($) {
  var registerForm = $("#register form"),
    errorDiv = $("#error"),
    successDiv = $("#success"),
    firstName = registerForm.find("input[name=firstName]"),
    lastName = registerForm.find("input[name=lastName]"),
    username = registerForm.find("input[name=username]"),
    email = registerForm.find("input[name=email]"),
    password = registerForm.find("input[name=password]"),
    passwordConfirm = registerForm.find("input[name=passwordConfirm]"),
    signUp = registerForm.find("button[name=signUp_btn]");

  console.log(registerForm);
  console.log(firstName.val());
  errorDiv.hide();
  successDiv.hide();

  registerForm.submit(function (e) {
    e.preventDefault();

    errorDiv.hide();
    errorDiv.html("");
    successDiv.hide();
    successDiv.html("");

    if (password.val() !== passwordConfirm.val()) {
      errorDiv.html("<p>Passwords must match.</p>");
      errorDiv.slideDown();
      return;
    }
    else if (!$.trim(username.val()).length ||
      !$.trim(password.val()).length ||
      !$.trim(email.val()).length ||
      !$.trim(firstName.val()).length ||
      !$.trim(lastName.val()).length) {
      errorDiv.html("<p>All fields are required</p>");
      errorDiv.slideDown();
      return;
    }
    else {
      signUp.click(function () {
        register(username.val(), password.val(), firstName.val(), lastName.val(), email.val(), 'normal', false, '');
      });
    }
  });

  var register = function (username, password, firstName, lastName, email, userType, loggedIn, socketId) {
    $.ajax({
      type: 'POST',
      url: '/user',
      data: {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        userType: userType,
        loggedIn: loggedIn,
        socketId: socketId
      },
      success: function (data) {
        successDiv.html("<p>Successfully created user \'" + data.username + "\'. You may log in now.</p>");
        successDiv.slideDown();
      },
      error: function (data) {
        var response = jQuery.parseJSON(data.responseText)
        if (response.originalError.status == 409) {
          errorDiv.html("<p>User already exists</p>");
          errorDiv.slideDown();
          console.log(data);
        }
        else if (response.originalError.status == 408) {
          errorDiv.html("<p>Email already exists</p>");
          errorDiv.slideDown();
          console.log(data);
        }
        else {
          errorDiv.html("<p>Error creating user.</p>");
          errorDiv.slideDown();
          console.log(data);
        }
      }
    });
  };
})(jQuery);

/**
 * Register Form - Support
 */

(function ($) {
  var registerForm = $("#createUser form"),
    errorDiv = $("#error"),
    successDiv = $("#success"),
    firstName = registerForm.find("input[name=firstName]"),
    lastName = registerForm.find("input[name=lastName]"),
    username = registerForm.find("input[name=username]"),
    email = registerForm.find("input[name=email]"),
    password = registerForm.find("input[name=password]"),
    passwordConfirm = registerForm.find("input[name=passwordConfirm]"),
    signUp = registerForm.find("button[name=signUp_btn]");

  console.log(registerForm);
  console.log(firstName.val());
  errorDiv.hide();
  successDiv.hide();

  registerForm.submit(function (e) {
    e.preventDefault();

    errorDiv.hide();
    errorDiv.html("");
    successDiv.hide();
    successDiv.html("");

    if (password.val() !== passwordConfirm.val()) {
      errorDiv.html("<p>Passwords must match.</p>");
      errorDiv.slideDown();
      return;
    }
    else if (!$.trim(username.val()).length ||
      !$.trim(password.val()).length ||
      !$.trim(email.val()).length ||
      !$.trim(firstName.val()).length ||
      !$.trim(lastName.val()).length) {
      errorDiv.html("<p>All fields are required</p>");
      errorDiv.slideDown();
      return;
    }
    else {
      signUp.click(function () {
        register(username.val(), password.val(), firstName.val(), lastName.val(), email.val(), 'admin', false, '');
      });
    }
  });

  var register = function (username, password, firstName, lastName, email, userType, loggedIn, socketId) {
    $.ajax({
      type: 'POST',
      url: '/user',
      data: {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        userType: userType,
        loggedIn: loggedIn,
        socketId: socketId
      },
      success: function (data) {
        successDiv.html("<p>Successfully created user \'" + data.username + "\'. He/She may log in now.</p>");
        successDiv.slideDown();
      },
      error: function (data) {
        var response = jQuery.parseJSON(data.responseText)
        if (response.originalError.status == 409) {
          errorDiv.html("<p>User already exists</p>");
          errorDiv.slideDown();
          console.log(data);
        }
        else if (response.originalError.status == 408) {
          errorDiv.html("<p>Email already exists</p>");
          errorDiv.slideDown();
          console.log(data);
        }
        else {
          errorDiv.html("<p>Error creating user.</p>");
          errorDiv.slideDown();
          console.log(data);
        }
      }
    });
  };
})(jQuery);


/**
 * ChangeData
 */

(function ($) {
  var changeData = $("#changeData form"),
    errorDiv = $("#error"),
    successDiv = $("#success"),
    firstName = changeData.find("input[name=firstName]"),
    lastName = changeData.find("input[name=lastName]"),
    saveChange = changeData.find("button[name=saveChange]");

  console.log(changeData);
  console.log(firstName.val());
  errorDiv.hide();
  successDiv.hide();

  changeData.submit(function (e) {
    e.preventDefault();

    errorDiv.hide();
    errorDiv.html("");
    successDiv.hide();
    successDiv.html("");

    if (!$.trim(firstName.val()).length || !$.trim(lastName.val()).length) {
      errorDiv.html("<p>Dear User, your name is your identity, we need it.</p>");
      errorDiv.slideDown();
      return;
    }
    else {
      saveChange.click(function () {
        updateUser(firstName.val(), lastName.val());
      });
    }
  });

  var updateUser = function (firstName, lastName) {
    $.ajax({
      type: 'post',
      url: '/updateUser',
      data: {firstName: firstName, lastName: lastName},
      success: function (data) {
        successDiv.html("<p>Successfully updated your data</p>");
        successDiv.slideDown();
      },
      error: function (data) {
        errorDiv.html("<p>Error creating user.</p>");
        errorDiv.slideDown();
        console.log(data);
      }
    });
  };
})(jQuery);

/**
 * Change Password
 */

(function ($) {
  var changePass = $("#changePass form"),
    errorDiv = $("#error"),
    successDiv = $("#success"),
    password = changePass.find("input[name=password]"),
    passwordConfirm = changePass.find("input[name=passwordConfirm]"),
    savePass = changePass.find("button[name=savePass]");

  errorDiv.hide();
  successDiv.hide();

  changePass.submit(function (e) {
    e.preventDefault();

    errorDiv.hide();
    errorDiv.html("");
    successDiv.hide();
    successDiv.html("");

    if (password.val() !== passwordConfirm.val()) {
      errorDiv.html("<p>Passwords must match.</p>");
      errorDiv.slideDown();
      return;
    }
    else if (!$.trim(password.val()).length || !$.trim(passwordConfirm.val()).length) {
      errorDiv.html("<p>Dear User, an empty password secures nothing, unfortunately.</p>");
      errorDiv.slideDown();
      return;
    }
    else {
      savePass.click(function () {
        updatePass(password.val());
      });
    }
  });

  var updatePass = function (password) {
    $.ajax({
      type: 'PUT',
      url: '/updatePassword',
      data: {password: password},
      success: function (data) {
        successDiv.html("<p>Successfully updated your password</p>");
        successDiv.slideDown();
      },
      error: function (data) {
        errorDiv.html("<p>Error creating user.</p>");
        errorDiv.slideDown();
        console.log(data);
      }
    });
  };
})(jQuery);


/**
 * Change Password - Forgot Password
 */

(function ($) {
  var changePass = $("#forgotPass form"),
    errorDiv = $("#error"),
    successDiv = $("#success"),
    password = changePass.find("input[name=password]"),
    passwordConfirm = changePass.find("input[name=passwordConfirm]"),
    id = changePass.find("input[name=id]"),
    savePass = changePass.find("button[name=forgotPass]");

  errorDiv.hide();
  successDiv.hide();

  changePass.submit(function (e) {
    e.preventDefault();

    errorDiv.hide();
    errorDiv.html("");
    successDiv.hide();
    successDiv.html("");

    if (password.val() !== passwordConfirm.val()) {
      errorDiv.html("<p>Passwords must match.</p>");
      errorDiv.slideDown();
      return;
    }
    else if (!$.trim(password.val()).length || !$.trim(passwordConfirm.val()).length) {
      errorDiv.html("<p>Dear User, an empty password secures nothing, unfortunately.</p>");
      errorDiv.slideDown();
      return;
    }
    else {
      savePass.click(function () {
        updatePass(password.val(), id.val());
      });
    }
  });

  var updatePass = function (password, id) {
    $.ajax({
      type: 'POST',
      url: '/changePasswordNow?idem=' + id,
      data: {password: password},
      success: function (data) {
        successDiv.html("<p>Successfully updated your password</p>");
        successDiv.slideDown();
      },
      error: function (data) {
        errorDiv.html("<p>Error creating user.</p>");
        errorDiv.slideDown();
        console.log(data);
      }
    });
  };
})(jQuery);


/**
 * Chat Room
 */

(function ($) {
  var messageDiv = $('#messages'),
    newMessage = $('#new-message'),
    chatWindow = $('#chat'),
    sendButton = $('#send-message'),
    chatWindow_pre = $('#chat_begin');

  $.getJSON('/getOnlineUser', function (resData_user) {
    if (resData_user.userType == 'normal'){
      $.getJSON('/getOnlineSupport', function (resData_support) {

        if (resData_support.length != 0) {
          chatWindow_pre.html('');
          chatWindow_pre.append(
            '<span style="font-size: small;">A support user ' +
            'can currently receive your messages.' +
            'You may ask any queries you have.</span>');
          newMessage.removeAttr("disabled");
          sendButton.removeAttr("disabled");

          var recipient = resData_support[0]; //Will get only the first online support user
          console.log("You are chatting with ", recipient)
          console.log("You are ", resData_user);

          io.socket.request({
            method: 'get',
            url: '/message'
          }, function (resData, jwres) {
            if (jwres.error) {
              console.log(jwres.statusCode); // => e.g. 403
              return;
            }
            console.log(jwres.statusCode); // => e.g. 200
          });

          io.socket.on('message', function (msg) {
            console.log('got message - userside', msg);
          });

          io.socket.on('user', function (msg) {
            console.log('got something - userside', msg);
            if (msg.data) {
              if (msg.data.msg) {
                renderMessage(msg.data);
              } else {
                console.log(msg);
              }
            } else {
              console.log(msg);
            }
          });

          var setChatHeight = function () {
            $('#chat').animate({scrollTop: $('#chat')[0].scrollHeight}, 600);
          };

          // DON'T NEED THIS AT THE MOMENT
          // var getPastMessages = function () {
          //   io.socket.get('/message', function (messages) {
          //     for (var i = 0, len = messages.length; i < len; i++) {
          //       renderMessage(messages[i]);
          //     }
          //     setChatHeight();
          //   });
          //
          // };
          // getPastMessages();

          var renderMessage = function (msg) {
            var time = moment(msg.createdAt).format('YYYY-MM-DD HH:mm');

            if (msg.sendingUsername === resData_user.username) {
              chatWindow.append(
                '<div id="messages" class="row msg_container base_sent">' +
                '<div class="col-md-10 col-xs-10"> <div class="messages msg_sent">' +
                '<p style="font-weight: bold;">' + msg.sendingUsername + '</p>' +
                '<p>' + msg.body + '</p>' +
                '<time datetime="2009-11-13T20:00">' + time + '</time> ' +
                '</div> </div>'
              );
            }
            else if (msg.username !== resData_user.username) {
              chatWindow.append(
                '<div id="messages" class="row msg_container base_receive">' +
                '<div class="col-md-10 col-xs-10"> <div class="messages msg_receive">' +
                '<p style="font-weight: bold;">' + msg.from.username + '</p>' +
                '<p>' + msg.msg + '</p>' +
                '<time datetime="2009-11-13T20:00">' + time + '</time> ' +
                '</div> </div>'
              );
            }
          };

          var sendMessage = function () {
            console.log("returned user is: ");
            console.log(resData_user.username);

            io.socket.post('/message/private',
              {
                sendingUser: resData_user.id,
                sendingUsername: resData_user.username,
                receivingUser: recipient.id,
                receivingUsername: recipient.username,
                body: newMessage.val()
              },
              function (data) {
                console.log(data);
                renderMessage(data);
                setChatHeight();
              });
            newMessage.val('');

          };

          sendButton.click(sendMessage);
          newMessage.keydown(function (e) {
            if (e.which === 13) sendMessage();
          });
        }
        else {
          console.log("No support is online");
          chatWindow_pre.html('');
          chatWindow_pre.append(
            '<span style="font-size: small;">Unfortunately,' +
            ' no support user is online at the moment.' +
            'Please leave a question and it will be responded to' +
            ' as soon as possible. If you have a question, please  <a href="/askOffline">Click Here</a></span>');
          newMessage.attr('disabled', 'disabled');
          sendButton.attr('disabled', 'disabled');

        }
      });
    }
    else if (resData_user.userType == 'admin'){
      console.log("You are ", resData_user);
      io.socket.request({
        method: 'get',
        url: '/message'
      }, function (resData, jwres) {
        if (jwres.error) {
          console.log(jwres.statusCode); // => e.g. 403
          return;
        }
        console.log(jwres.statusCode); // => e.g. 200
      });

      var recipient = null;

      io.socket.on('message', function (msg) {
        console.log('got message - supportside', msg);
      });

      io.socket.on('user', function (msg) {
        console.log('got user - supportside', msg);
        if (msg.data) {
          if (msg.data.msg) {
            recipient = msg.data;
            console.log("You are chatting with: ", recipient.from);
            renderMessage(msg.data);
          } else {
            console.log(msg);
          }
        } else {
          console.log(msg);
        }
      });


      var setChatHeight = function () {
        $('#chat').animate({scrollTop: $('#chat')[0].scrollHeight}, 600);
      };

      // DON'T NEED THIS AT THE MOMENT
      // var getPastMessages = function () {
      //   io.socket.get('/message', function (messages) {
      //     for (var i = 0, len = messages.length; i < len; i++) {
      //       renderMessage(messages[i]);
      //     }
      //     setChatHeight();
      //   });
      //
      // };
      // getPastMessages();

      var renderMessage = function (msg) {
        var time = moment(msg.createdAt).format('YYYY-MM-DD HH:mm');

        if (msg.sendingUsername === resData_user.username) {
          chatWindow.append(
            '<div id="messages" class="row msg_container base_sent">' +
            '<div class="col-md-10 col-xs-10"> <div class="messages msg_sent">' +
            '<p style="font-weight: bold;">' + msg.sendingUsername + '</p>' +
            '<p>' + msg.body + '</p>' +
            '<time datetime="2009-11-13T20:00">' + time + '</time> ' +
            '</div> </div>'
          );
        }
        else if (msg.username !== resData_user.username) {
          chatWindow.append(
            '<div id="messages" class="row msg_container base_receive">' +
            '<div class="col-md-10 col-xs-10"> <div class="messages msg_receive">' +
            '<p style="font-weight: bold;">' + msg.from.username + '</p>' +
            '<p>' + msg.msg + '</p>' +
            '<time datetime="2009-11-13T20:00">' + time + '</time> ' +
            '</div> </div>'
          );
        }
      };

      var sendMessage = function () {
        console.log("returned user at Support Side is: ");
        console.log(resData_user.username);

        io.socket.post('/message/private',
          {
            sendingUser: resData_user.id,
            sendingUsername: resData_user.username,
            receivingUser: recipient.from.id,
            receivingUsername: recipient.from.username,
            body: newMessage.val()
          },
          function (data) {
            console.log(data);
            renderMessage(data);
            setChatHeight();
          });
        newMessage.val('');

      };

      sendButton.click(sendMessage);
      newMessage.keydown(function (e) {
        if (e.which === 13) sendMessage();
      });
    }
  });
})(jQuery);

/**
 * Ask Support Question - offline
 */

(function ($) {
  var askOffline = $("#askOffline form"),
    errorDiv = $("#error"),
    successDiv = $("#success"),
    qTitle = askOffline.find("input[name=qTitle]"),
    qBody = askOffline.find("input[name=qBody]"),
    userID = askOffline.find("input[name=userID]"),
    submitQuestion = askOffline.find("button[name=submitQuestion]");

  errorDiv.hide();
  successDiv.hide();

  askOffline.submit(function (e) {
    e.preventDefault();

    errorDiv.hide();
    errorDiv.html("");
    successDiv.hide();
    successDiv.html("");

    if (!$.trim(qTitle.val()).length || !$.trim(qBody.val()).length) {
      errorDiv.html("<p>Dear User, an question without content cannot be answered, unfortunately.</p>");
      errorDiv.slideDown();
      return;
    }
    else {
      submitQuestion.click(function () {
        supportQuestion(qTitle.val(), qBody.val(), userID.val(), '');
      });
    }
  });

  var supportQuestion = function (qTitle, qBody, userID, responseDetail) {
    $.ajax({
      type: 'POST',
      url: '/supportquestion',
      data: {questionBody: qBody, questionTitle: qTitle, user: userID, responseDetail: responseDetail},
      success: function (data) {
        successDiv.html("<p>Your support question is sent, it will be answered as soon as possible</p>");
        successDiv.slideDown();
      },
      error: function (data) {
        errorDiv.html("<p>Error creating user.</p>");
        errorDiv.slideDown();
        console.log(data);
      }
    });
  };
})(jQuery);


