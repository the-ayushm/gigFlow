# GigFlow

GigFlow is a mini freelance marketplace where clients can create gigs and freelancers can place bids.
Clients can review bids and hire freelancers through a simple dashboard.

This project is built as a full-stack MERN application with authentication and protected routes.

## Features
- User registration and login
- Secure authentication using JWT (cookies)
- Clients can create gigs and view bids
- Freelancers can browse gigs and place bids
- Clients can hire freelancers
- Protected dashboard for authenticated users

## Tech Stack
- Frontend: React, React Router, Axios, Context API
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT

## Environment Variables
Create a `.env` file inside the `backend` folder:

PORT=3000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret_key  
NODE_ENV=development

## Installation and Setup

1. Clone the repository
2. Install backend dependencies:
   - cd backend
   - npm install
   - node server.js

3. Install frontend dependencies:
   - cd frontend
   - npm install
   - npm run dev

The frontend will run on `http://localhost:5173`
and the backend on `http://localhost:3000`


## Author
Ayush Kesharwani
