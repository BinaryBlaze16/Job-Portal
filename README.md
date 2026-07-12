# Job Portal — MERN Stack

A full-stack Job Board / Career Portal built with **MongoDB, Express.js, React, and Node.js**.

## 🚀 Features

- **3 User Roles**: Job Seeker, Employer, Admin
- **JWT Authentication** with role-based access control
- **Job Listings** with search, filters, and pagination
- **Application Tracking** with real-time status updates
- **Employer Dashboard** to post/manage jobs and review applicants
- **Admin Dashboard** with platform analytics
- **Premium Dark UI** with glassmorphism design
- **Resume Upload** support
- **Responsive Design** for all devices

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, React Router v6    |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB, Mongoose ODM              |
| Auth       | JWT, bcryptjs                       |
| Styling    | Vanilla CSS (Glassmorphism + Dark)  |

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install root dependencies (concurrently)
npm install

# Install all dependencies (server + client)
npm run install-all
```

### Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

### Seed the Database

```bash
npm run seed
```

This creates sample data:
- **Admin**: admin@jobportal.com / admin123
- **Employers**: 3 companies with job listings
- **Seekers**: 5 job seekers with profiles
- **Jobs**: 20 job listings across categories
- **Applications**: 10 sample applications

### Run the Application

```bash
# Run both server and client concurrently
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
Job-Portal/
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # Auth context
│   │   ├── services/      # API service layer
│   │   └── index.css      # Design system
│   └── package.json
├── server/                # Express backend
│   ├── models/            # Mongoose schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, error, upload
│   ├── seed/              # Database seeder
│   ├── config/            # DB connection
│   └── server.js          # Entry point
├── package.json           # Root with concurrently
└── README.md
```

## 🔑 API Endpoints

| Method | Route                          | Access     |
|--------|-------------------------------|------------|
| POST   | /api/auth/register            | Public     |
| POST   | /api/auth/login               | Public     |
| GET    | /api/auth/me                  | Protected  |
| GET    | /api/jobs                     | Public     |
| GET    | /api/jobs/:id                 | Public     |
| POST   | /api/jobs                     | Employer   |
| PUT    | /api/jobs/:id                 | Employer   |
| DELETE | /api/jobs/:id                 | Employer   |
| POST   | /api/applications             | Seeker     |
| GET    | /api/applications/my          | Seeker     |
| GET    | /api/applications/job/:id     | Employer   |
| PUT    | /api/applications/:id/status  | Employer   |
| GET    | /api/admin/users              | Admin      |
| GET    | /api/admin/stats              | Admin      |

## 📄 License

MIT
# Job-Portal
