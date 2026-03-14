import { useState, useEffect, useCallback } from "react";

// Services
import StudentService from "./api/studentService";
import CourseService from "./api/courseService";
import AuditService from "./api/auditService";

// Layout
import { AppLayout } from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterStudentPage from "./pages/RegisterStudentPage";
import ManageStudentsPage from "./pages/ManageStudentsPage";
import CoursesPage from "./pages/CoursesPage";
import AuditLogsPage from "./pages/AuditLogsPage";

// Shared UI
import { Toast } from "./components/UI";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState(1); // set from login response
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch Initial Data ───────────────────────────────────────────────────
  const fetchGlobalData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes, logsRes, degreeProgramsRes] = await Promise.all([
        StudentService.getStudents(),
        CourseService.getCourses(),
        AuditService.getLogs(0, 50),
        StudentService.getDegreePrograms(),
      ]);
      setStudents(studentsRes || []);
      setCourses(coursesRes || []);
      // Backend may return paged object with .content, or a plain array
      setLogs(logsRes?.content || logsRes || []);
      setDegreePrograms(degreeProgramsRes || []);
    } catch (err) {
      console.error("Failed to fetch global data:", err);
      showToast("Error loading initial data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchGlobalData();
    }
  }, [loggedIn, fetchGlobalData]);

  // ── Handle Login ─────────────────────────────────────────────────────────
  const handleLogin = (loginResponse) => {
    // Store admin ID from login response if available
    if (loginResponse?.adminId) setAdminId(loginResponse.adminId);
    else if (loginResponse?.id) setAdminId(loginResponse.id);
    setLoggedIn(true);
  };

  // ── Register a new student ───────────────────────────────────────────────
  const handleRegister = async (form) => {
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address || "N/A",
        dateOfBirth: form.dob,
        degreeProgramId: form.degreeProgramId, // numeric ID selected in form
      };

      const res = await StudentService.createStudent(payload);
      const studentId = res.id || res.studentId;

      await AuditService.logAction({
        adminId,
        entityName: "Student",
        entityId: studentId || 0,
        actionType: "CREATE",
        description: `Registered a new student: ${form.firstName} ${form.lastName}`
      });

      showToast(`${form.firstName} ${form.lastName} registered successfully!`);
      fetchGlobalData();
      setPage("students");
    } catch (err) {
      console.error("Failed to register student", err);
      showToast("Registration failed", "error");
    }
  };

  // ── Delete a student ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await StudentService.deleteStudent(id);

      await AuditService.logAction({
        adminId,
        entityName: "Student",
        entityId: id,
        actionType: "DELETE",
        description: `Deleted student ID: ${id}`
      });

      showToast(`Student deleted successfully.`);
      fetchGlobalData();
    } catch (err) {
      console.error("Failed to delete student", err);
      showToast("Failed to delete student", "error");
    }
  };

  // ── Not logged in → show Login ───────────────────────────────────────────
  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ── Render active page ───────────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            students={students}
            courses={courses}
            logs={logs}
            setPage={setPage}
            loading={loading}
          />
        );
      case "register":
        return (
          <RegisterStudentPage
            onRegister={handleRegister}
            onCancel={() => setPage("dashboard")}
            degreePrograms={degreePrograms}
          />
        );
      case "students":
        return (
          <ManageStudentsPage
            students={students}
            onDelete={handleDelete}
            loading={loading}
          />
        );
      case "courses":
        return (
          <CoursesPage
            courses={courses}
            onRefreshCourses={fetchGlobalData}
            loading={loading}
          />
        );
      case "logs":
        return <AuditLogsPage logs={logs} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppLayout activePage={page} setPage={setPage}>
        {renderPage()}
      </AppLayout>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}