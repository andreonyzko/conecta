import { Alert, RefreshControl, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { callService } from "@/services/CallService";
import { proposalService } from "@/services/ProposalService";
import { farmerService } from "@/services/FarmerService";
import { Link, Redirect, router } from "expo-router";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Package,
  University,
  Users,
} from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import Header from "@/components/common/layout/Header";
import Loading from "@/components/common/layout/Loading";
import ErrorBox from "@/components/common/layout/ErrorBox";
import FinalizarChamadaModal, { FinalizarData } from "@/components/common/layout/FinalizarChamadaModal";
import { useAsync } from "@/lib/useAsync";
import { Farmer } from "@/types/Farmer";

export default function CallDetailScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const { callId } = route.params as { callId: string };
  const [showFinalizar, setShowFinalizar] = useState(false);
  const [vencedores, setVencedores] = useState<Farmer[]>([]);

  const { data, loading, error, reload } = useAsync(async () => {
    const [call, proposals, itensStatus] = await Promise.all([
      callService.getCall(callId),
      proposalService.getCallProposals(callId),
      callService.getItensStatus(callId),
    ]);
    return { call, proposals, itensStatus };
  }, [callId], `call-detail-${callId}`);

  if (!user) return <Redirect href="/" />;

  if (loading && !data) {
    return (
      <View className="flex-1">
        <Header title="Detalhes da Chamada" />
        <Loading />
      </View>
    );
  }

  if (error || !data?.call) {
    return (
      <View className="flex-1">
        <Header title="Detalhes da Chamada" />
        <View className="p-5"><ErrorBox error={error ?? "Chamada não encontrada"} /></View>
      </View>
    );
  }

  const { call, proposals, itensStatus } = data;
  const callOwner = user.type === "institution" && user.id === call.institutionId;
  const totalmenteAtendido = itensStatus.length > 0 && itensStatus.every((i) => i.atendido);
  const alreadyMadeProposal = user.type === "farmer" && proposals.some((p) => p.farmerId === user.id);
  const canPropose = user.type === "farmer" && !alreadyMadeProposal && !totalmenteAtendido && call.status === "active";
  const propostasAceitas = proposals.filter((p) => p.status === "accepted");
  const vencedoresIds = [...new Set(propostasAceitas.map((p) => p.farmerId))];

  const openFinalizar = async () => {
    try {
      const farmers = await Promise.all(vencedoresIds.map((id) => farmerService.getFarmer(id)));
      setVencedores(farmers);
      setShowFinalizar(true);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados dos agricultores.");
    }
  };

  const onCancel = () => {
    Alert.alert("Cancelar chamada", "Tem certeza que deseja cancelar?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await callService.cancelCall(call.id);
            router.replace("/calls");
          } catch (e: any) {
            Alert.alert("Erro", e?.response?.data?.message ?? "Não foi possível cancelar");
          }
        },
      },
    ]);
  };

  const onFinalizar = async (avaliacoes: FinalizarData[]) => {
    try {
      await callService.closeCall(call.id, avaliacoes.map((a) => ({
        farmerId: a.agricultorId,
        grade: a.grade,
        comment: a.comment,
      })));
      setShowFinalizar(false);
      Alert.alert("Pronto", "Chamada encerrada!");
      router.replace("/calls");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.message ?? "Não foi possível encerrar");
    }
  };

  return (
    <View className="flex-1">
      <Header title="Detalhes da Chamada">
        <Badge className={clsx("self-start py-1", call.status === "active" ? "bg-primary/30" : "bg-muted/30")}>
          <Text className={clsx("text-xs", call.status === "active" ? "text-primary" : "text-muted")}>
            {call.status === "active" ? "Ativa" : call.status === "closed" ? "Encerrada" : "Cancelada"}
          </Text>
        </Badge>
      </Header>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} colors={[THEME.primary]} tintColor={THEME.primary} />}>
        <View className="p-5 flex-col gap-4 pb-52">
          <Text className="font-extrabold text-xl">{call.title}</Text>

          <Link href={`/institution/${call.institutionId}`}>
            <View className="flex-row items-center gap-2">
              <View className="bg-primary/20 p-2 rounded-xl">
                <University size={20} color={THEME.primary} />
              </View>
              <Text className="text-primary">{call.institutionName}</Text>
            </View>
          </Link>

          <View className="flex-row items-center gap-2">
            <Calendar size={15} color={THEME.muted} />
            <Text className="text-sm text-muted">
              {call.startDate.toLocaleDateString("pt-br")} – {call.endDate.toLocaleDateString("pt-br")}
            </Text>
          </View>

          <Text className="bg-card text-muted text-sm p-4 border border-border rounded-2xl">
            {call.description}
          </Text>

          <View className="flex-col gap-2">
            <View className="flex-row gap-2 items-center">
              <Package color={THEME.primary} />
              <Text className="font-bold">Itens da Chamada</Text>
            </View>
            <View className="flex-col gap-2">
              {itensStatus.map((item) => (
                <View key={item.id} className="bg-card border border-border p-3 rounded-2xl gap-2">
                  <View className="flex-row items-start">
                    <View className="flex-1">
                      <Text className="font-bold text-sm">{item.produto}</Text>
                      <Text className="text-xs text-muted">{item.categoria} · {item.frequencia}</Text>
                    </View>
                    <View className="items-end gap-1">
                      <Text className="text-xs font-bold">{item.quantidade} {item.unidade}</Text>
                      {item.atendido ? (
                        <Badge className="bg-primary/20 py-0.5 flex-row gap-1">
                          <CheckCircle2 size={11} color={THEME.primary} />
                          <Text className="text-primary text-xs">Atendido</Text>
                        </Badge>
                      ) : (
                        <Text className="text-xs text-muted">
                          {item.quantidadeAtendida}/{item.quantidade} atendido
                        </Text>
                      )}
                    </View>
                  </View>
                  {/* barra de progresso */}
                  {item.quantidade > 0 && (
                    <View className="bg-accent rounded-full h-1.5">
                      <View
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (item.quantidadeAtendida / item.quantidade) * 100)}%` }}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View className="bg-card border border-border rounded-2xl flex-row items-center gap-2 p-4">
            <Users size={20} color={THEME.muted} />
            <Text className="text-sm text-muted">{proposals.length} propostas recebidas</Text>
          </View>
        </View>
      </ScrollView>

      {callOwner && call.status === "active" && (
        <View className="absolute bottom-0 right-0 left-0 p-5 border-t border-border bg-card flex-col gap-3">
          <Link href={`/calls/${call.id}/proposals`} asChild>
            <Button className="rounded-2xl">
              <Text className="text-sm font-semibold">Ver Propostas ({proposals.length})</Text>
              <ChevronRight size={15} color="white" />
            </Button>
          </Link>
          {totalmenteAtendido && vencedoresIds.length > 0 && (
            <Button className="rounded-2xl" onPress={openFinalizar}>
              <CheckCircle2 size={15} color="white" />
              <Text className="text-sm font-semibold">Encerrar Chamada</Text>
            </Button>
          )}
          <Button variant="ghost" className="border border-destructive rounded-2xl" onPress={onCancel}>
            <AlertTriangle size={15} color={THEME.destructive} />
            <Text className="text-sm font-semibold text-destructive">Cancelar Chamada</Text>
          </Button>
        </View>
      )}

      {user.type === "farmer" && call.status === "active" && (
        <View className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-border bg-background">
          {canPropose ? (
            <Link href={`/calls/${call.id}/proposals/send`} asChild>
              <Button className="rounded-2xl"><Text>Enviar Proposta</Text></Button>
            </Link>
          ) : (
            <Text className="text-muted text-center text-sm">
              {totalmenteAtendido
                ? "Todos os itens desta chamada já foram atendidos."
                : "Você já enviou uma proposta para esta chamada."}
            </Text>
          )}
        </View>
      )}

      <FinalizarChamadaModal
        visible={showFinalizar}
        farmers={vencedores}
        onClose={() => setShowFinalizar(false)}
        onConfirm={onFinalizar}
      />
    </View>
  );
}
