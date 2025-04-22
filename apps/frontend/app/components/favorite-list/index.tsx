import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@shadcn/ui/command";
import RemoveFavorite from "./remove-favorite";

export default async function FavoriteList() {
  const favoriteList = await (await fetch("http://localhost:3000/api/stock/favorite")).json();

  const handleRemoveFavorite = (code: string) => {
    fetch(`http://localhost:3000/api/stock/favorite?code=${code}`, {
      method: "DELETE",
    }).then(() => {
      //   toast.success("Remove favorite successfully");
      alert("Remove favorite successfully");
    });
  };

  return (
    <Command>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Favorite">
          {favoriteList.data.map((item) => (
            <CommandItem key={item.code} className="flex justify-between cursor-pointer">
              <span className="text-sm">{item.code}</span>
              <span className="text-sm">
                {item.name}
                <RemoveFavorite code={item.code} />
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
