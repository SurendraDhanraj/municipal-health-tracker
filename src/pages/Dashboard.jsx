import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IssueCard from "../components/IssueCard";

const FILTERS = [
  { label: "All", value: null },
  { label: "Critical", value: "critical" },
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [quickSearch, setQuickSearch] = useState("");
  const stats = useQuery(api.issues.getStats);
  const issues = useQuery(api.issues.list, {
    status: activeFilter ?? undefined,
  });
  const seedDb = useMutation(api.seed.seedDatabase);

  const handleSeed = async () => {
    await seedDb();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate("/issues", { state: { search: quickSearch.trim() } });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="page-header glass">
        <div>
          <div className="label-sm text-muted" style={{ letterSpacing: "0.08em" }}>
            MUNICIPAL HEALTH DEPT
          </div>
          <div className="headline-sm" style={{ color: "var(--on-surface)" }}>
            Issue Tracker
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSeed}
          title="Seed with demo data"
          style={{ borderRadius: "var(--radius-full)" }}
        >
          ⚡ Seed Demo
        </button>
      </div>

      <div className="page-content">
        {/* Quick search */}
        <form onSubmit={handleSearch}>
          <div className="search-bar">
            <span style={{ color: "var(--outline)" }}>🔍</span>
            <input
              placeholder="Search issues by title, location, category…"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
            {quickSearch ? (
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: "var(--radius-full)", padding: "0.2rem 0.75rem" }}
              >
                Go
              </button>
            ) : null}
          </div>
        </form>

        {/* Stats */}
        {stats && (
          <div className="stat-grid">
            <div className="stat-tile critical">
              <span className="stat-number">{stats.critical}</span>
              <span className="stat-label">Critical</span>
            </div>
            <div className="stat-tile open">
              <span className="stat-number">{stats.open}</span>
              <span className="stat-label">Open</span>
            </div>
            <div className="stat-tile pending">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-tile resolved">
              <span className="stat-number">{stats.resolved}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div>
          <div className="section-header">
            <span className="title-md">Recent Issues</span>
            <Link to="/issues" className="label-md text-primary" style={{ textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div className="filter-row" style={{ marginBottom: "var(--sp-4)" }}>
            {FILTERS.map((f) => (
              <button
                key={f.label}
                className={`filter-chip ${activeFilter === f.value ? "active" : ""}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Issues list */}
          {issues === undefined ? (
            <div className="loading"><div className="spinner" /></div>
          ) : issues.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📋</span>
              <div className="title-sm">No issues found</div>
              <div className="body-sm text-muted">
                Tap "Seed Demo" above or add a new issue to get started.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
              {issues.slice(0, 8).map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link to="/new" className="fab" title="New Issue">
        +
      </Link>
    </>
  );
}
