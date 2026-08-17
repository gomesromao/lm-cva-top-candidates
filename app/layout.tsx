import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Top Candidates — Coconut VA",
  description:
    "A sample of the operators available right now. No pitch, no call required. Just look.",
  openGraph: {
    type: "website",
    title: "Top Candidates — Coconut VA",
    description: "Vetted specialists, ready to start now. Three profiles open — no gate.",
    siteName: "Coconut VA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
