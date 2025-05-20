import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/ui/tabs";
import { useState } from "react";

interface SimpleTabProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  onChange?: (value: string) => void;
}

export function SimpleTabs({ tabs, onChange }: SimpleTabProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const onValueChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={onValueChange} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            <span key={tab.label} className="text-sm font-medium">
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
