import type { Metadata } from "next";

import "#styles/global.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import SideBar from "#components/layout/side-bar";
import { getSyncDataAction } from "#actions/index";

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
            {children}
          </AntdRegistry>
        </NuqsAdapter>
      </body>
    </html>
  );
}
