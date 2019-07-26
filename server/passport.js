require("dotenv").config();
const bCrypt = require("bcrypt");
module.exports = function(passport, userinfo) {
  const Userinfo = userinfo;
  const LocalStrategy = require("passport-local").Strategy;

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        phoneNumber: "phoneNumber",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        const generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        Userinfo.findOne({
          where: {
            username: username
          }
        }).then(function(user) {
          if (user) {
            console.log("didn't work");
            return done(null, false, {
              message: "That username is already taken"
            });
          } else {
            const userPassword = generateHash(password);
            const data = {
              username: username,
              password: userPassword,
              phoneNumber: req.body.phoneNumber,
              userType: req.body.userType
            };
            Userinfo.create(data).then(function(user) {
              if (!user) {
                return done(null, false);
              } else {
                user.get();
                return done(null, user);
              }
            });
          }
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    console.log("serialize" + user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Userinfo.findOne({
      where: {
        id: id
      }
    }).then(function(user) {
      console.log("deserialize" + user.id);
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, username, password, done) {
        const Userinfo = userinfo;
        const isValidPassword = function(accountKey, password) {
          return bCrypt.compareSync(password, accountKey);
        };
        Userinfo.findOne({
          where: {
            username: username
          }
        })
          .then(function(user) {
            if (!user) {
              return done(null, false, {
                message: "Username does not exist"
              });
            }
            if (!isValidPassword(user.password, password)) {
              return done(null, false, {
                message: "Incorrect password."
              });
            } else {
              user.get();
              console.log("PASSPORT>>>>>>>", user.id);
              return done(null, user);
            }
          })
          .catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
              message: "Something went wrong with your Signin"
            });
          });
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    Userinfo.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
