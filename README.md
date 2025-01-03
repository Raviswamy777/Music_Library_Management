# **Music Library Management API**

## **Overview**
The **Music Library Management API** is a RESTful backend system designed to manage a music library for organizations. It allows users to manage artists, albums, and tracks while enabling them to personalize their experience by marking items as favorites. The API includes role-based access control to ensure secure and structured access.

---

## **Features**
- **Authentication & Authorization**:
  - User login and registration with role-based access control (Admin, Editor, Viewer).
  - JWT-based authentication.
- **CRUD Operations**:
  - Manage Artists, Albums, and Tracks with hierarchical relationships.
  - Mark and retrieve favorite items (Artists, Albums, Tracks).
- **Dynamic Relationships**:
  - Populate and retrieve favorite items dynamically based on categories.
- **Filtering & Pagination**:
  - Efficient filtering and pagination for listing entities.

---

## **Technology Stack**
- **Node.js** with **Express.js** for the backend framework.
- **MongoDB** with **Mongoose** for the database.
- **JWT** for secure user authentication.
- Additional libraries: `bcryptjs` (password encryption), `dotenv` (environment variables).

---

## **Future Scope**
- Add support for playlists and music recommendations.
- Implement user analytics and usage insights.
- Scale the API to a microservices architecture for enhanced performance.
