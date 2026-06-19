import { Call } from "@/types/Call";
import { View } from "react-native";
import { Text } from "../../ui/text";
import { THEME } from "@/lib/theme";
import { Link } from "expo-router";
import { Badge } from "../../ui/badge";
import clsx from "clsx";
import { Calendar, ChevronRight, University } from "lucide-react-native";

type CallCardProps = {
  call: Call;
};

export default function CallCard({ call }: CallCardProps) {
  return (
    <Link href={`/calls/${call.id}`}>
      <View className="bg-card border border-border rounded-2xl p-5 flex-row gap-2 mb-5">
        <View className="flex-col gap-2 flex-1">
          <View className="flex-row items-center gap-5">
            <Text className="text-primary">
              <University color={THEME.primary} />
            </Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold">{call.title}</Text>
              <Text className="text-xs text-muted">
                {call.institutionName}
              </Text>
            </View>
          </View>
          <View className="flex-col gap-2 py-2">
            <View className="flex-row gap-2 items-start">
              <Calendar size={13} color={THEME.muted} />
              <Text className="text-xs text-muted">
                {call.startDate.toLocaleDateString("pt-br")} -{" "}
                {call.endDate.toLocaleDateString("pt-br")}
              </Text>
            </View>
            <Text className="text-sm text-muted">
              {call.itens.map((i) => i.product).join(", ")}
            </Text>
          </View>
          <View className="flex-row gap-1 items-center">
            <Text className="self-start text-sm text-primary">
              Ver detalhes
            </Text>
            <ChevronRight size={15} color={THEME.primary} />
          </View>
        </View>
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
    </Link>
  );
}
