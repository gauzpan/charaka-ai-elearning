import type { MetadataRoute } from "next";

// Native web manifest for installability. Icons are the botanical emblem
// (public/app-logo.png, matching the Brandmark crop) centered on the canvas
// background, generated at 192/512 — the sizes required for full installability.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Charaka AI",
    short_name: "Charaka",
    description:
      "A workflow-first AI-literacy coach for healthcare professionals.",
    start_url: "/today",
    display: "standalone",
    background_color: "#081a19",
    theme_color: "#081a19",
    orientation: "portrait",
    // Both purposes per size: "any" for the general icon slot, "maskable" for
    // adaptive launchers (the emblem sits inside the safe zone on a solid canvas).
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
