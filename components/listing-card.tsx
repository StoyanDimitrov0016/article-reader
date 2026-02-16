import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  titleClassName?: string;
  badges?: ReactNode;
  description?: ReactNode;
  details?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function ListingCard({
  title,
  titleClassName,
  badges,
  description,
  details,
  actions,
  className,
}: Props) {
  return (
    <Card className={cn("h-full gap-3 py-0 shadow-xs", className)}>
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "text-lg font-semibold leading-tight text-foreground",
                titleClassName
              )}
            >
              {title}
            </h3>
            {badges}
          </div>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
          {details}
        </div>
        {actions ? <div className="mt-auto flex flex-wrap gap-1.5">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}
