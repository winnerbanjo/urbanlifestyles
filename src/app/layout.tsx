import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Urbanlifestyles | Premium Fashion & Ready-to-Wear",
  description: "Discover curated ready-to-wear luxury fashion, dresses, sets, tops, and bottoms.",
  metadataBase: new URL("https://urbanlifestyles.ng"),
  openGraph: {
    title: "Urbanlifestyles | Fashion is Freedom",
    description: "Curated contemporary fashion storefront powered by Nile.",
    type: "website",
    locale: "en_NG",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#BDD2BF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF9F6] text-[#171717] antialiased flex flex-col selection:bg-[#BDD2BF] selection:text-[#171717]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
