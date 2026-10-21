import { JSX, ReactNode } from "react";
import { Inbox, AlertCircle, RefreshCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";

interface DataMessageProps {
  type: "noData" | "error";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  centered?: boolean;
}

interface StateConfig {
  icon: LucideIcon;
  iconBg: string;
  title: string;
}

const stateConfigs: Record<DataMessageProps["type"], StateConfig> = {
  noData: {
    icon: Inbox,
    iconBg: "bg-gray-100 text-gray-500",
    title: "Данные отсутствуют",
  },
  error: {
    icon: AlertCircle,
    iconBg: "bg-red-50 text-red-500",
    title: "Ошибка загрузки",
  },
};

function DataMessage({
  type,
  title,
  actionLabel = "Повторить",
  onAction,
  className,
  centered = false,
}: DataMessageProps): JSX.Element {
  const config = stateConfigs[type];
  const Icon = config.icon;

  const content = (
    <div
      className={cn("flex flex-col items-center gap-3 text-center", className)}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          config.iconBg,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900 text-base">
          {title ?? config.title}
        </h3>
      </div>

      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-1">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );

  if (!centered) return content;

  return (
    <div className="flex w-full flex-1 items-center justify-center py-8">
      {content}
    </div>
  );
}

export function DataStateCenter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default DataMessage;
