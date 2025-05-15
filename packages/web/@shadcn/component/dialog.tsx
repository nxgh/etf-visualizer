import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shadcn/ui/dialog";

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export default function SimpleDialog({ open, setOpen, title, description, footer, children }: IProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[600px] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
