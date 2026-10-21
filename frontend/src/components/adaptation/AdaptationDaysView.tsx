import { JSX } from "react";
import { CheckCircle, AlertCircle, CalendarClock } from "lucide-react";
import type {
  AdaptationPlanDayType,
  TaskStatus,
} from "@/interfaces/api/AdaptationPlanType.ts";
import {
  COMPLETION_STATUS_BG_LIGHT,
  COMPLETION_STATUS_TEXT,
} from "@/components/adaptation/dayCardMeta";
import { formatDayRange } from "@/utils/formatDayRange.ts";
import CareerDay from "@/components/ui/custom/CareerDay";

interface AdaptationDaysViewProps {
  days: AdaptationPlanDayType[];
  selectedDayId: number | null;
  onSelectDay: (dayId: number | null) => void;
  onUpdateInternComment?: (
    dayId: number | undefined,
    comment: string,
  ) => Promise<void> | void;
  onUpdateTaskStatus?: (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ) => Promise<void> | void;
}

const STATUS_ICON: Record<AdaptationPlanDayType["completion"], JSX.Element> = {
  "в процессе": <CalendarClock className="size-3.5" />,
  выполнен: <CheckCircle className="size-3.5" />,
  "есть замечания": <AlertCircle className="size-3.5" />,
};

function AdaptationDaysView({
  days,
  selectedDayId,
  onSelectDay,
  onUpdateInternComment,
  onUpdateTaskStatus,
}: AdaptationDaysViewProps): JSX.Element {
  if (days.length === 0) return <></>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const isSelected = selectedDayId === day.id;
          const bgColorLight = COMPLETION_STATUS_BG_LIGHT[day.completion];
          const textColor = COMPLETION_STATUS_TEXT[day.completion];
          const dayNumber = formatDayRange(
            day.day_from,
            day.day_to,
            day.work_day,
          );

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => !isSelected && onSelectDay(day.id)}
              className={`
                flex size-12 flex-col items-center justify-center gap-0.5 rounded-lg border transition-all
                ${bgColorLight}
                ${isSelected ? "border-[3px] shadow-md" : "border-border/30"}
              `}
              title={`День ${dayNumber}: ${day.completion}`}
            >
              <span className="text-sm font-semibold text-primary">
                {dayNumber}
              </span>
              <span className={textColor}>{STATUS_ICON[day.completion]}</span>
            </button>
          );
        })}
      </div>

      {selectedDayId && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          {days
            .filter((d) => d.id === selectedDayId)
            .map((day) => (
              <CareerDay
                key={day.id}
                day={day}
                onUpdateInternComment={onUpdateInternComment}
                onUpdateTaskStatus={onUpdateTaskStatus}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default AdaptationDaysView;
