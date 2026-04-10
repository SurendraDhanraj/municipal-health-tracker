import { useNavigate } from "react-router-dom";
import { StatusChip } from "./StatusChip";

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default function IssueCard({ issue }) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => navigate(`/issues/${issue._id}`)}
      style={{ cursor: "pointer", padding: "1.25rem" }}
    >
      {/* Row 1: Category icon + title + date */}
      <div className="flex items-center justify-between gap-2" style={{ marginBottom: "0.5rem" }}>
        <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
            {issue.category?.icon ?? "📋"}
          </span>
          <span className="title-sm truncate" style={{ color: "var(--on-surface)" }}>
            {issue.title}
          </span>
        </div>
        <span className="label-sm text-muted" style={{ flexShrink: 0 }}>
          {timeAgo(issue.createdAt)}
        </span>
      </div>

      {/* Row 2: Location */}
      <div
        className="flex items-center gap-1 text-muted body-sm"
        style={{ marginBottom: "0.75rem", paddingLeft: "1.75rem" }}
      >
        <span style={{ fontSize: "0.8rem" }}>📍</span>
        <span className="truncate">{issue.location}</span>
      </div>

      {/* Row 3: Status + category label + assigned */}
      <div
        className="flex items-center justify-between"
        style={{ paddingLeft: "1.75rem" }}
      >
        <div className="flex items-center gap-2">
          <StatusChip status={issue.status} />
          {issue.category && (
            <span
              className="chip"
              style={{
                background: `${issue.category.color}22`,
                color: issue.category.color,
              }}
            >
              {issue.category.name}
            </span>
          )}
        </div>
        {issue.worker && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--primary-fixed)",
              color: "var(--on-primary-fixed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.625rem",
              fontWeight: 700,
              fontFamily: "var(--font-label)",
            }}
            title={issue.worker.name}
          >
            {issue.worker.initials}
          </div>
        )}
      </div>
    </div>
  );
}
