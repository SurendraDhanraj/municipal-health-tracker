import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function AdminPanel() {
  const categories = useQuery(api.categories.list);
  const workers = useQuery(api.workers.list);
  const createCategory = useMutation(api.categories.create);
  const removeCategory = useMutation(api.categories.remove);
  const createWorker = useMutation(api.workers.create);
  const removeWorker = useMutation(api.workers.remove);

  const [catForm, setCatForm] = useState({ name: "", icon: "📌", color: "#003f87", description: "" });
  const [workerForm, setWorkerForm] = useState({ name: "", role: "Inspector", email: "", department: "" });
  const [tab, setTab] = useState("categories");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    await createCategory(catForm);
    setCatForm({ name: "", icon: "📌", color: "#003f87", description: "" });
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!workerForm.name.trim()) return;
    const initials = workerForm.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    await createWorker({ ...workerForm, initials });
    setWorkerForm({ name: "", role: "Inspector", email: "", department: "" });
  };

  return (
    <>
      <div className="page-header glass">
        <span className="headline-sm">Admin Panel</span>
      </div>

      <div className="page-content">
        {/* Tab toggle */}
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${tab === "categories" ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1 }}
            onClick={() => setTab("categories")}
          >
            Categories
          </button>
          <button
            className={`btn btn-sm ${tab === "workers" ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1 }}
            onClick={() => setTab("workers")}
          >
            Team Members
          </button>
        </div>

        {tab === "categories" && (
          <>
            {/* Add category form */}
            <div className="card-flat" style={{ padding: "var(--sp-4)" }}>
              <div className="title-sm mb-4">Add Category</div>
              <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                <div className="flex gap-2">
                  <div className="input-group" style={{ width: 80 }}>
                    <label className="input-label">Icon</label>
                    <input className="input-field" value={catForm.icon} onChange={(e) => setCatForm((f) => ({ ...f, icon: e.target.value }))} placeholder="🏷️" style={{ textAlign: "center" }} />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Name *</label>
                    <input className="input-field" value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))} placeholder="Category name" />
                  </div>
                  <div className="input-group" style={{ width: 56 }}>
                    <label className="input-label">Color</label>
                    <input type="color" className="input-field" value={catForm.color} onChange={(e) => setCatForm((f) => ({ ...f, color: e.target.value }))} style={{ padding: "var(--sp-1)", height: 44, cursor: "pointer" }} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Description</label>
                  <input className="input-field" value={catForm.description} onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
                </div>
                <button type="submit" className="btn btn-primary">Add Category</button>
              </form>
            </div>

            {/* Categories list */}
            <div>
              <div className="title-sm mb-4">Current Categories ({categories?.length ?? 0})</div>
              {categories === undefined ? (
                <div className="loading"><div className="spinner" /></div>
              ) : categories.length === 0 ? (
                <div className="empty-state" style={{ padding: "var(--sp-6) 0" }}>
                  <span className="body-sm text-muted">No categories yet</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                  {categories.map((cat) => (
                    <div key={cat._id} className="card" style={{ padding: "var(--sp-3) var(--sp-4)" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: "1.25rem" }}>{cat.icon}</span>
                          <div>
                            <div className="label-md" style={{ fontWeight: 700, color: cat.color }}>{cat.name}</div>
                            <div className="body-sm text-muted">{cat.description}</div>
                          </div>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: "var(--error)" }}
                          onClick={() => removeCategory({ id: cat._id })}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "workers" && (
          <>
            {/* Add worker form */}
            <div className="card-flat" style={{ padding: "var(--sp-4)" }}>
              <div className="title-sm mb-4">Add Team Member</div>
              <form onSubmit={handleAddWorker} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input className="input-field" value={workerForm.name} onChange={(e) => setWorkerForm((f) => ({ ...f, name: e.target.value }))} placeholder="First Last" />
                </div>
                <div className="flex gap-2">
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Role</label>
                    <select className="input-field" value={workerForm.role} onChange={(e) => setWorkerForm((f) => ({ ...f, role: e.target.value }))}>
                      <option>Inspector</option>
                      <option>Supervisor</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input className="input-field" value={workerForm.email} onChange={(e) => setWorkerForm((f) => ({ ...f, email: e.target.value }))} placeholder="name@municipal.gov" />
                </div>
                <div className="input-group">
                  <label className="input-label">Department</label>
                  <input className="input-field" value={workerForm.department} onChange={(e) => setWorkerForm((f) => ({ ...f, department: e.target.value }))} placeholder="e.g. Food Safety Division" />
                </div>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </form>
            </div>

            {/* Workers list */}
            <div>
              <div className="title-sm mb-4">Team Members ({workers?.length ?? 0})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {workers?.map((w) => (
                  <div key={w._id} className="card" style={{ padding: "var(--sp-3) var(--sp-4)" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary-fixed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>
                          {w.initials}
                        </div>
                        <div>
                          <div className="label-md" style={{ fontWeight: 700 }}>{w.name}</div>
                          <div className="body-sm text-muted">{w.role} · {w.department}</div>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} onClick={() => removeWorker({ id: w._id })}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
