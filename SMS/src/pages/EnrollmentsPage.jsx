import { useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import {
  Breadcrumb,
  PageHeader,
  Card,
  Input,
  Select,
  ActionButton,
  Modal,
  FormField
} from "../components/UI";
import EnrollmentService from "../api/enrollmentService";
import AuditService from "../api/auditService";

const STATUS_OPTIONS = ["ACTIVE", "COMPLETED", "CANCELLED"];

const defaultForm = () => ({
  studentId: "",
  courseId: "",
  academicYear: String(new Date().getFullYear()),
  semester: "1",
  status: STATUS_OPTIONS[0],
});

export default function EnrollmentsPage({
  enrollments = [],
  students = [],
  courses = [],
  onRefreshEnrollments,
  loading,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm());
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const resetForm = () => {
    setFormErrors({});
    setFormData(defaultForm());
  };
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const availableYears = useMemo(() => {
    const years = new Set(enrollments.map(e => String(e.academicYear)));
    years.add(String(new Date().getFullYear()));
    return Array.from(years).sort();
  }, [enrollments]);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => {
      const matchesSearch =
        !search ||
        `${enrollment.studentName ?? ""} ${enrollment.courseName ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = !statusFilter || enrollment.status === statusFilter;
      const matchesYear = !yearFilter || String(enrollment.academicYear) === yearFilter;
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [enrollments, search, statusFilter, yearFilter]);

  const totalEnrollments = enrollments.length;
  const activeCount = enrollments.filter(e => e.status === "ACTIVE").length;
  const completedCount = enrollments.filter(e => e.status === "COMPLETED").length;
  const otherCount = totalEnrollments - activeCount - completedCount;

  const handleEnroll = async () => {
    const errors = {};
    if (!formData.studentId) errors.studentId = "Select a student.";
    if (!formData.courseId) errors.courseId = "Select a course.";
    if (!formData.academicYear.trim()) errors.academicYear = "Academic year is required.";
    if (!formData.semester) errors.semester = "Semester is required.";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const student = students.find(s => String(s.id) === formData.studentId);
    const course = courses.find(c => String(c.id) === formData.courseId);

    try {
      const payload = {
        studentId: Number(formData.studentId),
        courseId: Number(formData.courseId),
        academicYear: formData.academicYear,
        semester: formData.semester,
        status: formData.status,
      };
      const result = await EnrollmentService.createEnrollment(payload);
      await AuditService.logAction({
        adminId: 1,
        entityName: "Enrollment",
        entityId: result.id || 0,
        actionType: "CREATE",
        description: `Enrolled ${student?.firstName ?? "Student"} ${student?.lastName ?? ""} in ${
          course?.courseCode || course?.courseName || "course"
        }`,
      });
      closeModal();
      onRefreshEnrollments?.();
    } catch (err) {
      console.error("Failed to enroll student:", err);
      setFormErrors({ form: "Unable to enroll student right now." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Breadcrumb items={["Dashboard", "Enrollments"]} />

      <PageHeader
        title="Enrollment Management"
        subtitle="Track and manage who is registered for each course."
        action={
          <ActionButton icon={<Icons.Plus />} onClick={() => setModalOpen(true)}>
            Enroll Student
          </ActionButton>
        }
      />

      <Card className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex-1 min-w-[210px]">
          <label className="text-xs font-semibold tracking-wide text-gray-500 mb-1 block">Search</label>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Student or course"
            disabled={loading}
          />
        </div>
        <div className="min-w-[180px]">
          <label className="text-xs font-semibold tracking-wide text-gray-500 mb-1 block">Status</label>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} disabled={loading}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-[180px]">
          <label className="text-xs font-semibold tracking-wide text-gray-500 mb-1 block">Academic Year</label>
          <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)} disabled={loading}>
            <option value="">All years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-xs uppercase tracking-wide text-gray-500">Total enrollments</div>
          <div className="text-3xl font-semibold text-gray-800">{totalEnrollments}</div>
        </Card>
        <Card className="text-center">
          <div className="text-xs uppercase tracking-wide text-gray-500">Active</div>
          <div className="text-3xl font-semibold text-green-600">{activeCount}</div>
        </Card>
        <Card className="text-center">
          <div className="text-xs uppercase tracking-wide text-gray-500">Completed / Other</div>
          <div className="text-3xl font-semibold text-amber-600">
            {completedCount} / {otherCount}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredEnrollments.length ? (
          filteredEnrollments.map(enrollment => (
            <Card key={enrollment.id || `${enrollment.studentId}-${enrollment.courseId}`} className="border-blue-50 border-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Student</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {enrollment.studentName ?? "Unknown Student"}
                  </h3>
                  <p className="text-sm text-gray-500">{enrollment.academicYear} · Semester {enrollment.semester}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                    enrollment.status === "ACTIVE"
                      ? "bg-green-50 text-green-700"
                      : enrollment.status === "COMPLETED"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {enrollment.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Icons.BookOpen />
                  <span>{enrollment.courseName ?? "Course name unavailable"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.User />
                  <span>ID: {enrollment.studentId || "—"}</span>
                </div>
                {enrollment.enrolledAt && (
                  <div className="flex items-center gap-2">
                    <Icons.Activity />
                    <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center text-gray-400">
            No enrollments match the current filters.
          </Card>
        )}
      </div>

      {modalOpen && (
        <Modal title="Enroll Student" onClose={() => setModalOpen(false)} size="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Student" required error={formErrors.studentId}>
              <Select
                value={formData.studentId}
                onChange={e => setFormData(f => ({ ...f, studentId: e.target.value }))}
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student.id} value={String(student.id)}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Course" required error={formErrors.courseId}>
              <Select
                value={formData.courseId}
                onChange={e => setFormData(f => ({ ...f, courseId: e.target.value }))}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={String(course.id)}>
                    {course.courseCode || ""} {course.courseName}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Academic Year" required error={formErrors.academicYear}>
              <Input
                value={formData.academicYear}
                onChange={e => setFormData(f => ({ ...f, academicYear: e.target.value }))}
              />
            </FormField>
            <FormField label="Semester" required error={formErrors.semester}>
              <Select
                value={formData.semester}
                onChange={e => setFormData(f => ({ ...f, semester: e.target.value }))}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </Select>
            </FormField>
            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          {formErrors.form && <p className="text-xs text-red-500 mt-3">{formErrors.form}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <ActionButton color="gray" outline onClick={closeModal}>
              Cancel
            </ActionButton>
            <ActionButton onClick={handleEnroll} disabled={saving}>
              {saving ? "Saving…" : "Save Enrollment"}
            </ActionButton>
          </div>
        </Modal>
      )}
    </>
  );
}
