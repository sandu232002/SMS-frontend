# SMS Frontend

## Description

SMS Frontend is a React-based web application for managing student information in a Student Management System (SMS). It provides an intuitive interface for administrators and users to handle student registrations, course management, enrollments, and audit logging.

## Features

- **User Authentication**: Secure login system for accessing the application.
- **Dashboard**: Overview of key metrics and system status.
- **Student Management**: Register new students and manage existing student records.
- **Course Management**: Create and manage courses offered by the institution.
- **Degree Programs**: Handle degree program information.
- **Enrollments**: Manage student enrollments in courses.
- **Audit Logs**: Track and view system activities and changes.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Axios**: HTTP client for making API requests.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ESLint**: Linting tool for maintaining code quality.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd SMS-frontend/SMS
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Usage

- **Development**: Run `npm run dev` to start the development server with hot reloading.
- **Build**: Run `npm run build` to create a production build.
- **Lint**: Run `npm run lint` to check for code quality issues.
- **Preview**: Run `npm run preview` to preview the production build locally.

## Project Structure

```
SMS/
├── public/                 # Static assets
├── src/
│   ├── api/                # API service modules
│   │   ├── auditService.js
│   │   ├── authService.js
│   │   ├── axiosConfig.js
│   │   ├── courseService.js
│   │   ├── enrollmentService.js
│   │   └── studentService.js
│   ├── assets/             # Asset files
│   ├── components/         # Reusable UI components
│   │   ├── Icons.jsx
│   │   ├── Layout.jsx
│   │   └── UI.jsx
│   ├── pages/              # Page components
│   │   ├── AuditLogsPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DegreeProgramsPage.jsx
│   │   ├── EnrollmentsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ManageStudentsPage.jsx
│   │   └── RegisterStudentPage.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## API Integration

The application communicates with a backend API for data management. Ensure the backend server is running and configured correctly in the `axiosConfig.js` file.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and test thoroughly.
4. Submit a pull request.

## License

This project is licensed under the MIT License.
