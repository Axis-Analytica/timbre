import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#f97316",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontSize: 100,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Wave lines rendered as thin rotated/positioned divs */}
        <div
          style={{
            position: "absolute",
            top: 66,
            left: 0,
            width: 180,
            height: 2,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 0,
            width: 180,
            height: 2,
            background: "rgba(255,255,255,0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 114,
            left: 0,
            width: 180,
            height: 2,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <span style={{ position: "relative", marginTop: -8 }}>T</span>
      </div>
    ),
    { ...size }
  );
}
