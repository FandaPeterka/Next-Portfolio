import "./globals.css";
import ClientProviders from "./ClientProviders"; // Cesta dle vašeho aliasu
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "František Peterka",
  description: "Portfolio aplikace s 3D efekty a interaktivními prvky",
  metadataBase: new URL("https://www.frantisekpeterka.com"), // Nastavte svoji produkční URL
  openGraph: {
    title: "František Peterka Portfolio",
    description: "Portfolio aplikace s 3D efekty a interaktivními prvky představující projekty Františka Peterky.",
    type: "website",
    // Můžete přidat také `images` pole, pokud máte konkrétní obrázky pro OG.
  },
  twitter: {
    card: "summary_large_image",
    title: "František Peterka Portfolio",
    description: "Portfolio aplikace s 3D efekty a interaktivními prvky představující projekty Františka Peterky.",
    // Rovněž lze přidat obrázky pro Twitter.
  },
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