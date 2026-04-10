const STATUS_CONFIG = {
  open: { label: "Open", className: "chip chip-open" },
  pending: { label: "Pending", className: "chip chip-pending" },
  resolved: { label: "Resolved", className: "chip chip-resolved" },
  critical: { label: "Critical", className: "chip chip-critical" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", className: "chip chip-low" },
  medium: { label: "Medium", className: "chip chip-medium" },
  high: { label: "High", className: "chip chip-high" },
};

export function StatusChip({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "chip" };
  return (
    <span className={config.className}>
      {status === "critical" && "● "}
      {config.label}
    </span>
  );
}

export function PriorityChip({ priority }) {
  const config = PRIORITY_CONFIG[priority] ?? { label: priority, className: "chip" };
  return <span className={config.className}>{config.label}</span>;
}
