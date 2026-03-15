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
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const resetForm = () => {
    setFormErrors({});
    setFormData(defaultForm());
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
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
      if (editTarget) {
        await StudentService.updateDegreeProgram(editTarget.id, payload);
        await AuditService.logAction({
          adminId: 1,
          entityName: "DegreeProgram",
          entityId: editTarget.id || 0,
          actionType: "UPDATE",
          description: `Updated degree program ${payload.degreeName}`,
        });
      } else {
        const result = await StudentService.createDegreeProgram(payload);
        await AuditService.logAction({
          adminId: 1,
          entityName: "DegreeProgram",
          entityId: result.id || 0,
          actionType: "CREATE",
          description: `Created degree program ${payload.degreeName}`,
        });
      }
      closeModal();
      onRefreshDegreePrograms?.();
    } catch (err) {
      console.error("Failed to save degree program:", err);
      setFormErrors({ form: "Unable to save program right now." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await StudentService.deleteDegreeProgram(deleteTarget.id);
      await AuditService.logAction({
        adminId: 1,
        entityName: "DegreeProgram",
        entityId: deleteTarget.id || 0,
        actionType: "DELETE",
        description: `Deleted degree program ${deleteTarget.degreeName}`,
      });
      setDeleteTarget(null);
      onRefreshDegreePrograms?.();
    } catch (err) {
      console.error("Failed to delete degree program:", err);
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
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setFormData({
                      degreeName: program.degreeName || "",
                      departmentName: program.departmentName || "",
                      creditValue: program.creditValue || "",
                      durationYears: program.durationYears || "",
                    });
                    setEditTarget(program);
                    setModalOpen(true);
                  }}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"
                >
                  <Icons.Edit />
                </button>
                <button
                  onClick={() => setDeleteTarget(program)}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                >
                  <Icons.Trash />
                </button>
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
        <Modal title={editTarget ? "Edit Degree Program" : "Add Degree Program"} onClose={closeModal}>
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

      {deleteTarget && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteTarget(null)} size="sm">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete{" "}
            <strong className="text-gray-800">{deleteTarget.degreeName}</strong>?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <ActionButton color="gray" onClick={() => setDeleteTarget(null)} outline>Cancel</ActionButton>
            <ActionButton color="red" onClick={handleDelete}>Delete Program</ActionButton>
          </div>
        </Modal>
      )}
    </>
  );
}
