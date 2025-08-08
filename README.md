## Nexyn Pet House - A Full-Stack Pet Adoption Platform

Welcome to the Nexyn Pet House project — a modern, full-stack MERN application designed to connect pets in need with loving homes. This platform allows users to browse and adopt pets, create and manage donation campaigns, and provides a comprehensive dashboard for both users and administrators to manage all aspects of the adoption process.

## NB: This project was created for a Programming Hero assignment.

## Site Live URLs:

Frontend: https://a12rkmehedi.netlify.app/

Backend: https://nexyn-pet-server.vercel.app/

## Key Features

## User & Authentication

- Full Authentication System: Secure user registration and login with email/password, Google, and GitHub.
- JWT Security: Protected backend API routes using JSON Web Tokens.
- Role-Based Access Control: Roles for regular users and administrators, with protected routes for each.

## Public-Facing Pages

- Pet Listing Page: Browse all available pets with search by name, filter by category, and infinite scrolling.
- Donation Campaigns Page: View all active donation campaigns with infinite scrolling.
- Detailed Views: In-depth details pages for both individual pets and donation campaigns.
- Secure Payments: Integrated Stripe for a secure and seamless donation process.

## User Dashboard

- Complete Pet Management: Users can add their own pets for adoption, view a list of their added pets, update pet details, and mark them as adopted.
- Donation Campaign Management: Users can create new donation campaigns for pets, view their active campaigns, edit them, pause/resume them, and see a list of donators.
- Adoption Request Management: Users can view and manage adoption requests for their pets, with the ability to accept or reject them.
- Donation History: A dedicated page for users to see a history of all the donations they have made, with an option to request a refund.

## Admin Dashboard

- Full User Management: Admins can view a list of all registered users and promote any user to an admin role.
- Pet Management: Admins have full control to view, update, and delete any pet on the platform.
- Donation Management: Admins can view, edit, pause, and delete any donation campaign on the platform.

## Advanced UI/UX

- Fully Responsive Design: A beautiful and functional interface on all devices, from mobile to desktop.

- Dark/Light Theme: A theme toggle for user preference, with the choice saved to localStorage.
- Skeleton Loaders: Professional skeleton loaders are used.
- Rich User Feedback: Interactive alerts with SweetAlert2 and non-intrusive notifications with React-Toastify.
- Custom Error Handling:  dedicated 404 error and other error page for a better user experience.

## Frontend Technologies & NPM Packages Used:

- Framework/Library: React, Vite
- Routing: React Router

## UI & Styling: Tailwind CSS, Flowbite React

- Data Fetching: Tanstack Query for server state management and infinite scrolling.
- Tables: Tanstack Table for sortable and paginated data tables.
- Forms: React Hook Form
- Rich Text Editor: Tiptap
- Animations: React Awesome Reveal, React Type Animation
- Authentication: Firebase
- Payments: Stripe JS
- API Calls: Axios
- Icons: React Icons
- Notifications: React Toastify, SweetAlert2
- Other: React Select, React Intersection Observer

## Backend Technologies Used:

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB
- Security: JSON Web Token (JWT), Helmet, CORS
- Payments: Stripe
- Environment Variables: dotenv

## The backend for this project is securely hosted on Vercel.

Thank you!