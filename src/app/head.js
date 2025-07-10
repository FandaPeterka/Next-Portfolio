// app/head.js
export default function Head() {
  return (
    <>
      <title>František Peterka</title>
      <meta name="description" content="Portfolio aplikace…" />

      {/* Standardní favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* PNG favicons */}
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />

      {/* Android Chrome */}
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-chrome-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/android-chrome-512x512.png"
      />

      {/* Apple Touch */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Progressive Web App manifest */}
      <link rel="manifest" href="/site.webmanifest" />

      {/* Volitelné: barva horní lišty v mobilních browserech */}
      <meta name="theme-color" content="#2d3748" />
    </>
  );
}