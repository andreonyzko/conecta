import { RefreshControl, ScrollView, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { Redirect, Link } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { THEME } from "@/lib/theme";
import Loading from "@/components/common/layout/Loading";
import ErrorBox from "@/components/common/layout/ErrorBox";
import { farmerService } from "@/services/FarmerService";
import { useAsync } from "@/lib/useAsync";
import {
  Award,
  CircleCheckBig,
  Edit2,
  Leaf,
  LogOut,
  Package,
  Star,
  Truck,
  User,
} from "lucide-react-native";

export default function FarmerProfileScreen() {
  const { user, signOut } = useAuth();
  const route = useRoute();
  const { farmerId } = route.params as { farmerId: string };

  const { data: farmer, loading, error, reload } = useAsync(
    () => farmerService.getFarmer(farmerId),
    [farmerId],
    `farmer-profile-${farmerId}`
  );

  if (!user) return <Redirect href="/" />;

  if (loading && !farmer) {
    return <Loading />;
  }

  if (error || !farmer) {
    return <View className="p-5"><ErrorBox error={error ?? "Agricultor não encontrado"} /></View>;
  }

  const profileOwner = user.type === "farmer" && user.id === farmer.id;

  return (
    <ScrollView contentContainerClassName="pb-28" refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} colors={[THEME.primary]} tintColor={THEME.primary} />}>
      <View className="bg-card p-5 flex-col gap-2 border-b border-border">
        <View className="flex-row justify-between">
          <View className="bg-primary/50 w-16 h-16 flex items-center justify-center rounded-full">
            <Text className="text-primary text-2xl font-extrabold">
              {farmer.name.charAt(0)}
            </Text>
          </View>
          {profileOwner && (
            <Link href={`/farmer/${user.id}/edit`}>
              <View className="flex-row gap-2 border border-border bg-background py-2 px-3 rounded-2xl">
                <Edit2 color={THEME.muted} size={15} />
                <Text className="text-xs">Editar</Text>
              </View>
            </Link>
          )}
        </View>
        <Text className="font-bold text-lg">{farmer.name}</Text>
        <View className="flex-row gap-2 items-center">
          <User size={15} color={THEME.primary} />
          <Text className="text-sm text-muted">CPF: {farmer.cpf}</Text>
        </View>
        {!!farmer.caf && (
          <View className="flex-row gap-2 items-center">
            <Award size={15} color={THEME.primary} />
            <Text className="text-sm text-muted">CAF: {farmer.caf}</Text>
          </View>
        )}
        <Badge
          className={`self-start py-2 px-3 ${farmer.delivery ? "bg-primary/20" : "bg-accent"}`}
        >
          <Truck size={13} color={farmer.delivery ? THEME.primary : THEME.muted} />
          <Text className={farmer.delivery ? "text-primary" : "text-muted"}>
            {farmer.delivery ? "Realiza entrega própria" : "Não realiza entrega"}
          </Text>
        </Badge>
      </View>

      <View className="p-5 flex-col gap-6">
        <View className="bg-card p-4 border border-border rounded-2xl flex-col gap-2">
          <Text className="text-xs text-muted font-bold">CONTATO</Text>
          <Text className="text-sm">{farmer.email}</Text>
          <Text className="text-sm">{farmer.phone}</Text>
        </View>

        {/* Produtos */}
        <View className="flex-col gap-3">
          <View className="flex-row gap-2 items-center">
            <Package size={17} color={THEME.primary} />
            <Text className="font-bold text-sm">
              Produtos ({farmer.products.length})
            </Text>
          </View>
          {farmer.products.length === 0 && (
            <Text className="text-muted text-sm">Nenhum produto cadastrado.</Text>
          )}
          {farmer.products.map((p) => (
            <View
              key={p.id}
              className="bg-card border border-border rounded-2xl p-4 flex-col gap-1"
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold">{p.name}</Text>
                {p.organic && (
                  <Badge className="bg-primary/20 py-1">
                    <Leaf size={12} color={THEME.primary} />
                    <Text className="text-primary text-xs">Orgânico</Text>
                  </Badge>
                )}
              </View>
              <Text className="text-xs text-muted">{p.category}</Text>
              <Text className="text-xs text-muted">
                Capacidade: {p.monthlyCapacity} {p.unity}/mês
              </Text>
              {p.monthsAvaliable.length > 0 && (
                <Text className="text-xs text-muted">
                  Disponível: {p.monthsAvaliable.join(", ")}
                </Text>
              )}
              <Text className="text-sm font-semibold text-primary">
                {p.suggestedPrice.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
                /{p.unity}
              </Text>
            </View>
          ))}
        </View>

        {/* Avaliacoes */}
        <View className="flex-col gap-3">
          <View className="flex-row gap-2 items-center">
            <Star size={17} color={THEME.primary} />
            <Text className="font-bold text-sm">
              Avaliações ({farmer.reviews.length})
            </Text>
          </View>
          {farmer.reviews.length === 0 && (
            <Text className="text-muted text-sm">Nenhuma avaliação ainda.</Text>
          )}
          {farmer.reviews.map((r) => (
            <View
              key={r.id}
              className="bg-card border border-border rounded-2xl p-4 flex-col gap-1"
            >
              <View className="flex-row gap-1 items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    color={i < r.grade ? THEME.primary : THEME.muted}
                    fill={i < r.grade ? THEME.primary : "transparent"}
                  />
                ))}
              </View>
              {!!r.comment && <Text className="text-sm">{r.comment}</Text>}
              <Text className="text-xs text-muted">
                {r.date.toLocaleDateString("pt-br")}
              </Text>
            </View>
          ))}
        </View>

        {/* Licitacoes ganhas */}
        <View className="flex-col gap-3">
          <View className="flex-row gap-2 items-center">
            <CircleCheckBig size={17} color={THEME.primary} />
            <Text className="font-bold text-sm">
              Licitações ganhas ({farmer.bidswon.length})
            </Text>
          </View>
          {farmer.bidswon.length === 0 && (
            <Text className="text-muted text-sm">Nenhuma licitação ganha.</Text>
          )}
          {farmer.bidswon.map((b) => (
            <View
              key={b.id}
              className="bg-card border border-border rounded-2xl p-4 flex-row items-center justify-between"
            >
              <Text className="text-xs text-muted">
                {b.conclusionDate.toLocaleDateString("pt-br")}
              </Text>
              <Text className="font-semibold text-primary">
                {b.value.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>
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
    </ScrollView>
  );
}
