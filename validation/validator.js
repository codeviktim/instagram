const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const validateSignup = () => {
  return [
    //check username
    body("username")
      .notEmpty()
      .withMessage("username field is required")
      .isLength({ min: 2, max: 30 })
      .withMessage("field must be between 2-30 characters long"),
    //check email
    body("email")
      .notEmpty()
      .withMessage("email field is required")
      .isEmail()
      .withMessage("field must contain @")
      .custom(async (val) => {
        let check = await User.findOne({ email: val });
        if (check) {
          body("email").withMessage("this user exits already");
        }
      }),
    //check password
    body("password")
      .notEmpty()
      .withMessage("password field is required")
      .isLength({ min: 6, max: 30 })
      .withMessage("password must be between 6-30 characters long")
      .isAlphanumeric()
      .withMessage("password must contain alphabets and numbers"),
    //check password2
    body("password2")
      .notEmpty()
      .withMessage("confirm password field is required")
      .custom(async (val) => {
        if (val) {
          await body("password")
            .equals(val)
            .withMessage("passwords does not match");
        }
      }),
  ];
};

const validateLogin = () => {
  return [
    //email
    body("email")
      .notEmpty()
      .withMessage("email field is required")
      .isEmail()
      .withMessage("must be an email"),
    //password
    body("password").notEmpty().withMessage("password field is required"),
  ];
};

const validateRules = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validateLogin,
  validateSignup,
  validateRules,
};
