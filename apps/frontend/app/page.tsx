"use client";

import WatchList from "#components/watch-list";
import TransactionTable from "#components/transaction";
import GridTradingPresetList from "#components/grid-trading-preset/strategy-list";
import GridTradingPresetConfig from "#components/grid-trading-preset/strategy-config";
import GridTradingPresetTable from "#components/grid-trading-preset/strategy-preset-template";
import ConfigImportExport from "#components/config-import-export";
import Chart from "#components/charts";
import { Sidebar, SidebarContent, SidebarInput, SidebarInset, SidebarProvider, SidebarTrigger } from "@shadcn/ui/sidebar";
import GridTradingCombine from "#components/grid-trading-preset";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@shadcn/ui/resizable";

import { Button } from "@shadcn/ui/button";
import { MenuIcon } from "lucide-react";
import { AppSidebar } from "#components/side-bar/app-sidebar";
import { Separator } from "@shadcn/ui/separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@shadcn/ui/breadcrumb";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Inbox</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="aspect-video h-12 w-full rounded-lg bg-muted/50" />
      ))}
    </div>
  );
}
