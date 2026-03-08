import { useState } from "react";

// Data
import { DUMMY_STUDENTS, DUMMY_COURSES, DUMMY_LOGS } from "./data/dummyData";

// Layout
import { AppLayout } from "./components/Layout";

// Pages
import LoginPage            from "./pages/LoginPage";
import DashboardPage        from "./pages/DashboardPage";
import RegisterStudentPage  from "./pages/RegisterStudentPage";
import ManageStudentsPage   from "./pages/ManageStudentsPage";
import CoursesPage          from "./pages/CoursesPage";
import AuditLogsPage        from "./pages/AuditLogsPage";

// Shared UI
import { Toast } from "./components/UI";

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [page,      setPage]      = useState("dashboard");
  const [students,  setStudents]  = useState(DUMMY_STUDENTS);
  const [courses,   setCourses]   = useState(DUMMY_COURSES);
  const [logs,      setLogs]      = useState(DUMMY_LOGS);
  const [toast,     setToast]     = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Register a new student ───────────────────────────────────────────────
  const handleRegister = form => {
    const newStudent = {
      id:        form.studentId,
      firstName: form.firstName,
      lastName:  form.lastName,
      dob:       form.dob,
      email:     form.email,
      phone:     form.phone,
      address:   form.address,
      city:      form.city,
      postal:    form.postal,
      degree:    form.degree,
      year:      form.year,
      semester:  form.semester,
      gpa:       0,
      status:    "Active",
      enrolled:  [],
    };
    setStudents(s => [newStudent, ...s]);

    const entry = {
      id:        logs.length + 1,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      user:    "Admin User",
      action:  "CREATE",
      target:  `Student: ${form.firstName} ${form.lastName} (${form.studentId})`,
      details: `New student registered in ${form.degree}`,
      ip:      "192.168.1.100",
      status:  "Success",
    };
    setLogs(l => [entry, ...l]);
    showToast(`${form.firstName} ${form.lastName} registered successfully!`);
    setPage("students");
  };

  // ── Delete a student ─────────────────────────────────────────────────────
  const handleDelete = id => {
    const s = students.find(s => s.id === id);
    setStudents(st => st.filter(s => s.id !== id));

    const entry = {
      id:        logs.length + 1,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      user:    "Admin User",
      action:  "DELETE",
      target:  `Student: ${s?.firstName} ${s?.lastName} (${id})`,
      details: "Student record removed by administrator",
      ip:      "192.168.1.100",
      status:  "Success",
    };
    setLogs(l => [entry, ...l]);
    showToast(`${s?.firstName} ${s?.lastName} deleted.`);
  };

  // ── Not logged in → show Login ───────────────────────────────────────────
  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
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
          />
        );
      case "register":
        return (
          <RegisterStudentPage
            onRegister={handleRegister}
            onCancel={() => setPage("dashboard")}
          />
        );
      case "students":
        return (
          <ManageStudentsPage
            students={students}
            onDelete={handleDelete}
          />
        );
      case "courses":
        return (
          <CoursesPage
            courses={courses}
            setCourses={setCourses}
          />
        );
      case "logs":
        return <AuditLogsPage logs={logs} />;
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