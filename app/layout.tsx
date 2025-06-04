import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";

import "#styles/global.css";
import SideBar from "#layouts/side-bar";

export const metadata: Metadata = {
  title: "ETF Visualizer",
  description: "网格交易分析、可视化",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex w-screen h-screen overflow-x-hidden">
        <NuqsAdapter>
          <AntdRegistry>
            <SideBar />
            <ConfigProvider theme={{ cssVar: true, hashed: false }}>{children}</ConfigProvider>
          </AntdRegistry>
        </NuqsAdapter>
      </body>
    </html>
  );
}
