import { useState } from "react";
import { Icons } from "../components/Icons";
import {
  Breadcrumb, PageHeader, Card, Modal, Toggle, FormField,
  Input, Select, ActionButton, Toast
} from "../components/UI";
import CourseService from "../api/courseService";
import AuditService from "../api/auditService";

const DEGREES = ["Software Engineering", "Computer Science", "Information Technology", "Business IT"];

const EMPTY_COURSE = {
  courseCode: "", courseName: "", degree: DEGREES[0],
  semester: "1", year: "1", creditValue: "3", capacity: "30", description: "",
};

/**
 * CoursesPage
 * Props:
 *   courses:          array
 *   onRefreshCourses: () => void
 */
export default function CoursesPage({ courses, onRefreshCourses }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);
  const [newCourse, setNewCourse] = useState(EMPTY_COURSE);
  const [formErrors, setFormErrors] = useState({});
  const [, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const setField = (k, v) => setNewCourse(f => ({ ...f, [k]: v }));

  const filtered = courses.filter(
    c =>
      !search ||
      c.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = () => {
    // Stub: In reality this calls updateCourse status or logic. Since API only modifies basic data right now, just show toast
    showToast("Toggling active status is not implemented in core API yet", "error");
  }

  const deleteCourse = async (id, codeStr) => {
    try {
      await CourseService.deleteCourse(id);
      await AuditService.logAction({
        adminId: 1, // hardcoded assuming currently logged in user admin
        entityName: "Course",
        entityId: id,
        actionType: "DELETE",
        description: `Deleted course: ${codeStr}`
      });
      showToast("Course deleted successfully");
      onRefreshCourses();
    } catch {
      showToast("Failed to delete course", "error");
    }
  };

  const validateCourse = () => {
    const e = {};
    if (!newCourse.courseCode.trim()) e.courseCode = "Course code is required.";
    if (!newCourse.courseName.trim()) e.courseName = "Course name is required.";
    return e;
  };

  const handleAdd = async () => {
    const e = validateCourse();
    if (Object.keys(e).length) { setFormErrors(e); return; }

    try {
      const payload = {
        courseCode: newCourse.courseCode,
        courseName: newCourse.courseName,
        creditValue: Number(newCourse.creditValue),
        semester: newCourse.semester
      };

      if (editTarget) {
        await CourseService.updateCourse(editTarget, payload);
        await AuditService.logAction({
          adminId: 1,
          entityName: "Course",
          entityId: editTarget,
          actionType: "UPDATE",
          description: `Updated course: ${newCourse.courseCode}`
        });
        showToast("Course updated successfully");
      } else {
        const res = await CourseService.createCourse(payload);
        await AuditService.logAction({
          adminId: 1,
          entityName: "Course",
          entityId: res.id || 0,
          actionType: "CREATE",
          description: `Created new course: ${newCourse.courseCode}`
        });
        showToast("Course created successfully");
      }

      setShowAdd(false);
      setNewCourse(EMPTY_COURSE);
      setFormErrors({});
      setEditTarget(null);
      onRefreshCourses();

    } catch (err) {
      console.error(err);
      showToast("Failed to save course", "error");
    }
  };

  const openAdd = () => { setNewCourse(EMPTY_COURSE); setFormErrors({}); setShowAdd(true); setEditTarget(null); };

  return (
    <div>
      <Breadcrumb items={["Dashboard", "Courses"]} />

      <PageHeader
        title="Course Management"
        action={
          <ActionButton color="blue" icon={<Icons.Plus />} onClick={openAdd}>
            Add New Course
          </ActionButton>
        }
      />

      {/* Search */}
      <div className="mb-5 max-w-md relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icons.Search />
        </span>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="pl-9 bg-white"
        />
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div
            key={c.id || c.courseCode}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-opacity ${c.status !== false ? "border-gray-100" : "border-gray-200 opacity-70"
              }`}
          >
            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-blue-600 font-bold text-lg leading-none">{c.courseCode}</span>
                  <h3 className="font-semibold text-gray-800 mt-0.5">{c.courseName}</h3>
                </div>
                <Toggle checked={c.status !== false} onChange={() => toggleStatus(c.id)} />
              </div>

              {/* Meta */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Icons.Courses /> Semester {c.semester}, Year {c.year || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Icons.Students /> {c.enrolled || 0} / {c.capacity || "N/A"} students enrolled
                </div>
                <div className="text-xs text-gray-500">Credit Hours: {c.creditValue}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setViewCourse(c)}
                  className="flex-1 border border-gray-200 rounded-lg py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => { setNewCourse({ ...c, semester: String(c.semester || ""), year: String(c.year || ""), creditValue: String(c.creditValue || ""), capacity: String(c.capacity || "") }); setEditTarget(c.id); setShowAdd(true); }}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"
                >
                  <Icons.Edit />
                </button>
                <button
                  onClick={() => deleteCourse(c.id, c.courseCode)}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>

            {/* Status bar */}
            <div className={`px-5 py-2 text-xs font-medium ${c.status !== false ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
              Status: {c.status !== false ? "Active" : "Inactive"}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No courses match your search.</div>
      )}

      {/* ── Add / Edit Course Modal ── */}
      {showAdd && (
        <Modal
          title={editTarget ? "Edit Course" : "Add New Course"}
          onClose={() => { setShowAdd(false); setEditTarget(null); }}
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Course Code" required error={formErrors.courseCode}>
              <Input
                value={newCourse.courseCode}
                onChange={e => setField("courseCode", e.target.value)}
                placeholder="e.g. SE101"
                error={formErrors.courseCode}
              />
            </FormField>

            <FormField label="Course Name" required error={formErrors.courseName}>
              <Input
                value={newCourse.courseName}
                onChange={e => setField("courseName", e.target.value)}
                placeholder="e.g. Software Construction"
                error={formErrors.courseName}
              />
            </FormField>

            <FormField label="Degree Program" colSpan={2}>
              <Select value={newCourse.degree} onChange={e => setField("degree", e.target.value)}>
                {DEGREES.map(d => <option key={d}>{d}</option>)}
              </Select>
            </FormField>

            {[["Year", "year"], ["Semester", "semester"], ["Credit Hours", "creditValue"], ["Capacity", "capacity"]].map(([l, k]) => (
              <FormField key={k} label={l}>
                <Input
                  type="number"
                  min="1"
                  value={newCourse[k]}
                  onChange={e => setField(k, e.target.value)}
                />
              </FormField>
            ))}

            <FormField label="Description" colSpan={2}>
              <textarea
                value={newCourse.description}
                onChange={e => setField("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="Short course description…"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <ActionButton color="gray" onClick={() => { setShowAdd(false); setEditTarget(null); }} outline>
              Cancel
            </ActionButton>
            <ActionButton color="blue" onClick={handleAdd} icon={<Icons.Plus />}>
              {editTarget ? "Save Changes" : "Add Course"}
            </ActionButton>
          </div>
        </Modal>
      )}

      {/* ── View Course Modal ── */}
      {viewCourse && (
        <Modal title={`${viewCourse.courseCode} – ${viewCourse.courseName}`} onClose={() => setViewCourse(null)}>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {[
              ["Degree Program", viewCourse.degree || "N/A"],
              ["Academic Year", `Year ${viewCourse.year || "N/A"}`],
              ["Semester", `Semester ${viewCourse.semester}`],
              ["Credit Hours", viewCourse.creditValue],
              ["Capacity", viewCourse.capacity || "N/A"],
              ["Enrolled", viewCourse.enrolled || 0],
              ["Status", viewCourse.status !== false ? "Active" : "Inactive"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{k}</div>
                <div className="text-gray-800 font-medium mt-0.5 text-sm">{v}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {viewCourse.description || "No description provided."}
            </p>
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <ActionButton color="gray" onClick={() => setViewCourse(null)} outline>Close</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}