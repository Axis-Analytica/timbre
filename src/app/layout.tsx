import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import ConfigProvider from "@/components/ConfigProvider";
import { configExists, getConfig } from "@/lib/config";

const displayFont = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Timbre",
  description: "Voice-driven writing tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasConfig = configExists();
  const config = hasConfig ? getConfig() : null;

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <link rel="stylesheet" href="/api/theme" />
      </head>
      <body>
        {config ? (
          <ConfigProvider config={config}>
            <LayoutShell>{children}</LayoutShell>
          </ConfigProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
