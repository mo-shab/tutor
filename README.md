# Tutor-Student Platform

A modern, user-friendly web platform designed to connect students with qualified tutors. This platform simplifies session booking, progress tracking, and communication, creating a seamless learning experience.

## ✨ Features

- **For Students:** Discover, filter, and book sessions with tutors. Manage schedules, communicate securely, and track learning history.
- **For Tutors:** Create detailed profiles, manage availability and bookings, chat with students, and monitor earnings.
- **For Admins:** A full-featured dashboard to manage users, approve tutors, moderate content, and view platform analytics.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** JWT (JSON Web Tokens)

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [PostgreSQL](https://www.postgresql.org/) or [Docker](https://www.docker.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/tutor-platform.git](https://github.com/your-username/tutor-platform.git)
    cd tutor-platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your database connection string. You can copy the example:
    ```bash
    cp .env.example .env
    ```
    Then, update the `DATABASE_URL` in your new `.env` file:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

4.  **Run database migrations:**
    This command will create the tables in your database based on the schema in `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- **/app:** Contains all the frontend pages and layouts using the Next.js App Router.
- **/app/api:** Contains all the backend API routes.
- **/prisma:** Contains the database schema (`schema.prisma`) and migration files.
- **/components:** Shared React components used across the application.
- **/lib:** Helper functions, utility code, and library configurations.

## 🗺️ Development Milestones

This project is being built iteratively. Here is the roadmap:

-   [x] **Milestone 1: Project Setup**
    -   [x] Initialize Next.js project with TypeScript & Tailwind CSS
    -   [x] Set up PostgreSQL and connect via Prisma
    -   [x] Define initial `User` schema and run first migration

-   [ ] **Milestone 2: Auth System (JWT)**
    -   [ ] User registration and login API routes
    -   [ ] Password hashing (`bcrypt`)
    -   [ ] JWT generation and validation
    -   [ ] Protected routes middleware
    -   [ ] Frontend login/register forms

-   [ ] **Milestone 3: User Roles & Profiles**
    -   [ ] Role-based access control (Student, Tutor, Admin)
    -   [ ] `TutorProfile` model and relationship
    -   [ ] Students can view their dashboard
    -   [ ] Tutors can create and edit their public profile

-   [ ] **Milestone 4: Core Features**
    -   [ ] Tutor search and filtering
    -   [ ] Session booking system (request/approve/reject)
    -   [ ] Basic messaging system between users

-   [ ] **Milestone 5: Admin Panel**
    -   [ ] Dashboard to view all users and sessions
    -   [ ] Interface for approving/rejecting tutor applications
    -   [ ] Content moderation tools

-   [ ] **Milestone 6: Reviews & Ratings**
    -   [ ] Students can leave reviews after a completed session
    -   [ ] Ratings are displayed on tutor profiles

-   [ ] **Milestone 7: Final Touches & Deployment**
    -   [ ] UI polish and mobile responsiveness
    -   [ ] User notifications (in-app or email)
    -   [ ] Deployment to a cloud platform (e.g., Vercel, Railway)