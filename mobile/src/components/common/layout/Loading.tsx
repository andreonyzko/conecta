import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";

type LoadingProps = {
  text?: string;
};

export default function Loading({ text = "Carregando..." }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={THEME.primary} />
      <Text className="text-muted mt-2">{text}</Text>
    </View>
  );
}
