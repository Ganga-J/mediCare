# MediBridge MERN Web App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing MediBridge users. The backend provides RESTful APIs for CRUD operations on user data, while the frontend (to be developed) will offer a user interface for interacting with these APIs.

## Project Structure

```
project-root/
├── backend/
│   └── server/
│       ├── package.json
│       ├── package-lock.json
│       ├── server.js
│       ├── config/
│       │   └── dbConnect.js
│       ├── models/
│       │   └── mediBridge.js
│       ├── routes/
│       │   └── newUserRoutes.js
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   └── validator.js
│       └── controllers/  # (Currently empty, can be expanded for business logic)
├── frontend/  # (To be created - React app with Vite)
│   └── (Planned structure: src/, components/, pages/, etc.)
├── step to step creation.txt  # Setup guide
└── README.md
```

## Backend Overview

The backend is built with Node.js and Express.js, using MongoDB for data storage. It includes middleware for error handling and validation.

### Key Files

- **server.js**: Main entry point. Sets up Express app, connects to DB, registers routes and middleware.
- **config/dbConnect.js**: Handles MongoDB connection using Mongoose.
- **models/mediBridge.js**: Defines the MediBridge schema with fields: name (String, required), url (String, required), apiKey (String, required), createdAt (Date, default now).
- **routes/newUserRoutes.js**: Defines API routes for MediBridge users.
- **middleware/errorHandler.js**: Centralized error handling for the app.
- **middleware/validator.js**: Data validation middleware (using express-validator).

### API Endpoints

Base URL: `/api/mediBridgeUsers`

- **POST /create**: Create a new MediBridge user.
  - Body: `{ "name": "string", "url": "string", "apiKey": "string" }`
  - Response: `{ "message": "MediBridge user created successfully", "user": {...} }`

- **GET /all**: Retrieve all MediBridge users.
  - Response: Array of user objects.

- **GET /:id**: Retrieve a specific MediBridge user by ID.
  - Response: User object or 404 if not found.

- **PUT /:id**: Update a MediBridge user by ID.
  - Body: `{ "name": "string", "url": "string", "apiKey": "string" }` (partial updates allowed)
  - Response: `{ "message": "User updated successfully", "user": {...} }`

- **DELETE /:id**: Delete a MediBridge user by ID.
  - Response: `{ "message": "User deleted successfully" }`

### Setup Instructions

1. Navigate to `backend/server/`:
   ```
   cd backend/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server:
   ```
   npm run dev  # Uses nodemon for development
   ```

The server will run on `http://localhost:5000`.

## Frontend (Planned)

The frontend will be a React application built with Vite, featuring:
- User list page
- Create/Edit user forms
- Responsive UI with Tailwind CSS
- API integration using Axios

To set up the frontend (once created):
1. Navigate to `frontend/`:
   ```
   cd frontend
   ```
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, dotenv, body-parser, express-validator
- **Frontend** (planned): React, Vite, Tailwind CSS, Axios, React Router DOM

## Contributing

Feel free to expand the controllers, add more middleware, or develop the frontend based on this structure.
