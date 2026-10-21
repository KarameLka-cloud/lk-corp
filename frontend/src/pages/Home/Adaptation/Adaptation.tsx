import { JSX, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import DataMessage, {
  DataStateCenter,
} from "@/components/ui/custom/DataMessage";
import CareerDay from "@/components/ui/custom/CareerDay";
import Loader from "@/components/ui/custom/Loader";
import { Card, CardContent } from "@/components/ui/shadcn/card";

import { DAY_META_CHIP_CLASS } from "@/components/adaptation/dayCardMeta";
import AdaptationDaysView from "@/components/adaptation/AdaptationDaysView";
import {
  useGetMyAdaptationPlanQuery,
  useUpdateMyAdaptationInternCommentMutation,
  useUpdateMyAdaptationTaskStatusMutation,
} from "@/services/store/features/adaptation.ts";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import convertDate from "@/utils/convertDate.ts";
import type { TaskStatus } from "@/interfaces/api/AdaptationPlanType.ts";
import {
  hasAdaptationPlan,
  sortAdaptationDays,
} from "@/utils/adaptationPlan.ts";
import { toastMutationError } from "@/utils/apiError.ts";

type AdaptationViewType = "list" | "blocks";

function Adaptation(): JSX.Element {
  const [updateInternComment] = useUpdateMyAdaptationInternCommentMutation();
  const [updateTaskStatus] = useUpdateMyAdaptationTaskStatusMutation();
  const {
    data: plan,
    isLoading,
    isError,
  } = useGetMyAdaptationPlanQuery(undefined);
  const [viewType, setViewType] = useState<AdaptationViewType>("blocks");
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);

  const handleUpdateInternComment = async (
    dayId: number | undefined,
    comment: string,
  ): Promise<void> => {
    if (!dayId) return;

    try {
      await updateInternComment({ dayId, intern_comment: comment }).unwrap();
      toast.success("Комментарий сохранён");
    } catch (error) {
      toastMutationError(error, FORM_STATUS_MESSAGES.saveError);
      throw new Error("Save failed");
    }
  };

  const handleUpdateTaskStatus = async (
    dayId: number | undefined,
    taskId: number | undefined,
    status: TaskStatus,
  ): Promise<void> => {
    if (!dayId || !taskId) return;

    try {
      await updateTaskStatus({ dayId, taskId, status }).unwrap();
      toast.success(FORM_STATUS_MESSAGES.saveSuccess);
    } catch (error) {
      toastMutationError(error, FORM_STATUS_MESSAGES.saveError);
      throw new Error("Save failed");
    }
  };

  if (isLoading) {
    return (
      <DataStateCenter>
        <Loader />
      </DataStateCenter>
    );
  }
  if (isError) return <DataMessage type="error" centered />;
  if (!hasAdaptationPlan(plan)) {
    return (
      <DataMessage
        type="noData"
        centered
        message="План адаптации не назначен"
      />
    );
  }

  const adaptationDays = sortAdaptationDays(plan.days ?? []);
  const planInfo = [
    { label: "Начало стажировки", value: convertDate(plan.start_date) },
    { label: "График", value: plan.work_schedule ?? "—" },
    { label: "Смена", value: String(plan.shift ?? "—") },
    {
      label: "Наставник",
      value: plan.mentor_user?.name ?? `ID: ${plan.mentor}`,
    },
    {
      label: "Руководитель отделения",
      value:
        plan.supervisor_user?.name ??
        (plan.supervisor ? `ID: ${plan.supervisor}` : "—"),
    },
    {
      label: "Начальник отдела",
      value: plan.department_head_user?.name ?? `ID: ${plan.department_head}`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card className="py-0">
        <CardContent className="p-4">
          <dl className="flex flex-wrap items-stretch gap-2">
            {planInfo.map(({ label, value }) => (
              <div key={label} className={DAY_META_CHIP_CLASS}>
                <dt className="shrink-0 text-xs text-muted-foreground">
                  {label}
                </dt>
                <dd className="m-0 min-w-0 text-sm font-medium wrap-break-word">
                  {String(value ?? "—")}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {adaptationDays.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setViewType("blocks")}
              className={`
                flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all
                ${
                  viewType === "blocks"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }
              `}
            >
              <LayoutGrid className="size-4" />
              <span>Блоки</span>
            </button>
            <button
              type="button"
              onClick={() => setViewType("list")}
              className={`
                flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all
                ${
                  viewType === "list"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }
              `}
            >
              <List className="size-4" />
              <span>Список</span>
            </button>
          </div>
        </div>
      )}

      {viewType === "list" ? (
        adaptationDays.length > 0 ? (
          adaptationDays.map((day) => (
            <CareerDay
              key={day.id}
              day={day}
              onUpdateInternComment={handleUpdateInternComment}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          ))
        ) : (
          <DataMessage
            type="noData"
            centered
            message="🏅 План адаптации завершен"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm"
          />
        )
      ) : (
        <AdaptationDaysView
          days={adaptationDays}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
          onUpdateInternComment={handleUpdateInternComment}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      )}
    </div>
  );
}

export default Adaptation;
