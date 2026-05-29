import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hordeep // terminal",
  description: "Hordeep Gahlyan — student, builder, explorer.",
  openGraph: {
    title: "hordeep // terminal",
    description: "Hordeep Gahlyan — student, builder, explorer.",
    images: ["/og-image.png"],
    url: "https://intro-mocha.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "hordeep // terminal",
    description: "Hordeep Gahlyan — student, builder, explorer.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
