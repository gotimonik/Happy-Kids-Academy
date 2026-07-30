import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    />
  );
}
