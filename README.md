# Tutor-Student Platform

A modern, user-friendly web platform designed to connect students with qualified tutors. This platform simplifies session booking, progress tracking, and communication, creating a seamless learning experience.

## 🏛️ Project Architecture

This project uses a **decoupled architecture**:

-   **/client**: A **Next.js** application that serves as the frontend user interface.
-   **/server**: A **Node.js + Express.js** application that provides a backend REST API.

This setup allows for independent development, scaling, and deployment of the frontend and backend.

## 🚀 Tech Stack

### Frontend (Client)

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)

### Backend (Server)

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)

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
    In the `/server` directory, create a `.env` file and add your database connection string and JWT secret.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="YOUR_SUPER_SECRET_AND_RANDOM_KEY"
    ```

4.  **Run database migrations:**
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
    -   [x] Initialize Next.js client
    -   [x] Initialize Node.js/Express server
    -   [x] Set up PostgreSQL and connect via Prisma on the server
    -   [x] Define initial `User` schema and run first migration

-   [x] **Milestone 2: Auth System (JWT)**
    -   [x] **Backend:** User registration, login, and logout routes
    -   [x] **Backend:** JWTs sent via secure, HTTP-Only cookies
    -   [x] **Backend:** Authentication middleware and protected `/users/me` route
    -   [x] **Frontend:** Modern Login and Registration pages
    -   [x] **Frontend:** Global `AuthContext` to manage user state
    -   [x] **Frontend:** Protected dashboard page for authenticated users

-   [ ] **Milestone 3: User Roles & Profiles**
    -   [ ] **Backend:** API endpoints for managing profiles
    -   [ ] **Frontend:** Student dashboard view
    -   [ ] **Frontend:** Tutor profile creation and editing pages

-   [ ] **Milestone 4: Core Features**
    -   [ ] **Backend:** API endpoints for search and booking
    -   [ ] **Frontend:** Tutor search and filtering page
    -   [ ] **Frontend:** Session booking UI
    -   [ ] **Backend & Frontend:** Basic messaging system

-   [ ] **Milestone 5: Admin Panel**
    -   [ ] **Backend:** Secure API endpoints for admin actions
    -   [ ] **Frontend:** Admin dashboard UI for managing users and content

-   [ ] **Milestone 6: Reviews & Ratings**
    -   [ ] **Backend:** API endpoints for creating and fetching reviews
    -   [ ] **Frontend:** UI for submitting and displaying reviews

-   [ ] **Milestone 7: Final Touches & Deployment**
    -   [ ] UI polish and mobile responsiveness
    -   [ ] User notifications (in-app or email)
    -   [ ] Deployment of server and client
