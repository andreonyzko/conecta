import { View } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRoute } from "@react-navigation/native";
import { Text } from "@/components/ui/text";
import { institutionService } from "@/services/InstitutionService";
import {
  CircleCheckBig,
  Edit2,
  LogOut,
  University,
  Users,
} from "lucide-react-native";
import { THEME } from "@/lib/theme";
import { Link, Redirect } from "expo-router";
import { Badge } from "@/components/ui/badge";
import { callService } from "@/services/CallService";
import ResumedCallCard from "@/components/common/cards/ResumedCallCard";
import { Separator } from "@/components/ui/separator";

export default function InstitutionProfileScreen() {
  const { user, signOut } = useAuth();

  const route = useRoute();
  let { institutionId } = route.params as {
    institutionId: number;
  };

  institutionId = Number(institutionId);

  const institution = institutionService.getInstitution(institutionId);
  if (!institution || !user) return <Redirect href="/" />;

  const institutionCalls = callService.getInstitutionCalls(institutionId);
  const profileOwner = user.id == institution.id && user.type === "institution";

  return (
    <View>
      <View className="bg-card p-5 flex-col gap-2 border-b border-border">
        <View className="flex-row justify-between">
          <View className="bg-primary/50 w-16 h-16 flex items-center justify-center rounded-full">
            <Text className="text-primary text-2xl font-extrabold">{institution.name.charAt(0)}</Text>
          </View>
          {profileOwner && (
            <Link href={`/institution/${user.id}/edit`}>
              <View className="flex-row gap-2 border border-border bg-background py-2 px-3 rounded-2xl">
                <Edit2 color={THEME.muted} size={15} />
                <Text className="text-xs">Editar</Text>
              </View>
            </Link>
          )}
        </View>
        <Text className="font-bold text-lg">{institution.name}</Text>
        <View className="flex-row gap-2 items-center">
          <University size={15} color={THEME.primary} />
          <Text className="text-sm text-muted">CNPJ: {institution.cnpj}</Text>
        </View>
        <Badge className="self-start bg-primary/20 py-2 px-3">
          <Users size={13} color={THEME.primary} />
          <Text className="text-primary">
            {institution.studentsAmount} alunos
          </Text>
        </Badge>
      </View>
      <View className="p-5 flex-col gap-6">
        <View className="bg-card p-4 border border-border rounded-2xl flex-col gap-2 ">
          <Text className="text-xs text-muted font-bold">CONTATO</Text>
          <Text className="text-sm">{institution.email}</Text>
          <Text className="text-sm">{institution.phone}</Text>
        </View>

        <View className="flex-col gap-3">
          <View className="flex-row gap-2 items-center">
            <CircleCheckBig size={17} color={THEME.primary} />
            <Text className="font-bold text-sm">
              Chamadas Publicadas ({institutionCalls.length})
            </Text>
          </View>
          {institutionCalls.map((c) => (
            <ResumedCallCard key={c.id} call={c} />
          ))}
        </View>
      </View>
      {profileOwner && (
        <View className="px-5">
          <Separator className="mb-5" />
          <Button
            variant="outline"
            className="rounded-2xl border-accent"
            onPress={signOut}
          >
            <LogOut size={15} color={THEME.muted} />
            <Text className="text-muted">Sair</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
