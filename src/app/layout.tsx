import type { Metadata } from "next";

import AppProviders from "@/providers/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "MOVING ADMIN",
  description: "MOVING 관리자 전용 프론트엔드",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="bg-background text-foreground min-h-full font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
