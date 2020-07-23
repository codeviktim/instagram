const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const {
  validateSignup,
  validateRules,
  validateLogin,
} = require("../../validation/validator.js");

const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "users route works" });
});

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/signup", validateSignup(), validateRules, (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then((user) => res.json("signup successful"))
        .catch((err) => console.log(err));
    });
  });
});

router.post("/signin", validateLogin(), validateRules, (req, res) => {
  const { extractedErrors } = validateRules;
  const email = req.body.email;
  const password = req.body.password;

  //find user with email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        extractedErrors.email = "sorry, user not found";
        return res.status(404).json(extractedErrors);
      }
      //check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          res.json({ message: "login successful" });

          //Sign Token
          const payload = { _id: user._id, name: user.name };
          jwt.sign(
            payload,
            keys.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          extractedErrors.password = "credentials incorrect";
          return res.status(400).json(extractedErrors);
        }
      });
    })
    .catch((err) => {
      return res.json(err);
    });
});

module.exports = router;
