"use client";

import { cn } from "@shadcn/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodeXml, Anchor } from "lucide-react";

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <SettingMenuPage />
      {children}
    </div>
  );
}

function SettingMenuPage() {
  const pathname = usePathname();

  const menus = [
    {
      name: "来源设置",
      href: "/setting/source",
      icon: <Anchor />,
    },
    {
      name: "数据管理",
      href: "/setting/data",
      icon: <CodeXml />,
    },
  ];

  return (
    <div className="w-[250px] h-full border-r border-gray-300 flex flex-col items-center p-4">
      {menus.map((menu) => (
        <Link
          href={menu.href}
          key={menu.href}
          className={cn(
            "flex items-center justify-center h-10 w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg text-slate-500 mb-2",
            pathname === menu.href ? "bg-gray-100 text-gray-800" : ""
          )}
        >
          {menu.icon}
          <span className="ml-2">{menu.name}</span>
        </Link>
      ))}
    </div>
  );
}
