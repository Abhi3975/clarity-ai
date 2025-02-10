import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClarityAI — Your Personal Truth Engine",
  description: "AI-powered information overload filter. Summarize, detect bias, and rank content based on what actually matters to you.",
  keywords: ["AI", "information filter", "news analyzer", "bias detection", "productivity"],
  openGraph: {
    title: "ClarityAI — Your Personal Truth Engine",
    description: "Cut through the noise. AI filters, ranks, and summarizes content based on your goals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
