import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const ROLE_COLORS = {
  Inspector: "var(--primary-fixed)",
  Supervisor: "var(--secondary-container)",
  Admin: "var(--tertiary-fixed)",
};

export default function WorkerProfile() {
  const workers = useQuery(api.workers.list);
  const allIssues = useQuery(api.issues.list, {});

  if (workers === undefined) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  const getWorkerIssueCount = (workerId) =>
    allIssues?.filter((i) => i.assignedTo === workerId).length ?? 0;

  return (
    <>
      <div className="page-header glass">
        <span className="headline-sm">Team Profile</span>
      </div>

      <div className="page-content">
        {/* Dept summary */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-container))",
            borderRadius: "var(--radius-xl)",
            padding: "var(--sp-6)",
            color: "var(--on-primary)",
          }}
        >
          <div className="label-sm" style={{ opacity: 0.8, letterSpacing: "0.08em", marginBottom: "var(--sp-2)" }}>
            MUNICIPAL HEALTH DEPT
          </div>
          <div className="headline-md">Environmental Health</div>
          <div className="body-md" style={{ opacity: 0.85, marginTop: "var(--sp-2)" }}>
            {workers.length} registered team members
          </div>
        </div>

        {/* Workers list */}
        <div>
          <div className="title-md mb-4">Team Members</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {workers.map((worker) => {
              const issueCount = getWorkerIssueCount(worker._id);
              return (
                <div key={worker._id} className="card" style={{ padding: "var(--sp-4)" }}>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: ROLE_COLORS[worker.role] ?? "var(--surface-container)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        color: "var(--on-surface)",
                        flexShrink: 0,
                      }}
                    >
                      {worker.initials}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="title-sm truncate">{worker.name}</div>
                      <div className="body-sm text-muted">{worker.email}</div>
                    </div>

                    {/* Role chip */}
                    <div>
                      <span
                        className="chip"
                        style={{
                          background: ROLE_COLORS[worker.role],
                          color: "var(--on-surface)",
                        }}
                      >
                        {worker.role}
                      </span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div
                    style={{
                      marginTop: "var(--sp-3)",
                      paddingTop: "var(--sp-3)",
                      paddingLeft: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span className="body-sm text-muted">{worker.department}</span>
                    <span className="label-md text-primary">
                      {issueCount} issue{issueCount !== 1 ? "s" : ""} assigned
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
