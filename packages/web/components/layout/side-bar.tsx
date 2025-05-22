import { NavUser } from "#components/nav-user";
import { cn } from "@shadcn/lib/utils";
import { Gem, Shapes, Database } from "lucide-react";

import Link from "next/link";

const routes = [
  {
    name: "自选",
    href: "/favorite",
    icon: <Shapes className="!size-6 text-white" />,
    className: "mb-4 size-10 bg-black p-1 flex items-center justify-center rounded-lg",
  },
  {
    name: "Explore",
    href: "/explore",
    icon: <Gem className="size-6" />,
    className: "hover:bg-gray-200 rounded-lg",
  },
  {
    name: "Data Management",
    href: "/setting/data",
    icon: <Database className="size-6" />,
    className: "hover:bg-gray-200 rounded-lg",
  },
];

export default function SideBar() {
  return (
    <div className="w-14 flex flex-col items-center justify-between gap-2 bg-gray-50 py-8 border-r border-gray-300">
      <div>
        {routes.map((route) => (
          <Link href={route.href} className={cn("flex items-center mb-4 p-2 justify-center ", route.className)} key={route.href}>
            {route.icon}
          </Link>
        ))}
      </div>

      <NavUser />
    </div>
  );
}
