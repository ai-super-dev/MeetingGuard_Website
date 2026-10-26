import { ImageResponse } from "next/og";

export const alt = "MeetingGuard: never miss what matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          background:
            "radial-gradient(50% 55% at 50% 40%, rgba(190,20,40,0.45), transparent 70%), #07070a",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
          MeetingGuard
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>
          <span>Never miss</span>
          <span style={{ color: "#a1a1aa" }}>what matters.</span>
        </div>
        <div style={{ fontSize: 32, marginTop: 32, color: "rgba(255,255,255,0.6)" }}>
          Say it. Confirm it. Never miss it.
        </div>
      </div>
    ),
    size,
  );
}
