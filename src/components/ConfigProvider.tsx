"use client";

import { createContext, useContext } from "react";

interface TimbreClientConfig {
  name: string;
  bio: string;
  brand: string;
  url: string;
  imageStyle: string;
  llm: { provider: string; model: string };
  imageProvider: string;
}

const ConfigContext = createContext<TimbreClientConfig | null>(null);

export function useConfig() {
  const config = useContext(ConfigContext);
  if (!config) throw new Error("Config not loaded");
  return config;
}

export function useConfigSafe() {
  return useContext(ConfigContext);
}

export default function ConfigProvider({
  config,
  children,
}: {
  config: TimbreClientConfig;
  children: React.ReactNode;
}) {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
