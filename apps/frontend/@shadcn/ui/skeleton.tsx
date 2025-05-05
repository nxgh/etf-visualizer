import { cn } from "@shadcn/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
  wave?: boolean;
}

function Skeleton({ className, shimmer = false, wave = false, ...props }: SkeletonProps) {
  return (
    <div className={cn("rounded-md bg-gradient-to-r from-[#b2d7a4] via-[#dd88b3] to-[#fdedff] animate-gradient", className)} {...props} />
  );
}

export { Skeleton };
