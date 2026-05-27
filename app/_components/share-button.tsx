"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ShareButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Button
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("URL이 복사되었습니다.");
      }}
    >
      {children}
    </Button>
  );
}

export default ShareButton;
