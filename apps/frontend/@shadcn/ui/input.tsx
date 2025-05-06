import * as React from "react";

import { cn } from "@shadcn/lib/utils";
import { Eraser } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { onClear?: () => void }>(
  ({ className, type, value, onChange, onClear, ...props }, ref) => {
    const handleClear = () => {
      if (onChange && (!type || type === "text")) {
        const event = {
          target: {
            value: "",
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
        onClear?.();
      }
    };

    return (
      <div className={cn("relative m-0 group", className)}>
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          value={value}
          onChange={onChange}
          ref={ref}
          {...props}
        />

        <Eraser
          className={cn(
            "hidden  absolute right-2 top-[30%] w-[12px] h-[12px] cursor-pointer",
            (!type || type === "text") && "group-hover:block",
            (!type || type === "text") && value !== "" && "block"
          )}
          onClick={handleClear}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
