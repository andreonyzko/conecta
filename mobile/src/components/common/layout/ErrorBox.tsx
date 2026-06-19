import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { AlertCircle } from "lucide-react-native";

type ErrorBoxProps = {
  error: string;
};

export default function ErrorBox({ error }: ErrorBoxProps) {
  return (
    <View className="bg-destructive/20 border border-destructive rounded-2xl p-4 flex-row gap-2 items-start">
      <AlertCircle size={20} color={THEME.destructive} />
      <Text className="text-destructive text-sm flex-1">{error}</Text>
    </View>
  );
}
