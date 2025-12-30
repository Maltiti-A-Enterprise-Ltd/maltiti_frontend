import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import React from "react";

export const metadata: Metadata = {
  title: "Maltiti A. Enterprise Ltd",
  description: "Natural products from Ghana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body /* className={inter.className} */>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
