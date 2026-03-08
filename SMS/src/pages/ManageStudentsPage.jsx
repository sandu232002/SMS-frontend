import { useState } from "react";
import { Icons } from "../components/Icons";
import {
  Breadcrumb, PageHeader, Card, Modal, Badge, EmptyState,
  ActionButton, Input, Select,
} from "../components/UI";

const DEGREES = ["All", "Software Engineering", "Computer Science", "Information Technology", "Business IT"];
const STATUSES = ["All", "Active", "Graduated", "Suspended"];

/**
 * ManageStudentsPage
 * Props:
 *   students: array
 *   onDelete: (id: string) => void
 *   onEdit:   (student: object) => void  (optional / wire up later)
 */
export default function ManageStudentsPage({ students, onDelete }) {
  const [search,       setSearch]       = useState("");
  const [filterDegree, setFilterDegree] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewStudent,  setViewStudent]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q)  ||
      s.id.toLowerCase().includes(q)         ||
      s.email.toLowerCase().includes(q);
    const matchDegree = filterDegree === "All" || s.degree === filterDegree;
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchDegree && matchStatus;
  });

  const gpaColor = gpa =>
    gpa >= 3.7 ? "text-green-600" : gpa >= 3.0 ? "text-blue-600" : "text-amber-600";

  const statusStyle = status => ({
    Active:    "bg-green-100 text-green-700",
    Graduated: "bg-blue-100 text-blue-700",
    Suspended: "bg-red-100 text-red-600",
  }[status] || "bg-gray-100 text-gray-600");

  return (
    <div>
      <Breadcrumb items={["Dashboard", "Manage Students"]} />

      <PageHeader
        title="Manage Students"
        subtitle={`${filtered.length} student${filtered.length !== 1 ? "s" : ""} found`}
      />

      <Card padding={false}>
        {/* Filters */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.Search />
            </span>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, email…"
              className="pl-9"
            />
          </div>

          <Select
            value={filterDegree}
            onChange={e => setFilterDegree(e.target.value)}
            className="w-auto"
          >
            {DEGREES.map(d => <option key={d}>{d}</option>)}
          </Select>

          <Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-auto"
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {["Student ID","Name","Degree Program","Year / Sem","GPA","Status","Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <EmptyState message="No students match your search or filters." />
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-blue-600 text-xs font-medium whitespace-nowrap">
                      {s.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-800">{s.firstName} {s.lastName}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{s.degree}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                      Year {s.year} / Sem {s.semester}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-bold ${gpaColor(s.gpa)}`}>{s.gpa.toFixed(1)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewStudent(s)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                          title="View"
                        >
                          <Icons.Eye />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"
                          title="Edit"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── View Student Modal ── */}
      {viewStudent && (
        <Modal title={`${viewStudent.firstName} ${viewStudent.lastName}`} onClose={() => setViewStudent(null)}>
          <div className="grid grid-cols-2 gap-5">
            {[
              ["Student ID",       viewStudent.id],
              ["Email",            viewStudent.email],
              ["Phone",            viewStudent.phone || "—"],
              ["Date of Birth",    viewStudent.dob],
              ["Degree Program",   viewStudent.degree],
              ["Year / Semester",  `Year ${viewStudent.year} / Semester ${viewStudent.semester}`],
              ["GPA",              viewStudent.gpa.toFixed(2)],
              ["Status",           viewStudent.status],
              ["City",             viewStudent.city || "—"],
              ["Enrolled Courses", viewStudent.enrolled?.join(", ") || "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{k}</div>
                <div className="text-gray-800 font-medium mt-0.5 text-sm">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <ActionButton color="gray" onClick={() => setViewStudent(null)} outline>Close</ActionButton>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteTarget(null)} size="sm">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete{" "}
            <strong className="text-gray-800">{deleteTarget.firstName} {deleteTarget.lastName}</strong>?
          </p>
          <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <ActionButton color="gray" onClick={() => setDeleteTarget(null)} outline>Cancel</ActionButton>
            <ActionButton
              color="red"
              onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null); }}
            >
              Delete Student
            </ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}