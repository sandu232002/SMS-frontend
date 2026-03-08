import { useState } from "react";
import { Icons } from "../components/Icons";
import {
  Breadcrumb, Card, SectionHeading, FormField, Input, Select,
  ActionButton,
} from "../components/UI";

const DEGREES   = ["Software Engineering", "Computer Science", "Information Technology", "Business IT"];
const YEARS     = [1, 2, 3, 4];
const SEMESTERS = [1, 2];

function generateId() {
  return `KDU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

/**
 * RegisterStudentPage
 * Props:
 *   onRegister: (studentData: object) => void
 *   onCancel:   () => void
 */
export default function RegisterStudentPage({ onRegister, onCancel }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "",
    studentId: generateId(),
    email: "", phone: "",
    address: "", address2: "", city: "", postal: "",
    degree: DEGREES[0], year: "1", semester: "1", gpa: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim())  e.lastName  = "Last name is required.";
    if (!form.dob)              e.dob       = "Date of birth is required.";
    if (!form.email.trim())     e.email     = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onRegister({ ...form, year: +form.year, semester: +form.semester });
  };

  // Helper for simple text / date inputs
  const field = (label, key, opts = {}) => (
    <FormField
      label={label}
      error={errors[key]}
      hint={opts.hint}
      required={opts.required}
      colSpan={opts.full ? 2 : 1}
    >
      <Input
        type={opts.type || "text"}
        value={form[key]}
        onChange={e => { set(key, e.target.value); setErrors(p => ({ ...p, [key]: "" })); }}
        placeholder={opts.placeholder || ""}
        error={errors[key]}
      />
    </FormField>
  );

  return (
    <div>
      <Breadcrumb items={["Dashboard", "Register New Student"]} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Student</h1>

      <Card>
        <div className="space-y-8">

          {/* ── Personal Information ── */}
          <section>
            <SectionHeading icon={<Icons.User />}>Personal Information</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              {field("First Name", "firstName", { required: true, placeholder: "Enter first name" })}
              {field("Last Name",  "lastName",  { required: true, placeholder: "Enter last name"  })}
              {field("Date of Birth", "dob", { type: "date", required: true })}

              {/* Student ID with regenerate button */}
              <FormField
                label="Student ID Number"
                required
                hint="Valid Student ID format: KDU-YYYY-XXX"
              >
                <div className="flex gap-2">
                  <Input
                    value={form.studentId}
                    onChange={e => set("studentId", e.target.value)}
                  />
                  <button
                    onClick={() => set("studentId", generateId())}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors shrink-0"
                    title="Generate new ID"
                  >
                    <Icons.Refresh />
                  </button>
                </div>
              </FormField>
            </div>
          </section>

          {/* ── Contact Information ── */}
          <section>
            <SectionHeading icon={<Icons.Location />}>Contact Information</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Address Line 1" colSpan={2}>
                <Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main Street" />
              </FormField>
              <FormField label="Address Line 2 (Optional)" colSpan={2}>
                <Input value={form.address2} onChange={e => set("address2", e.target.value)} placeholder="Apartment, suite, etc." />
              </FormField>
              {field("City",        "city",   { placeholder: "City" })}
              {field("Postal Code", "postal", { placeholder: "00000" })}
              {field("Email",  "email",  { type: "email", required: true, placeholder: "student@kdu.edu" })}
              {field("Phone",  "phone",  { placeholder: "+94 XX XXX XXXX" })}
            </div>
          </section>

          {/* ── Academic Information ── */}
          <section>
            <SectionHeading icon={<Icons.BookOpen />}>Academic Information</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Degree Program" required colSpan={2}>
                <Select value={form.degree} onChange={e => set("degree", e.target.value)}>
                  {DEGREES.map(d => <option key={d}>{d}</option>)}
                </Select>
              </FormField>

              <FormField label="Academic Year">
                <Select value={form.year} onChange={e => set("year", e.target.value)}>
                  {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                </Select>
              </FormField>

              <FormField label="Semester">
                <Select value={form.semester} onChange={e => set("semester", e.target.value)}>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </Select>
              </FormField>

              {field("Initial GPA (Optional)", "gpa", { type: "number", placeholder: "0.00" })}
            </div>
          </section>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <ActionButton color="gray" onClick={onCancel} outline>
              Cancel
            </ActionButton>
            <ActionButton color="blue" onClick={handleSubmit} icon={<Icons.Register />}>
              Register Student
            </ActionButton>
          </div>

        </div>
      </Card>
    </div>
  );
}