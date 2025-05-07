import * as React from "react";

interface LayoutContextValue {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

function useLayout() {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a Layout");
  }
  return context;
}

interface LayoutProps {
  children: React.ReactNode;
}

function LeftExpandableLayout({ children }: LayoutProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <LayoutContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="w-full h-full flex ">{children}</div>
    </LayoutContext.Provider>
  );
}

export { LeftExpandableLayout, useLayout };
