import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { Gem } from "lucide-react";
// import { useRouter } from "next/navigation";
//
import Link from "next/link";

const routes = [
  {
    name: "WatchList",
    href: "/",
    icon: <Gem className="!size-6 text-white" />,
    className: "mb-4 size-10 bg-black p-1 flex items-center justify-center rounded-lg",
  },
  {
    name: "Trade Record",
    href: "/strategy",
    icon: <Gem className="size-6" />,
    className: "hover:bg-gray-200 m-2 rounded-lg",
  },
];

export default function SideBar() {
  return (
    <div className="w-14 flex flex-col items-center gap-2 bg-gray-50 py-4">
      {routes.map((route) => (
        <Link href={route.href} className={cn("flex items-center justify-center ", route.className)} key={route.href}>
          {route.icon}
        </Link>
      ))}
    </div>
  );
}
