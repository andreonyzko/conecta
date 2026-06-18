import { ScrollView, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { callService } from "@/services/CallService";
import { Link, Redirect } from "expo-router";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Package,
  University,
  Users,
} from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Text } from "@/components/ui/text";
import { mockInstitutions } from "@/data/mock";
import { THEME } from "@/lib/theme";
import ResumedCallItemCard from "@/components/common/cards/ResumedCallItemCard";
import { proposalService } from "@/services/ProposalService";
import Header from "@/components/common/layout/Header";

export default function CallDetailScreen() {
  const { user } = useAuth();
  const route = useRoute();

  let { callId } = route.params as { callId: number };
  callId = Number(callId);
  const call = callService.getCall(callId);
  if (!call || !user) return <Redirect href="/" />;

  const callOwner =
    user.type === "institution" && user.id === call.institutionId;

  const alreadyMadeProposal =
    user.type === "farmer" &&
    proposalService
      .getFarmerProposals(user.id)
      .find((p) => p.callId === callId);

  const proposals = proposalService.getCallProposals(callId);

  const handleCancel = () => {};

  return (
    <View className="flex-1">
      <Header title="Detalhes da Chamada">
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
              "text-xs",
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
      </Header>
      <ScrollView>
        <View className="p-5 flex-col gap-4 pb-48">
          <Text className="font-extrabold text-xl">{call.title}</Text>
          <Link href={`/institution/${call.institutionId}`}>
            <View className="flex-row items-center gap-2">
              <View className="bg-primary/20 p-2 rounded-xl">
                <University size={20} color={THEME.primary} />
              </View>
              <Text className="text-primary">
                {
                  mockInstitutions.find((i) => i.id === call.institutionId)!
                    .name
                }
              </Text>
            </View>
          </Link>
          <View className="flex-row items-center gap-2">
            <Calendar size={15} color={THEME.muted} />
            <Text className="text-sm text-muted">
              {call.startDate.toLocaleDateString("pt-br")} -{" "}
              {call.endDate.toLocaleDateString("pt-br")}
            </Text>
          </View>

          <Text className="bg-card text-muted text-sm p-4 border border-border rounded-2xl">
            {call.description}
          </Text>

          <View className="flex-col gap-2">
            <View className="flex-row gap-2">
              <Package color={THEME.primary} />
              <Text className="font-bold">Itens da Chamada</Text>
            </View>
            <View className="flex-col gap-2">
              {call.itens.map((i) => (
                <ResumedCallItemCard key={i.product} item={i} />
              ))}
            </View>
          </View>

          <View className="bg-card border border-border rounded-2xl flex-row items-center gap-2 p-4">
            <Users size={20} color={THEME.muted} />
            <Text className="text-sm text-muted">
              {proposals.length} propostas recebidas
            </Text>
          </View>
        </View>
      </ScrollView>
      {callOwner && call.status === "active" && (
        <View className="absolute bottom-0 right-0 left-0 p-5 border-t border-border bg-card flex-col gap-4">
          <Link href={`/calls/${call.id}/proposals`} asChild>
            <Button className="rounded-2xl">
              <Text className="text-sm font-semibold">
                Ver Propostas ({proposals.length})
              </Text>
              <ChevronRight size={15} color="white" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="border border-destructive rounded-2xl"
            onPress={handleCancel}
          >
            <AlertTriangle size={15} color={THEME.destructive} />
            <Text className="text-sm font-semibold text-destructive">
              Cancelar Chamada
            </Text>
          </Button>
        </View>
      )}
      {!alreadyMadeProposal && call.status === "active" && (
        <View className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-border">
          <Link href={`/calls/${callId}/proposals/send`} asChild>
            <Button className="rounded-2xl">
              <Text>Enviar Proposta</Text>
            </Button>
          </Link>
        </View>
      )}
    </View>
  );
}
