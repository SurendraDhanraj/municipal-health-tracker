import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { StatusChip, PriorityChip } from "../components/StatusChip";
import NoteMedia from "../components/NoteMedia";

const STATUSES = ["open", "pending", "resolved", "critical"];

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-TT", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const issue = useQuery(api.issues.get, { id });
  const workers = useQuery(api.workers.list);

  const updateStatus = useMutation(api.issues.updateStatus);
  const addNote = useMutation(api.issues.addNote);
  const assignWorker = useMutation(api.issues.assignWorker);
  const removeIssue = useMutation(api.issues.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Inspector");
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (issue === undefined) {
    return <div className="loading"><div className="spinner" /></div>;
  }
  if (!issue) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">❓</span>
        <div className="title-sm">Issue not found</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleMediaPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setMediaPreview({ url: ev.target.result, type: file.type });
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeNoteSheet = () => {
    setShowNoteSheet(false);
    setNoteText("");
    clearMedia();
  };

  const handleAddNote = async () => {
    if (!noteText.trim() && !mediaFile) return;
    setUploading(true);
    try {
      let storageId;
      let mediaType;

      if (mediaFile) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": mediaFile.type },
          body: mediaFile,
        });
        if (!res.ok) throw new Error("Upload failed");
        const { storageId: sid } = await res.json();
        storageId = sid;
        mediaType = mediaFile.type;
      }

      await addNote({
        id: issue._id,
        text: noteText.trim() || "(media attachment)",
        author: noteAuthor,
        ...(storageId ? { storageId, mediaType } : {}),
      });

      closeNoteSheet();
    } catch (err) {
      console.error(err);
      alert("Failed to save note. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await updateStatus({ id: issue._id, status: newStatus });
  };

  const handleDelete = async () => {
    if (confirm("Delete this issue? This cannot be undone.")) {
      await removeIssue({ id: issue._id });
      navigate("/issues");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="page-header glass">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <StatusChip status={issue.status} />
        <button className="btn btn-ghost btn-sm" onClick={handleDelete} style={{ color: "var(--error)" }}>
          🗑
        </button>
      </div>

      <div className="page-content">
        {/* Title block */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: "1.5rem" }}>{issue.category?.icon}</span>
            <span className="label-md" style={{ color: issue.category?.color, fontWeight: 700 }}>
              {issue.category?.name}
            </span>
          </div>
          <h1 className="headline-sm" style={{ color: "var(--on-surface)", marginBottom: "var(--sp-3)" }}>
            {issue.title}
          </h1>
          <div className="flex items-center gap-1 text-muted body-sm">
            <span>📍</span>
            <span>{issue.location}</span>
          </div>
        </div>

        {/* Meta info */}
        <div className="card-flat" style={{ padding: "var(--sp-4)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-4)" }}>
            <div>
              <div className="label-sm text-muted mb-2">Reported By</div>
              <div className="body-md">{issue.reportedBy}</div>
            </div>
            <div>
              <div className="label-sm text-muted mb-2">Priority</div>
              <PriorityChip priority={issue.priority} />
            </div>
            <div>
              <div className="label-sm text-muted mb-2">Created</div>
              <div className="body-sm">{formatDate(issue.createdAt)}</div>
            </div>
            <div>
              <div className="label-sm text-muted mb-2">Last Updated</div>
              <div className="body-sm">{timeAgo(issue.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="label-sm text-muted mb-2">Description</div>
          <div className="body-md" style={{ lineHeight: 1.7 }}>{issue.description}</div>
        </div>

        {/* Assigned Worker */}
        <div>
          <div className="label-sm text-muted mb-2">Assigned Inspector</div>
          <select
            className="input-field"
            value={issue.assignedTo ?? ""}
            onChange={(e) =>
              assignWorker({ id: issue._id, workerId: e.target.value || undefined })
            }
          >
            <option value="">— Unassigned —</option>
            {workers?.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} ({w.role})
              </option>
            ))}
          </select>
        </div>

        {/* Status Update */}
        <div>
          <div className="label-sm text-muted mb-2">Update Status</div>
          <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${issue.status === s ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handleStatusChange(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <div className="section-header">
            <span className="title-md">Activity</span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowNoteSheet(true)}
            >
              + Add Note
            </button>
          </div>

          {issue.notes.length === 0 ? (
            <div className="empty-state" style={{ padding: "var(--sp-6) 0" }}>
              <span style={{ fontSize: "1.5rem" }}>💬</span>
              <span className="body-sm text-muted">No notes yet</span>
            </div>
          ) : (
            <div className="timeline">
              {[...issue.notes].reverse().map((note, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="label-md" style={{ fontWeight: 700 }}>{note.author}</span>
                      <span className="label-sm text-muted">{timeAgo(note.timestamp)}</span>
                    </div>

                    {/* Media attachment */}
                    {note.storageId && (
                      <div style={{ marginBottom: "var(--sp-2)" }}>
                        <NoteMedia storageId={note.storageId} mediaType={note.mediaType} />
                      </div>
                    )}

                    {/* Note text — skip generic placeholder if media exists */}
                    {(note.text && note.text !== "(media attachment)") && (
                      <div className="body-md">{note.text}</div>
                    )}
                  </div>
                </div>
              ))}
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: "var(--outline-variant)" }} />
                <div className="body-sm text-muted">
                  Issue created — {formatDate(issue.createdAt)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Bottom Sheet */}
      {showNoteSheet && (
        <div className="sheet-overlay" onClick={closeNoteSheet}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="title-md" style={{ marginBottom: "var(--sp-5)" }}>Add Note</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
              {/* Author */}
              <div className="input-group">
                <label className="input-label">Your Name</label>
                <input
                  className="input-field"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="Inspector name"
                />
              </div>

              {/* Text */}
              <div className="input-group">
                <label className="input-label">Note</label>
                <textarea
                  className="input-field"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Describe your findings, actions taken…"
                  rows={3}
                />
              </div>

              {/* Media upload */}
              <div className="input-group">
                <label className="input-label">Attach Photo or Video</label>

                {/* Preview */}
                {mediaPreview && (
                  <div style={{ position: "relative", marginBottom: "var(--sp-2)" }}>
                    {mediaPreview.type.startsWith("video/") ? (
                      <video
                        src={mediaPreview.url}
                        style={{
                          width: "100%",
                          maxHeight: 220,
                          borderRadius: "var(--radius-lg)",
                          background: "#000",
                          display: "block",
                        }}
                        controls
                      />
                    ) : (
                      <img
                        src={mediaPreview.url}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: 220,
                          objectFit: "cover",
                          borderRadius: "var(--radius-lg)",
                          display: "block",
                        }}
                      />
                    )}
                    <button
                      onClick={clearMedia}
                      style={{
                        position: "absolute",
                        top: "var(--sp-2)",
                        right: "var(--sp-2)",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(7,30,39,0.7)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Pick button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaPick}
                  style={{ display: "none" }}
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="btn btn-secondary btn-full"
                  style={{ cursor: "pointer", justifyContent: "center" }}
                >
                  {mediaFile ? "📎 Change file" : "📷 Add photo / video"}
                </label>
                {mediaFile && (
                  <span className="label-sm text-muted" style={{ marginTop: "var(--sp-1)" }}>
                    {mediaFile.name}
                  </span>
                )}
              </div>

              {/* Upload progress indicator */}
              {uploading && (
                <div className="flex items-center gap-3">
                  <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  <span className="body-sm text-muted">Uploading…</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="btn btn-secondary btn-full"
                  onClick={closeNoteSheet}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleAddNote}
                  disabled={uploading || (!noteText.trim() && !mediaFile)}
                >
                  {uploading ? "Saving…" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
