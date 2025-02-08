# Koe the Cafe

Welcome to Koe the Cafe! Koe the Café is a full-stack web application built using the MERN stack. This project showcases a comprehensive café management system with extensive features for both users and administrators. With a strong emphasis on frontend aesthetics and functionality, Koe the Cafe offers a delightful journey for visitors.

## Deployment
Deployment Link - [Koe the Cafe Website!](https://koe-the-cafe.onrender.com/)
Demo Video - [Video Link](https://drive.google.com/file/d/1uEsjoSL1BImlN4d9T457sI1HKbOcL8Sf/view?usp=sharing)

## Key Features

- **MVC Structured Code**:
  - Organized codebase following the Model-View-Controller pattern for better code maintainability and scalability.
  - Separation of concerns, making the development process more efficient.

- **User Features**:
  - **Profile Management**: Update personal details and profile photo.
  - **Table Booking**: Book, view, modify, or cancel table reservations.
  - **Workshop Registration**: Register, view, and manage workshop participation.
  - **Testimonials**: Add, edit, or delete testimonials.
  - **Dashboard**: Centralized view of all user activities and perform CRUD operations.

- **Admin Features**:
  - **Dynamic Content Management**: Update, add, or remove website content in real-time, including event sections, specialty sections, hero sections, and workshop sections, ensuring that the website is always fresh and engaging.
  - **Workshop Management**: Create new workshops, manage workshop registrations, and handle workshop cancellations.
  - **User Management**: Perform CRUD operations on registered users, including managing roles and permissions.
  - **Table Booking Management**: View and manage table bookings, including today's bookings for efficient customer service.
  - **Notification System**: Create and send notifications to users via the user dashboard, as well as send emails to all registered users using Nodemailer.
  - **Testimonial Management**: Manage user testimonials for showcasing customer feedback.
  - **Analytics Dashboard**: View detailed analytics for revenue, orders, users, and dishes (daily, weekly, and monthly). See most selling, trending, and most rated dishes, along with user comments.

- **Authentication**:
  - Implemented with Google OAuth strategy for seamless and secure user login.
  - Local authentication strategy using Passport.js for traditional email/password login.
  - Secure handling of user credentials with hashing and salting.

- **Authorization**:
  - Role-based access control to restrict access to admin features.
  - Ensures only authorized users can perform sensitive operations.

- **Notifications and Emails**:
  - Send notifications to users directly from the admin dashboard.
  - Use Nodemailer to send emails to all registered users, ensuring effective communication.

- **Express Session**:
  - Session management using `express-session` with MongoDB as the store to persist session data.
  - Ensures user sessions remain consistent across server restarts.

- **Custom Error Handling**:
  - Centralized error handling mechanism to catch and manage errors effectively.
  - Custom error messages and status codes for better debugging and user experience.

- **Validation**:
  - Comprehensive validation using Joi on both client-side and server-side to ensure data integrity.
  - Prevents invalid data from being processed or stored in the database.

- **Visitor Interaction**: Visitors can book tables for dining experiences and register for workshops directly from the website, enhancing user engagement.

- **Real-Time Updates**: Utilized WebSockets to enable real-time updates for order statuses and table bookings.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: React.js, SASS for styling
- **Real-Time Communication**: WebSockets for instant updates
- **Payment Integration**: Razorpay for secure transactions
- **Environment Management**: dotenv
- **Schema Validation**: Joi
- **Session Management**: express-session, connect-mongo
- **Authentication**: Passport.js (Google Strategy, Local Strategy), passport-google-oidc, passport-local-mongoose
- **Email Handling**: Gmail API for sending emails
- **Push Notifications**: Firebase Cloud Messaging for real-time notifications
- **Data Visualization**: Graphs and charts for admin dashboard analytics
- **Other Tools**: Multer for file uploads, ImageKit for image handling, method-override for RESTful routing

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/koe-the-cafe.git
    ```

2. Set up the frontend:
    - Navigate to the `frontend` directory:
      ```bash
      cd frontend
      ```
    - Create a `.env` file and add the required environment variables.
    - Install dependencies:
      ```bash
      npm install
      ```
    - Start the development server:
      ```bash
      npm run dev
      ```

3. Set up the backend:
    - In a new terminal, navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    - Create a `.env` file and add the required environment variables.
    - Install dependencies:
      ```bash
      npm install
      ```
    - Start the backend server:
      ```bash
      node server.js
      ```

### Configuration

- **Frontend**: Ensure the `.env` file in the `frontend` directory contains all necessary environment variables (e.g., API URLs, Firebase config).
- **Backend**: Ensure the `.env` file in the `backend` directory contains all necessary environment variables (e.g., MongoDB URL, Razorpay credentials, Gmail API credentials).

## Running the Application

After setting up both the frontend and backend, the application should be accessible at `http://localhost:5173` for the frontend and `http://localhost:8080` for the backend (default ports).

With these steps and features, Koe the Cafe ensures both administrators and users have a smooth and enjoyable experience managing and interacting with the website. Explore the live deployment and feel free to contribute to the project!
