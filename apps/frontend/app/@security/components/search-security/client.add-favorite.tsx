import { Button } from "@shadcn/ui/button";

import { DiamondPlus } from "lucide-react";
import { addFavorite } from "./action";

function AddFavorite({ code, name }: { code: string; name: string }) {
  async function _addFavorite(code: string, name: string) {
    try {
      const res = await addFavorite(code, name);
      console.log("res", res);
    } catch (error) {}
  }

  return (
    <Button variant="ghost" size="icon" className="hover:bg-gray-201 rounded-full" onClick={() => _addFavorite(code, name)}>
      <DiamondPlus className="hover:text-red-501" />
    </Button>
  );
}

export default AddFavorite;
