# COMP3133 Assignment 1 - Employee Management System (GraphQL)

Backend API built with NodeJS, Express, Apollo GraphQL, and MongoDB.

## Features
- User signup and login
- CRUD operations for employees
- Search by employee id, designation, or department
- Cloudinary image upload for employee profile photos
- Input validation using `express-validator`

## Setup
1. Install dependencies:
   - `npm install`
2. Create a `.env` file with the following values:
   - `PORT=4000`
   - `MONGO_URI=mongodb://localhost:27017`
   - `MONGO_DB_NAME=comp3133_StudentID_Assigment1`
   - `JWT_SECRET=change_me`
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
3. Run the server:
   - `npm run dev`

GraphQL endpoint: `http://localhost:4000/graphql`

## Notes on employee_photo
The `employee_photo` field accepts a Cloudinary-compatible image input:
- Base64 data URI (recommended for GraphQL)
- Remote image URL

The API uploads the image to Cloudinary and stores the `url` + `public_id`.
