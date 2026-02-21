const typeDefs = `#graphql
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type EmployeePhoto {
    url: String
    public_id: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: EmployeePhoto
    created_at: Date
    updated_at: Date
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type EmployeeResponse {
    success: Boolean!
    message: String!
    employee: Employee
  }

  type EmployeesResponse {
    success: Boolean!
    message: String!
    employees: [Employee!]!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
  }

  type Query {
    login(login: String!, password: String!): AuthResponse!
    getAllEmployees: EmployeesResponse!
    searchEmployeeByEid(eid: ID!): EmployeeResponse!
    searchEmployeesByDesignationOrDepartment(
      designation: String
      department: String
    ): EmployeesResponse!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthResponse!
    addEmployee(input: EmployeeInput!): EmployeeResponse!
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): EmployeeResponse!
    deleteEmployeeByEid(eid: ID!): DeleteResponse!
  }
`;

module.exports = { typeDefs };
