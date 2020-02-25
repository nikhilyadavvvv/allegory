var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/checkAuth');
const validatePassword = require('../common/passwordValidator');

const User = require('../model/user');

/* GET users listing. */
router.get('/', checkAuth, function (req, res, next) {
  User.findAll().then(users => {
    var allUsers = users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
    return res.json({ users: allUsers });
  })
});

/**
 * Register user
 */
router.post('/signup', (req, res, next) => {
  console.log(req.body)
  console.log("About to add new user (%s)", req.body.email);
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        msg = "user already exists";
        console.log(msg);
        return res.status(409).json({
          message: msg
        })
      }

      //validate password;
      validatePassword.validate(req.body.password).then((pResult) => {
        if(Object.entries(pResult).length > 0 ){
          msg = 'password validation failed';
          console.log('msg -- %s',pResult);
          return res.status(409).json({
            message: msg,
            error : pResult
          })
        }

        //hash password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log("hash error = %s", err);
            return res.status(500).json({
              error: err.toString()
            });
          }
          //create user
          user = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name
          });
          //save
          user.save().then(result => {
            res.json({
              message: "User created successfully!",
              id: user.id,
              name: user.name,
              email: user.email
            })
          }).catch(err => {
            console.log("Error! -- %s", err);
            return res.status(500).json({
              message: "Failed to create user",
              error: err.toString()
            })
          });

        })


      });

    });
});

/**
 * User login
 */
router.post('/login', (req, res, next) => {
  console.log('User login request : %s', req.body.email);
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failure: user not found"
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error: " + err
          })
        }

        if (result) {
          userId = user.id;
          token = jwt.sign({
            userId, userId,
            email: user.email
          },
            'secret',
            {
              expiresIn: "12h"
            }
          );
          return res.json({
            mesage: "Auth Successful",
            user_id: user.id,
            token: token,
            name: user.name
          });
        } else {
          res.status(401).json({
            message: "Auth Failure: Password incorrect"
          })
        }

      });
    });
});

module.exports = router;
