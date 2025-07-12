// app/layout.js
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL("https://www.frantisekpeterka.com"),

  title: "František Peterka Portfolio",
  description: "Portfolio aplikace s 3D efekty a interaktivními prvky",

  openGraph: {
    url: "https://www.frantisekpeterka.com/",
    siteName: "František Peterka Portfolio",
    locale: "cs_CZ",
    type: "website",
    title: "František Peterka Portfolio",
    description:
      "Portfolio aplikace s 3D efekty a interaktivními prvky představující projekty Františka Peterky.",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "František Peterka Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@tvojeTwitterUzivJmeno",
    creator: "@tvojeTwitterUzivJmeno",
    title: "František Peterka Portfolio",
    description:
      "Portfolio aplikace s 3D efekty a interaktivními prvky představující projekty Františka Peterky.",
    images: [
      {
        url: "/social-preview.png",
        alt: "František Peterka Portfolio Preview",
      },
    ],
  },

  icons: {
    icon: "/favicon.ico",
    icon16: { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    icon32: { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    android: { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    android512: { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
  },

  manifest: "/site.webmanifest",

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2d3748" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <ClientProviders>
          {children}
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
}
