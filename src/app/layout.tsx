import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import ConfigProvider from "@/components/ConfigProvider";
import { configExists, getConfig } from "@/lib/config";

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
    <html lang="en">
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
