"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, Cog } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shadcn/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@shadcn/ui/sidebar";
import { Button } from "@shadcn/ui/button";
import Link from "next/link";

export function NavUser({
  user = {
    name: "test",
    email: "test@test.com",
    avatar: "",
  },
}: {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const dropdownMenus: { name: string; icon: React.ReactNode; href: string }[] | { name: string; icon: React.ReactNode }[][] = [
    // group
    // [
    //   {
    //     name: "Upgrade to Pro",
    //     icon: <Sparkles />,
    //   },
    // ],
    {
      name: "Setting",
      icon: <Cog />,
      href: "/setting",
    },
    // {
    //   name: "Billing",
    //   icon: <CreditCard />,
    // },
    // {
    //   name: "Notifications",
    //   icon: <Bell />,
    // },
    // {
    //   name: "Log out",
    //   icon: <LogOut />,
    // },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0 cursor-pointer">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="right" align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {dropdownMenus.map((menu, index) => {
          // 处理分组菜单
          if (Array.isArray(menu)) {
            return (
              <>
                <DropdownMenuGroup key={index}>
                  {menu.map((item, itemIndex) => (
                    <DropdownMenuItem key={`${index}-${itemIndex}`}>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <Link href={item.href}>
                          <span>{item.name}</span>
                        </Link>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            );
          }
          // 处理普通菜单项
          return (
            <DropdownMenuItem key={index}>
              <div className="flex items-center gap-2">
                {menu?.icon}
                <Link href={menu.href}>
                  <span>{menu.name}</span>
                </Link>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
