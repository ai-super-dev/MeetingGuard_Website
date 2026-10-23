import { ImageResponse } from "next/og";

export const alt = "MeetingGuard — Never miss what matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(130,80,255,0.55), transparent 70%), radial-gradient(60% 60% at 15% 70%, rgba(40,110,255,0.5), transparent 70%), linear-gradient(180deg, #030820, #0a1550)",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 10, color: "#22d8f5", textTransform: "uppercase" }}>
          Smarter meetings. A brighter you.
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 800, lineHeight: 1, marginTop: 24 }}>
          <span>Never miss</span>
          <span style={{ color: "#c9a2ff" }}>what matters.</span>
        </div>
        <div style={{ fontSize: 34, marginTop: 36, color: "#cbd5e1" }}>
          MeetingGuard — AI scheduling, critical alerts, one-tap join.
        </div>
      </div>
    ),
    size,
  );
}
