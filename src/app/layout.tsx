import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ishaan Kejriwal",
  description:
    "Four things I built, turned into toys you can play. A balance belt for kids with cerebral palsy, a Kalman filter you can try to out-forecast, a docking puzzle from a drug screening app, and the tests clinical AI has to pass.",
  metadataBase: new URL("https://ishaankejriwal.com"),
  openGraph: {
    title: "Ishaan Kejriwal",
    description: "Four things I built, turned into toys you can play.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
