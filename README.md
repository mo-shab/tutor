# Tutor-Student Platform

A modern, user-friendly web platform designed to connect students with qualified tutors. This platform simplifies session booking, progress tracking, and communication, creating a seamless learning experience for a global community of learners and educators.

## ✨ Key Features

The platform is built with three primary user roles in mind, each with a tailored experience.

### For Students 🧑‍🎓
- **Tutor Discovery:** Browse a public catalog of approved tutors.
- **Advanced Filtering:** Search for tutors by subject, availability, and rating. (Future)
- **Detailed Profiles:** View comprehensive tutor profiles to make informed decisions.
- **Secure Booking:** Request and book sessions directly through the platform. (Future)
- **Dashboard:** Manage upcoming sessions and view learning history.

### For Tutors 👨‍🏫
- **Customizable Profile:** Create and manage a detailed public profile including a bio, subjects taught, and hourly rate.
- **Schedule Management:** Set availability and manage incoming session requests. (Future)
- **Tutor Dashboard:** A central hub to view your schedule, manage bookings, and track student progress.
- **Secure Communication:** Communicate with students through a secure, integrated messaging system. (Future)

### For Admins 🛡️
- **User Management:** Oversee all student and tutor accounts.
- **Tutor Approval System:** Review and approve new tutor applications to maintain platform quality.
- **Content Moderation:** Manage reviews, messages, and session data.
- **Platform Analytics:** View key metrics on user activity and platform growth. (Future)

## 🏛️ Project Architecture

This project uses a **decoupled (or headless) architecture**, which provides significant advantages in scalability and maintainability.

-   **/client**: A **Next.js** application serves as the frontend. It is responsible for all user interface rendering and client-side interactivity. It communicates with the backend via REST API calls.
-   **/server**: A **Node.js + Express.js** application provides a backend REST API. It handles all business logic, database interactions, and user authentication.

This separation of concerns allows the frontend and backend teams (or a single developer) to work independently, choose the best technologies for each part, and scale them separately as needed.

## 🚀 Tech Stack

### Frontend (Client)
-   **Framework:** [Next.js](https://nextjs.org/) (App Router) - Chosen for its powerful features like server-side rendering, static site generation, and a file-system-based router, which are ideal for a fast, SEO-friendly application.
-   **Language:** [TypeScript](https://www.typescriptlang.org/) - For adding static types to JavaScript, which improves code quality and reduces bugs.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building modern, responsive designs.
-   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible, and reusable components.

### Backend (Server)
-   **Runtime:** [Node.js](https://nodejs.org/) - A fast and efficient JavaScript runtime for building server-side applications.
-   **Framework:** [Express.js](https://expressjs.com/) - A minimal and flexible web application framework for Node.js, providing a robust set of features for building our REST API.
-   **Language:** [TypeScript](https://www.typescriptlang.org/) - Ensures type safety and better developer experience on the backend.
-   **Database:** [PostgreSQL](https://www.postgresql.org/) - A powerful, open-source object-relational database system known for its reliability and data integrity.
-   **ORM:** [Prisma](https://www.prisma.io/) - A next-generation ORM that makes database access easy with an auto-generated and type-safe query builder.

## ⚙️ Getting Started

Follow these instructions to get both the frontend and backend running on your local machine.

### Prerequisites
-   [Node.js](https://nodejs.org/) (LTS version)
-   [PostgreSQL](https://www.postgresql.org/) or [Docker](https://www.docker.com/)
-   [Git](https://git-scm.com/)

### Installation & Setup
You will need two separate terminals to run both the client and the server simultaneously.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/tutor-platform.git](https://github.com/your-username/tutor-platform.git)
    cd tutor-platform
    ```

---

#### **Terminal 1: Backend Setup (`/server`)**

2.  **Navigate to the server directory and install dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Set up environment variables:**
    In the `/server` directory, create a `.env` file. You can copy the example file first: `cp .env.example .env` (if it exists). Then, add your database connection string and JWT secret.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="YOUR_SUPER_SECRET_AND_RANDOM_KEY"
    ```

4.  **Run database migrations:**
    This command reads your `prisma/schema.prisma` file and applies any pending changes to your database schema.
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The backend API will now be running on `http://localhost:8000`.

---

#### **Terminal 2: Frontend Setup (`/client`)**

6.  **Navigate to the client directory and install dependencies:**
    ```bash
    cd client
    npm install
    ```

7.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will now be running on `http://localhost:3000`.

## 🗺️ Development Milestones

-   [x] **Milestone 1: Project Setup**
    -   [x] Restructure project into Client/Server monorepo
    -   [x] Initialize Next.js client & Node.js/Express server
    -   [x] Set up PostgreSQL and connect via Prisma
    -   [x] Define initial `User` schema and run first migration

-   [x] **Milestone 2: Auth System (JWT)**
    -   [x] **Backend:** User registration, login, and logout routes
    -   [x] **Backend:** JWTs sent via secure, HTTP-Only cookies
    -   [x] **Backend:** Authentication middleware and protected `/users/me` route
    -   [x] **Frontend:** Modern Login and Registration pages
    -   [x] **Frontend:** Global `AuthContext` to manage user state
    -   [x] **Frontend:** Protected dashboard page for authenticated users

-   [x] **Milestone 3: User Roles & Profiles**
    -   [x] **Backend:** API endpoints for tutors to create/update their profiles
    -   [x] **Frontend:** Role-aware dashboard (Student & Tutor views)
    -   [x] **Frontend:** Tutor profile creation and editing page

-   [x] **Milestone 4: Core Features** - **Complete**
    -   [x] **Backend:** Public API endpoints to list all tutors and fetch a single tutor profile.
    -   [x] **Frontend:** "Find a Tutor" page to browse all approved tutors.
    -   [x] **Frontend:** Dynamic public profile page for individual tutors.
    -   [x] **Database:** Added `Session` model to schema.
    -   [x] **Backend:** API endpoints for booking and managing sessions, including race condition handling.
    -   [x] **Frontend:** Session booking UI with validation and dashboard integration for students and tutors.
    -   [x] **Backend & Frontend:** Implemented a full real-time messaging system with unread message indicators.

-   [ ] **Milestone 5: Admin Panel**
    -   [ ] **Backend:** Secure API endpoints for admin actions (e.g., user management, tutor approval).
    -   [ ] **Frontend:** Admin dashboard UI for managing users and content.

-   [ ] **Milestone 6: Reviews & Ratings**
    -   [ ] **Backend:** API endpoints for creating and fetching reviews.
    -   [ ] **Frontend:** UI for submitting and displaying reviews on tutor profiles.

-   [ ] **Milestone 7: Final Touches & Deployment**
    -   [ ] UI polish and mobile responsiveness.
    -   [ ] User notifications (in-app or email).
    -   [ ] Deployment of server and client to a cloud platform.
