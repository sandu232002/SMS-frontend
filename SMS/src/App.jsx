import { useState, useEffect, useCallback } from "react";

// Services
import StudentService from "./api/studentService";
import CourseService from "./api/courseService";
import AuditService from "./api/auditService";
import EnrollmentService from "./api/enrollmentService";
import AuthService from "./api/authService";

// Layout
import { AppLayout } from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterStudentPage from "./pages/RegisterStudentPage";
import ManageStudentsPage from "./pages/ManageStudentsPage";
import CoursesPage from "./pages/CoursesPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import EnrollmentsPage from "./pages/EnrollmentsPage";
import DegreeProgramsPage from "./pages/DegreeProgramsPage";

// Shared UI
import { Toast } from "./components/UI";

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (value?.content) return value.content;
  if (value?.data && Array.isArray(value.data)) return value.data;
  return [];
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState(1); // set from login response
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchGlobalData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes, logsRes, degreeProgramsRes, enrollmentsRes] = await Promise.all([
        StudentService.getStudents(),
        CourseService.getCourses(),
        AuditService.getLogs(0, 50),
        StudentService.getDegreePrograms(),
        EnrollmentService.getEnrollments(),
      ]);
      setStudents(normalizeList(studentsRes) || []);
      setCourses(normalizeList(coursesRes) || []);
      // Backend may return paged object with .content, or a plain array
      setLogs(logsRes?.content || logsRes || []);
      setDegreePrograms(normalizeList(degreeProgramsRes) || []);
      setEnrollments(normalizeList(enrollmentsRes) || []);
      } catch (err) {
        console.error("Failed to fetch global data:", err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          AuthService.logout();
          setLoggedIn(false);
          showToast("Session expired or unauthorized. Please log in again.", "error");
        } else {
          showToast("Error loading initial data", "error");
        }
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
    if (!id) {
      showToast("Unable to delete student: missing identifier.", "error");
      return;
    }

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

  const handleUpdateStudent = async (studentId, updates) => {
    if (!studentId) {
      showToast("Unable to update student: missing identifier.", "error");
      return;
    }

    try {
      await StudentService.updateStudent(studentId, updates);

      const updatedName = `${updates.firstName?.trim() || ""} ${updates.lastName?.trim() || ""}`.trim();

      await AuditService.logAction({
        adminId,
        entityName: "Student",
        entityId: studentId,
        actionType: "UPDATE",
        description: updatedName
          ? `Updated student ${updatedName}`
          : `Updated student ID: ${studentId}`,
      });

      showToast("Student updated successfully.");
      fetchGlobalData();
    } catch (err) {
      console.error("Failed to update student", err);
      showToast("Failed to update student", "error");
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
            onEdit={handleUpdateStudent}
            degreePrograms={degreePrograms}
            loading={loading}
          />
        );
      case "degree-programs":
        return (
          <DegreeProgramsPage
            degreePrograms={degreePrograms}
            onRefreshDegreePrograms={fetchGlobalData}
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
      case "enrollments":
        return (
          <EnrollmentsPage
            enrollments={enrollments}
            students={students}
            courses={courses}
            onRefreshEnrollments={fetchGlobalData}
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
