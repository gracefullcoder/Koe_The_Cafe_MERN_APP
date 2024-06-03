## Deployment
Deployment Link - [Koe the Cafe  Website!](https://admin-koe-the-cafe.onrender.com)

# Koe the Cafe

Welcome to Koe the Cafe's Koe the Café is a full-stack web application. This project showcases a café management system with extensive features for both users and administrators. With a strong emphasis on frontend aesthetics and functionality, Koe the Cafe offers a delightful journey for visitors.

## Key Features

- **MVC Structured Code**:
  - Organized codebase following the Model-View-Controller pattern for better code maintainability and scalability.
  - Separation of concerns, making the development process more efficient.
 
- **User Features**
  - Profile Management: Update personal details and profile photo.
  - Table Booking: Book, view, modify, or cancel table reservations.
  - Workshop Registration: Register, view, and manage workshop participation.
  - Testimonials: Add, edit, or delete testimonials.
  - Dashboard: Centralized view of all user activities and perform CRUD operations.

- **Admin Features**
  - Dynamic Content Management: Update, add, or remove website content in real-time, including event sections, specialty sections, hero sections, and workshop sections, ensuring that the website is always fresh and engaging..
  - Workshop Management: Create new workshops, manage workshop registrations, and handle workshop cancellations.
  - User Management: Perform CRUD operations on registered users, including managing roles and permissions.
  - Table Booking Management: View and manage table bookings, including today's bookings for efficient customer service.
  - Notification System: Create and send notifications to users via the user dashboard, as well as send emails to all registered users using Nodemailer.
  - Testimonial Management: Manage user testimonials for showcasing customer feedback.

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

- **Visitor Interaction:** Visitors can book tables for dining experiences and register for workshops directly from the website, enhancing user engagement.
- **Server-side:** The server is powered by Express.js and Node.js, delivering a robust and efficient backend for seamless user experiences.

## Technologies Used

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** EJS, HTML, CSS
- **File Uploads:** Multer, ImageKit
- **Environment Management:** dotenv
- **Schema Validation:** Joi
- **Session Management:** express-session, connect-mongo
- **Authentication:** Passport.js (Google Strategy, Local Strategy), passport-google-oidc, passport-local-mongoose
- **Email Handling:** Nodemailer, send-email
- **Other Tools:** method-override for RESTful routing, and more.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed

### Installation

1. Clone repository:
    ```bash
    git clone https://github.com/your-username/koe-the-cafe.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

### Configuration

1. Create `.env` file in root directory.
2. Add environment variables for MongoDB URL and ImageKit credentials.

### Running the Server

1. Start MongoDB:
    ```bash
    mongod
    ```
2. Run the project:
    ```bash
    npm start
    ```

With these steps and features, Koe the Cafe ensures both administrators and users have a smooth and enjoyable experience managing and interacting with the website.
