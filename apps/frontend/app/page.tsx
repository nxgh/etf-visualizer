import { Button } from "@shadcn/ui/button";
import { Calendar } from "@shadcn/ui/calendar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@shadcn/ui/command";

import SearchSecurity from "#components/search-security";

import localforage from "localforage";

export default async function Home({ operation }: { operation: React.ReactNode }) {
  // const posts = await getPosts("1599");
  // console.log(posts);
  return (
    <div className="w-full h-full">
      <main className="flex-1" />
      <div className="w-[270px] h-full border-l border-gray-200">{operation}</div>
    </div>
  );
}
