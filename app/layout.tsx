import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Page",
  description: "Web Admin Page for Farmer Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
