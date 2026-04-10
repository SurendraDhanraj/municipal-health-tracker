import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import IssueCard from "../components/IssueCard";

const STATUSES = ["all", "critical", "open", "pending", "resolved"];

export default function IssueList() {
  const location = useLocation();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState(location.state?.search ?? "");

  const issues = useQuery(api.issues.list, {
    status: status === "all" ? undefined : status,
  });

  const filtered = issues?.filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.category?.name?.toLowerCase().includes(q) ||
      i.reportedBy?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="page-header glass">
        <span className="headline-sm">All Issues</span>
        <Link to="/new" className="btn btn-primary btn-sm" style={{ borderRadius: "var(--radius-full)" }}>
          + New
        </Link>
      </div>

      <div className="page-content">
        {/* Search */}
        <div className="search-bar">
          <span style={{ color: "var(--outline)" }}>🔍</span>
          <input
            placeholder="Search by title, location, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus={false}
          />
          {search && (
            <button
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--outline)" }}
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search hint */}
        {search && (
          <div
            className="label-md"
            style={{
              color: "var(--primary)",
              background: "var(--primary-fixed)",
              borderRadius: "var(--radius-md)",
              padding: "var(--sp-2) var(--sp-3)",
            }}
          >
            🔍 Searching for "{search}"
          </div>
        )}

        {/* Status filter */}
        <div className="filter-row">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-chip ${status === s ? "active" : ""}`}
              onClick={() => setStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Count */}
        {filtered !== undefined && (
          <div className="label-md" style={{ color: search ? "var(--primary)" : "var(--on-surface-variant)" }}>
            {filtered.length} issue{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </div>
        )}

        {/* List */}
        {filtered === undefined ? (
          <div className="loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔎</span>
            <div className="title-sm">No results</div>
            <div className="body-sm text-muted">Try a different filter or search term.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {filtered.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
