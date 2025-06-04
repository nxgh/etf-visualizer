import { cn } from "@shadcn/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";

interface IProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode | string;
  footer?: React.ReactNode;
}
export default function SimpleCard({ children, className, title, footer }: IProps) {
  return (
    <Card className={cn("w-full h-full flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
}
