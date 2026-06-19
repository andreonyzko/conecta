import { Alert, RefreshControl, ScrollView, View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import Header from "@/components/common/layout/Header";
import Loading from "@/components/common/layout/Loading";
import ErrorBox from "@/components/common/layout/ErrorBox";
import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { proposalService } from "@/services/ProposalService";
import { callService } from "@/services/CallService";
import { Link, Redirect, router } from "expo-router";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  CircleCheck,
  CircleX,
  MessageSquare,
  Package,
  Truck,
  User,
} from "lucide-react-native";
import { THEME } from "@/lib/theme";
import ResumedProposalItem from "@/components/common/cards/ResumedProposalItem";
import { useAsync } from "@/lib/useAsync";

export default function ProposalDetailScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const { callId, proposalId } = route.params as {
    callId: string;
    proposalId: string;
  };

  const { data, loading, error, reload } = useAsync(async () => {
    const [proposal, call] = await Promise.all([
      proposalService.getProposal(proposalId),
      callService.getCall(callId),
    ]);
    return { proposal, call };
  }, [callId, proposalId]);

  if (!user) return <Redirect href="/" />;

  if (loading && !data) {
    return (
      <View className="flex-1">
        <Header title="Detalhe da Proposta" />
        <Loading />
      </View>
    );
  }

  if (error || !data?.proposal || !data?.call) {
    return (
      <View className="flex-1">
        <Header title="Detalhe da Proposta" />
        <View className="p-5"><ErrorBox error={error ?? "Proposta não encontrada"} /></View>
      </View>
    );
  }

  const { proposal, call } = data;
  const callOwner =
    user.type === "institution" && call.institutionId === user.id;
  const proposalOwner =
    user.type === "farmer" && user.id === proposal.farmerId;

  const onAccept = async () => {
    try {
      await proposalService.accept(proposal.id);
      Alert.alert("Pronto", "Proposta aceita.");
      reload();
    } catch (e: any) {
      Alert.alert(
        "Não foi possível aceitar",
        e?.response?.data?.message ?? "Tente novamente"
      );
    }
  };

  const onReject = async () => {
    try {
      await proposalService.reject(proposal.id);
      Alert.alert("Pronto", "Proposta rejeitada.");
      reload();
    } catch (e: any) {
      Alert.alert(
        "Não foi possível rejeitar",
        e?.response?.data?.message ?? "Tente novamente"
      );
    }
  };

  const onCancel = () => {
    Alert.alert("Cancelar proposta", "Deseja cancelar esta proposta?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await proposalService.cancel(proposal.id);
            router.back();
          } catch (e: any) {
            Alert.alert(
              "Erro",
              e?.response?.data?.message ?? "Não foi possível cancelar"
            );
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      <Header title="Detalhe da Proposta">
        <Badge
          className={clsx(
            "text-xs",
            proposal.status == "accepted" && "bg-success/20",
            proposal.status == "pending" && "bg-warning/20",
            (proposal.status == "rejected" || proposal.status == "canceled") &&
              "bg-destructive/20"
          )}
        >
          <Text
            className={clsx(
              "text-xs",
              proposal.status == "accepted" && "text-success",
              proposal.status == "pending" && "text-warning",
              (proposal.status == "rejected" ||
                proposal.status == "canceled") &&
                "text-destructive"
            )}
          >
            {proposal.status == "accepted" && "Aceito"}
            {proposal.status == "pending" && "Pendente"}
            {proposal.status == "rejected" && "Rejeitado"}
            {proposal.status == "canceled" && "Cancelado"}
          </Text>
        </Badge>
      </Header>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} colors={[THEME.primary]} tintColor={THEME.primary} />}>
        <View className="p-5 flex-col gap-6 pb-48">
          <View className="bg-card border border-border rounded-2xl p-4 flex-col gap-2">
            <Text className="text-xs text-muted font-semibold">CHAMADA</Text>
            <Text className="text-sm font-semibold">{call.title}</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted">{call.institutionName}</Text>
              <Link href={`/calls/${call.id}`} asChild>
                <Button size="sm" variant="ghost">
                  <Text className="text-primary">Ver chamada</Text>
                  <ChevronRight size={15} color={THEME.primary} />
                </Button>
              </Link>
            </View>
          </View>

          <View className="flex-row gap-3 items-center">
            <View className="bg-accent p-2 rounded-full">
              <User color={THEME.muted} />
            </View>
            <View>
              <Text className="font-semibold">
                {proposal.farmerName ?? "Agricultor"}
              </Text>
              <Text className="text-xs text-muted">
                Enviada em {proposal.createdAt.toLocaleDateString("pt-br")}
              </Text>
            </View>
          </View>

          <Badge
            className={clsx(
              "self-start bg-accent",
              proposal.delivery && "bg-primary/20"
            )}
          >
            <Truck
              size={15}
              color={proposal.delivery ? THEME.primary : THEME.muted}
            />
            <Text
              className={clsx("text-muted", proposal.delivery && "text-primary")}
            >
              {proposal.delivery
                ? "Realiza entrega própria"
                : "Não realiza entrega"}
            </Text>
          </Badge>

          <View className="flex-col gap-4">
            <View className="flex-row gap-2">
              <Package color={THEME.primary} />
              <Text className="font-semibold">Itens da Proposta</Text>
            </View>
            <View className="flex-col gap-3">
              {proposal.itens.map((i) => (
                <ResumedProposalItem key={i.id} item={i} />
              ))}

              <View className="flex-row justify-between bg-primary/20 border border-primary rounded-2xl p-4">
                <Text className="text-sm text-primary">Valor Total</Text>
                <Text className="text-primary font-bold">
                  {proposal.totalValue.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
            </View>
          </View>

          {!!proposal.message && (
            <View className="bg-card border border-border rounded-2xl p-4 flex-col">
              <View className="flex-row gap-2 items-center">
                <MessageSquare size={15} color={THEME.muted} />
                <Text className="text-muted text-sm">
                  Mensagem do agricultor
                </Text>
              </View>
              <Text>{proposal.message}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {callOwner && proposal.status === "pending" && (
        <View className="bg-background border-t border-border absolute bottom-0 left-0 right-0 px-4 py-6 flex-row gap-2">
          <Button className="flex-1 rounded-2xl" onPress={onAccept}>
            <CircleCheck size={15} color="white" />
            <Text>Aceitar</Text>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 border border-destructive rounded-2xl"
            onPress={onReject}
          >
            <CircleX size={15} color={THEME.destructive} />
            <Text className="text-destructive">Rejeitar</Text>
          </Button>
        </View>
      )}
      {proposalOwner && proposal.status === "pending" && (
        <View className="bg-background border-t border-border absolute bottom-0 left-0 right-0 px-4 py-6">
          <Button
            variant="ghost"
            className="rounded-2xl border border-destructive"
            onPress={onCancel}
          >
            <CircleX size={15} color={THEME.destructive} />
            <Text className="text-destructive">Cancelar Proposta</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
