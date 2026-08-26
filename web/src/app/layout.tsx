import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { MixpanelClientInit } from "@/components/analytics/MixpanelClientInit";

// Primary UI typeface (body, labels, controls, nav, card titles). Replaces
// Geist Sans for mobile readability — see design/design.md §6.2.
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Modern geometric display face for headings / wordmark.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "A workflow-first AI-literacy coach for healthcare professionals. Learn by doing, in two-minute rounds.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Charaka AI",
  description,
  applicationName: "Charaka AI",
  appleWebApp: { capable: true, title: "Charaka AI", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/app-logo.svg", type: "image/svg+xml" },
      { url: "/app-logo.ico", sizes: "any" },
    ],
    apple: "/app-logo.svg",
  },
  // Link preview for shared/referral URLs (LinkedIn, X, etc.).
  openGraph: {
    title: "Charaka AI",
    description,
    siteName: "Charaka AI",
    type: "website",
    images: [{ url: "/app-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charaka AI",
    description,
    images: ["/app-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#081a19" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Applies the persisted theme before first paint so there's no flash. When no
// explicit choice is stored, data-theme stays unset and CSS follows the device.
const themeScript = `try{var t=localStorage.getItem('charaka.theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ServiceWorkerRegister />
        <MixpanelClientInit />
        {children}
      </body>
    </html>
  );
}
