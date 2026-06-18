import { Call } from "@/types/Call";
import { View } from "react-native";
import { Text } from "../../ui/text";
import { Badge } from "../../ui/badge";
import clsx from "clsx";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { THEME } from "@/lib/theme";

type ResumedCallCardProps = {
  call: Call;
};

export default function ResumedCallCard({ call }: ResumedCallCardProps) {
  return (
    <Link href={`/calls/${call.id}`}>
      <View className="bg-card p-3 border border-border rounded-2xl flex-row items-center">
        <View className="flex-1 flex-col gap-2">
          <Text className="text-sm font-bold">{call.title}</Text>
          <Badge
            className={clsx(
              "self-start py-1",
              call.status === "active" && "bg-primary/30",
              (call.status === "canceled" || call.status === "closed") &&
                "bg-muted/30"
            )}
          >
            <Text
              className={clsx(
                call.status === "active" && "text-primary",
                (call.status === "canceled" || call.status === "closed") &&
                  "text-muted"
              )}
            >
              {call.status === "active"
                ? "Ativa"
                : call.status === "closed"
                  ? "Encerrada"
                  : "Cancelada"}
            </Text>
          </Badge>
        </View>
        <ChevronRight size={15} color={THEME.muted} />
      </View>
    </Link>
  );
}
