import type { Metadata } from "next";

import "#styles/global.css";
import MainHeader from "#components/layouts/header";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "交易记录",
  description: "交易记录",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}>) {
  const resolvedParams = await params;

  return (
    <Fragment>
      <MainHeader title="交易记录" breadcrumbPage={resolvedParams.code} />
      {children}
    </Fragment>
  );
}
