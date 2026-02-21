const { GraphQLScalarType, Kind, GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const { uploadEmployeePhoto } = require("../config/cloudinary");
const {
  runValidation,
  signupSchema,
  loginSchema,
  employeeCreateSchema,
  employeeUpdateSchema
} = require("../validation/validators");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date scalar as ISO-8601 string",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  }
});

const toGraphQLError = (error, code = "BAD_REQUEST") => {
  return new GraphQLError(error.message, {
    extensions: {
      code,
      details: error.details || null
    }
  });
};

const handleDuplicateKeyError = (error) => {
  if (error && error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "field";
    return toGraphQLError(new Error(`${field} already exists`), "CONFLICT");
  }
  return null;
};

const resolvers = {
  Date: dateScalar,
  Query: {
    login: async (_, args) => {
      try {
        await runValidation(
          { login: args.login, password: args.password },
          loginSchema
        );

        const user = await User.findOne({
          $or: [
            { username: args.login },
            { email: args.login.toLowerCase() }
          ]
        });

        if (!user) {
          throw new Error("invalid credentials");
        }

        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) {
          throw new Error("invalid credentials");
        }

        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET || "dev_secret",
          { expiresIn: "2h" }
        );

        return {
          success: true,
          message: "login successful",
          token,
          user
        };
      } catch (error) {
        throw toGraphQLError(error, "UNAUTHENTICATED");
      }
    },
    getAllEmployees: async () => {
      const employees = await Employee.find().sort({ created_at: -1 });
      return { success: true, message: "employees fetched", employees };
    },
    searchEmployeeByEid: async (_, { eid }) => {
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw toGraphQLError(new Error("employee not found"), "NOT_FOUND");
      }
      return { success: true, message: "employee fetched", employee };
    },
    searchEmployeesByDesignationOrDepartment: async (_, args) => {
      if (!args.designation && !args.department) {
        throw toGraphQLError(
          new Error("designation or department is required"),
          "BAD_REQUEST"
        );
      }
      const query = {};
      if (args.designation) query.designation = args.designation;
      if (args.department) query.department = args.department;
      const employees = await Employee.find(query).sort({ created_at: -1 });
      return { success: true, message: "employees fetched", employees };
    }
  },
  Mutation: {
    signup: async (_, args) => {
      try {
        await runValidation(args, signupSchema);

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await User.create({
          username: args.username,
          email: args.email.toLowerCase(),
          password: hashedPassword
        });

        return {
          success: true,
          message: "account created",
          user
        };
      } catch (error) {
        const dupError = handleDuplicateKeyError(error);
        if (dupError) throw dupError;
        throw toGraphQLError(error);
      }
    },
    addEmployee: async (_, { input }) => {
      try {
        await runValidation(input, employeeCreateSchema);

        let photoData = null;
        if (input.employee_photo) {
          photoData = await uploadEmployeePhoto(input.employee_photo);
        }

        const employee = await Employee.create({
          ...input,
          employee_photo: photoData
            ? { url: photoData.secure_url, public_id: photoData.public_id }
            : undefined
        });

        return {
          success: true,
          message: "employee created",
          employee
        };
      } catch (error) {
        const dupError = handleDuplicateKeyError(error);
        if (dupError) throw dupError;
        throw toGraphQLError(error);
      }
    },
    updateEmployeeByEid: async (_, { eid, input }) => {
      try {
        await runValidation(input, employeeUpdateSchema);

        const updateData = { ...input };
        if (input.employee_photo) {
          const photoData = await uploadEmployeePhoto(input.employee_photo);
          updateData.employee_photo = {
            url: photoData.secure_url,
            public_id: photoData.public_id
          };
        }

        const employee = await Employee.findByIdAndUpdate(eid, updateData, {
          new: true
        });

        if (!employee) {
          throw toGraphQLError(new Error("employee not found"), "NOT_FOUND");
        }

        return {
          success: true,
          message: "employee updated",
          employee
        };
      } catch (error) {
        const dupError = handleDuplicateKeyError(error);
        if (dupError) throw dupError;
        throw toGraphQLError(error);
      }
    },
    deleteEmployeeByEid: async (_, { eid }) => {
      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) {
        throw toGraphQLError(new Error("employee not found"), "NOT_FOUND");
      }
      return { success: true, message: "employee deleted" };
    }
  }
};

module.exports = { resolvers };
