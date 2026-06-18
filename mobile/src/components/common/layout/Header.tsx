import { View } from "react-native";
import React, { ReactNode } from "react";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react-native";
import { Text } from "@/components/ui/text";

type HeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function Header({ title, description, children }: HeaderProps) {
  return (
    <View className="bg-card p-4 flex-row gap-2 items-center">
      <Button size="sm" variant="ghost" onPress={() => router.back()}>
        <ArrowLeft color="white" />
      </Button>
      <View className="flex-1">
        <Text className="text-white text-base font-semibold">
          {title}
        </Text>
        {description && <Text className="text-xs text-muted">{description}</Text>}
      </View>
      {children}
    </View>
  );
}
