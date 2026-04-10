import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/** Resolves a Convex storage ID and renders the media (image or video). */
export default function NoteMedia({ storageId, mediaType }) {
  const url = useQuery(api.files.getUrl, { storageId });

  if (!url) {
    return (
      <div
        style={{
          height: 120,
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-container)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--outline)",
          fontSize: "0.8rem",
        }}
      >
        Loading media…
      </div>
    );
  }

  const isVideo = mediaType?.startsWith("video/");

  if (isVideo) {
    return (
      <video
        src={url}
        controls
        style={{
          width: "100%",
          maxHeight: 300,
          borderRadius: "var(--radius-lg)",
          background: "#000",
          display: "block",
        }}
      />
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img
        src={url}
        alt="Note attachment"
        style={{
          width: "100%",
          maxHeight: 300,
          objectFit: "cover",
          borderRadius: "var(--radius-lg)",
          display: "block",
          cursor: "zoom-in",
        }}
      />
    </a>
  );
}
