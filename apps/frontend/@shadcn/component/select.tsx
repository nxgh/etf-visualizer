import { cn } from "@shadcn/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@shadcn/ui/select";

export interface SimpleSelectOption {
  label: string;
  value: string;
}

export interface SimpleSelectProps {
  value: string;
  onValueChange: (e: string, option: SimpleSelectOption) => void;
  options?: SimpleSelectOption[];
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export default function SimpleSelect(props: SimpleSelectProps) {
  const { value, onValueChange, options, placeholder, className, defaultValue } = props;
  function onChange(e: string) {
    onValueChange(e, options?.find((option) => option.value === e)!);
  }
  return (
    <Select value={value} onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(options || []).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
