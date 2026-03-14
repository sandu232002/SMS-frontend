import { useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import {
  Breadcrumb,
  PageHeader,
  Card,
  Input,
  ActionButton,
  Modal,
  FormField
} from "../components/UI";
import StudentService from "../api/studentService";
import AuditService from "../api/auditService";

const defaultForm = () => ({
  degreeName: "",
  departmentName: "",
  creditValue: "",
  durationYears: "",
});

export default function DegreeProgramsPage({
  degreePrograms = [],
  onRefreshDegreePrograms,
  loading,
}) {
  const [search, setSearch] = useState("");
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

  const filteredPrograms = useMemo(() => {
    if (!search) return degreePrograms;
    return degreePrograms.filter(program =>
      program.degreeName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [degreePrograms, search]);

  const handleSave = async () => {
    const errors = {};
    if (!formData.degreeName.trim()) errors.degreeName = "Degree name is required.";
    if (!formData.departmentName.trim()) errors.departmentName = "Department is required.";
    if (!formData.creditValue) errors.creditValue = "Credit value is required.";
    if (!formData.durationYears) errors.durationYears = "Duration is required.";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        degreeName: formData.degreeName.trim(),
        departmentName: formData.departmentName.trim(),
        creditValue: Number(formData.creditValue),
        durationYears: Number(formData.durationYears),
      };
      const result = await StudentService.createDegreeProgram(payload);
      await AuditService.logAction({
        adminId: 1,
        entityName: "DegreeProgram",
        entityId: result.id || 0,
        actionType: "CREATE",
        description: `Created degree program ${payload.degreeName}`,
      });
      closeModal();
      onRefreshDegreePrograms?.();
    } catch (err) {
      console.error("Failed to save degree program:", err);
      setFormErrors({ form: "Unable to save program right now." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Breadcrumb items={["Dashboard", "Degree Programs"]} />
      <PageHeader
        title="Degree Programs"
        subtitle="List, review, and add academic programs that students can register for."
        action={
          <ActionButton icon={<Icons.Plus />} onClick={() => setModalOpen(true)} disabled={loading}>
            Add Program
          </ActionButton>
        }
      />

      <div className="mb-4 max-w-md">
        <label className="text-xs font-semibold tracking-wide text-gray-500 mb-1 block">Search programs</label>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type a degree name"
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPrograms.length ? (
          filteredPrograms.map(program => (
            <Card key={program.id || program.degreeName}>
              <div className="flex justify-between items-start gap-3 mb-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Degree</div>
                  <h3 className="text-lg font-semibold text-gray-800">{program.degreeName}</h3>
                </div>
                <span className="text-xs font-semibold uppercase text-gray-500">
                  {program.durationYears || "—"} yrs
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{program.departmentName}</div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                <Icons.BookOpen />
                <span>Credits</span>
                <span className="font-bold text-gray-800">{program.creditValue ?? "—"}</span>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center text-gray-400">
            No degree programs match the current search.
          </Card>
        )}
      </div>

      {modalOpen && (
        <Modal title="Add Degree Program" onClose={closeModal}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Degree Name" required error={formErrors.degreeName}>
              <Input
                value={formData.degreeName}
                onChange={e => setFormData(f => ({ ...f, degreeName: e.target.value }))}
              />
            </FormField>
            <FormField label="Department" required error={formErrors.departmentName}>
              <Input
                value={formData.departmentName}
                onChange={e => setFormData(f => ({ ...f, departmentName: e.target.value }))}
              />
            </FormField>
            <FormField label="Credit Value" required error={formErrors.creditValue}>
              <Input
                type="number"
                min="0"
                value={formData.creditValue}
                onChange={e => setFormData(f => ({ ...f, creditValue: e.target.value }))}
              />
            </FormField>
            <FormField label="Duration (years)" required error={formErrors.durationYears}>
              <Input
                type="number"
                min="1"
                value={formData.durationYears}
                onChange={e => setFormData(f => ({ ...f, durationYears: e.target.value }))}
              />
            </FormField>
          </div>
          {formErrors.form && <p className="text-xs text-red-500 mt-3">{formErrors.form}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <ActionButton color="gray" outline onClick={closeModal}>
              Cancel
            </ActionButton>
            <ActionButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Program"}
            </ActionButton>
          </div>
        </Modal>
      )}
    </>
  );
}
