import { cn } from "@shadcn/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";

interface IProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}
export default function SimpleCard({ children, className, title, footer }: IProps) {
  return (
    <Card className={cn("w-[350px]", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
}
