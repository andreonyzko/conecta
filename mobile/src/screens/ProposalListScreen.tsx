import { RefreshControl, ScrollView, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import Header from "@/components/common/layout/Header";
import Loading from "@/components/common/layout/Loading";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { proposalService } from "@/services/ProposalService";
import { callService } from "@/services/CallService";
import ProposalCard from "@/components/common/cards/ProposalCard";
import { useAsync } from "@/lib/useAsync";
import { THEME } from "@/lib/theme";

export default function ProposalListScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const params = (route.params ?? {}) as { callId?: string; farmerId?: string };
  const callId = params.callId;
  const farmerId = params.farmerId;

  const { data, loading, reload } = useAsync(async () => {
    if (callId) {
      const [call, proposals] = await Promise.all([
        callService.getCall(callId),
        proposalService.getCallProposals(callId),
      ]);
      return { title: call.title, proposals };
    }
    if (farmerId) {
      const proposals = await proposalService.getFarmerProposals(farmerId);
      return { title: "Minhas Propostas", proposals };
    }
    return { title: "", proposals: [] };
  }, [callId, farmerId]);

  if (!user) return <Redirect href="/" />;

  const proposals = data?.proposals ?? [];

  return (
    <View className="flex-1">
      <Header
        title={callId ? "Propostas Recebidas" : "Minhas Propostas"}
        description={callId ? data?.title : undefined}
      >
        <Badge className="bg-primary/20">
          <Text className="text-primary">{proposals.length}</Text>
        </Badge>
      </Header>
      <ScrollView
        contentContainerClassName="p-4 gap-4"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} colors={[THEME.primary]} tintColor={THEME.primary} />}
      >
        {loading && !data && <Loading />}
        {!loading && proposals.length === 0 && (
          <Text className="text-muted">Nenhuma proposta encontrada.</Text>
        )}
        {proposals.map((p) => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
      </ScrollView>
    </View>
  );
}
