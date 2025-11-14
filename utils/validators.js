import { body, validationResult } from "express-validator";

const emailLoginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isString()
    .normalizeEmail()
    .isEmail()
    .toLowerCase()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long with atleast one capital one small alphabet, atleast one special character and one number"
    ),
];

const emailRegisterValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isString()
    .normalizeEmail()
    .isEmail()
    .toLowerCase()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long with atleast one capital one small alphabet, atleast one special character and one number"
    ),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const phoneLoginValidator = [
  body("phoneNo")
    .trim()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number"),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long with atleast one capital one small alphabet, atleast one special character and one number"
    ),
];

const phoneRegisterValidator = [
  body("phoneNo")
    .trim()
    .notEmpty()
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number"),

  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long with atleast one capital one small alphabet, atleast one special character and one number"
    ),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const changePasswordValidator = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long with atleast one capital one small alphabet, atleast one special character and one number"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters long with atleast one capital one small alphabet, atleast one special character and one number"
    ),
  body("confirmNewPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const setProfileDetailsValidator = [
  body("name").optional().trim().isString().withMessage("Name must be a string"),
  body("bio").trim().optional().isString().withMessage("Bio must be a string"),
  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string")
];

const returnErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const valueRemovedErrors = errors.array().map(({ value, ...rest }) => rest);
    return res
      .status(400)
      .json({ message: "failed", errors: valueRemovedErrors });
  }
  else{
    next();
  }
};

export {
  emailLoginValidator,
  emailRegisterValidator,
  phoneLoginValidator,
  phoneRegisterValidator,
  changePasswordValidator,
  setProfileDetailsValidator,
  returnErrors,
};
