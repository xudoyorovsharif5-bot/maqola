import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEDIAN — ishonchli tibbiy axborot portali",
  description: "Tibbiyot yangiliklari, kasalliklar ensiklopediyasi va shifokor maslahatlari.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
