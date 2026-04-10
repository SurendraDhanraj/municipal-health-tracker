import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewIssue() {
  const navigate = useNavigate();
  const categories = useQuery(api.categories.list);
  const workers = useQuery(api.workers.list);
  const createIssue = useMutation(api.issues.create);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    status: "open",
    priority: "medium",
    location: "",
    assignedTo: "",
    reportedBy: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.categoryId) e.categoryId = "Select a category";
    if (!form.location.trim()) e.location = "Required";
    if (!form.reportedBy.trim()) e.reportedBy = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const id = await createIssue({
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        status: form.status,
        priority: form.priority,
        location: form.location,
        assignedTo: form.assignedTo || undefined,
        reportedBy: form.reportedBy,
      });
      navigate(`/issues/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const PRIORITIES = ["low", "medium", "high"];
  const STATUSES = ["open", "pending", "critical"];

  return (
    <>
      <div className="page-header glass">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className="title-md">New Issue Report</span>
        <span style={{ width: 60 }} />
      </div>

      <div className="page-content">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>

          {/* Title */}
          <div className="input-group">
            <label className="input-label">Issue Title *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Suspected food contamination at…"
            />
            {errors.title && <span className="label-sm text-error">{errors.title}</span>}
          </div>

          {/* Category */}
          <div className="input-group">
            <label className="input-label">Category *</label>
            <select
              className="input-field"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">— Select category —</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="label-sm text-error">{errors.categoryId}</span>}
          </div>

          {/* Location */}
          <div className="input-group">
            <label className="input-label">Location / Address *</label>
            <input
              className="input-field"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. 24 High Street, Central District"
            />
            {errors.location && <span className="label-sm text-error">{errors.location}</span>}
          </div>

          {/* Priority */}
          <div className="input-group">
            <label className="input-label">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`btn btn-sm ${form.priority === p ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => set("priority", p)}
                  style={{ flex: 1 }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Status */}
          <div className="input-group">
            <label className="input-label">Initial Status</label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`btn btn-sm ${form.status === s ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => set("status", s)}
                  style={{ flex: 1 }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Assign to */}
          <div className="input-group">
            <label className="input-label">Assign To</label>
            <select
              className="input-field"
              value={form.assignedTo}
              onChange={(e) => set("assignedTo", e.target.value)}
            >
              <option value="">— Unassigned —</option>
              {workers?.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} — {w.role}
                </option>
              ))}
            </select>
          </div>

          {/* Reported By */}
          <div className="input-group">
            <label className="input-label">Reported By *</label>
            <input
              className="input-field"
              value={form.reportedBy}
              onChange={(e) => set("reportedBy", e.target.value)}
              placeholder="Your name or source"
            />
            {errors.reportedBy && <span className="label-sm text-error">{errors.reportedBy}</span>}
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Description *</label>
            <textarea
              className="input-field"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the issue in detail — observations, evidence, public risk…"
              rows={5}
            />
            {errors.description && <span className="label-sm text-error">{errors.description}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
            style={{ padding: "var(--sp-4)", fontSize: "1rem", borderRadius: "var(--radius-xl)" }}
          >
            {submitting ? "Submitting…" : "Submit Issue Report"}
          </button>
        </form>
      </div>
    </>
  );
}
