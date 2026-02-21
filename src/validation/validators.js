const { checkSchema, validationResult } = require("express-validator");

const runValidation = async (data, schema) => {
  const req = { body: data };
  const validations = checkSchema(schema);
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    const error = new Error(message);
    error.details = errors.array();
    throw error;
  }
};

const signupSchema = {
  username: {
    notEmpty: { errorMessage: "username is required" },
    isLength: { options: { min: 3 }, errorMessage: "username min 3 chars" }
  },
  email: {
    notEmpty: { errorMessage: "email is required" },
    isEmail: { errorMessage: "email is invalid" }
  },
  password: {
    notEmpty: { errorMessage: "password is required" },
    isLength: { options: { min: 6 }, errorMessage: "password min 6 chars" }
  }
};

const loginSchema = {
  login: {
    notEmpty: { errorMessage: "username or email is required" }
  },
  password: {
    notEmpty: { errorMessage: "password is required" }
  }
};

const employeeCreateSchema = {
  first_name: { notEmpty: { errorMessage: "first_name is required" } },
  last_name: { notEmpty: { errorMessage: "last_name is required" } },
  email: { notEmpty: { errorMessage: "email is required" }, isEmail: true },
  gender: {
    optional: true,
    isIn: {
      options: [["Male", "Female", "Other"]],
      errorMessage: "gender must be Male, Female, or Other"
    }
  },
  designation: { notEmpty: { errorMessage: "designation is required" } },
  salary: {
    notEmpty: { errorMessage: "salary is required" },
    isFloat: {
      options: { min: 1000 },
      errorMessage: "salary must be >= 1000"
    }
  },
  date_of_joining: {
    notEmpty: { errorMessage: "date_of_joining is required" },
    isISO8601: { errorMessage: "date_of_joining must be a valid date" }
  },
  department: { notEmpty: { errorMessage: "department is required" } },
  employee_photo: {
    optional: true
  }
};

const employeeUpdateSchema = {
  first_name: { optional: true, notEmpty: true },
  last_name: { optional: true, notEmpty: true },
  email: { optional: true, isEmail: true },
  gender: {
    optional: true,
    isIn: {
      options: [["Male", "Female", "Other"]],
      errorMessage: "gender must be Male, Female, or Other"
    }
  },
  designation: { optional: true, notEmpty: true },
  salary: {
    optional: true,
    isFloat: {
      options: { min: 1000 },
      errorMessage: "salary must be >= 1000"
    }
  },
  date_of_joining: {
    optional: true,
    isISO8601: { errorMessage: "date_of_joining must be a valid date" }
  },
  department: { optional: true, notEmpty: true },
  employee_photo: { optional: true }
};

module.exports = {
  runValidation,
  signupSchema,
  loginSchema,
  employeeCreateSchema,
  employeeUpdateSchema
};
