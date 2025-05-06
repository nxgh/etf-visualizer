"use client";

import * as React from "react";
import { ArchiveX, Command, File, Inbox, Send, Trash2, ChartLine, Shapes } from "lucide-react";

import { NavUser } from "./nav-user";
import { Label } from "@shadcn/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@shadcn/ui/sidebar";
import { Switch } from "@shadcn/ui/switch";
import { useQueryState } from "nuqs";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "ChartLine",
      url: "#",
      icon: ChartLine,
      isActive: true,
    },

    {
      title: "Drafts",
      url: "#",
      icon: Shapes,
      isActive: false,
    },
    // {
    //   title: "Sent",
    //   url: "#",
    //   icon: Send,
    //   isActive: false,
    // },
    // {
    //   title: "Junk",
    //   url: "#",
    //   icon: ArchiveX,
    //   isActive: false,
    // },
    // {
    //   title: "Trash",
    //   url: "#",
    //   icon: Trash2,
    //   isActive: false,
    // },
  ],
};

export function AppSidebar({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);

  const { setOpen } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        {/* <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader> */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  );
}

export function LayoutAppSidebar({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.

  const [q, setQuery] = useQueryState("q");

  return (
    <SidebarProvider style={{ "--sidebar-width": "200px" } as React.CSSProperties}>
      <AppSidebar />
    </SidebarProvider>
  );
}
