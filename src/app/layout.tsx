import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worship Music Poll — Blind Listening Test",
  description: "A blind listening test for worship song arrangements. Listen, compare, and vote — completely unbiased.",
  keywords: ["worship", "music", "poll", "blind test", "voting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div id="audio-root" />
        {children}
      </body>
    </html>
  );
}
