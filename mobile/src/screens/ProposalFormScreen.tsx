import { Alert, ScrollView, View } from "react-native";
import Header from "@/components/common/layout/Header";
import Loading from "@/components/common/layout/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import { callService } from "@/services/CallService";
import { ItemChamadaComStatus } from "@/types/Backend";
import { proposalService } from "@/services/ProposalService";
import { Package, Plus, Send, Trash, Truck, X } from "lucide-react-native";
import { THEME } from "@/lib/theme";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BottomSheetContent from "@/components/common/layout/BottomSheetContent";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import TextAreaField from "@/components/common/form/TextAreaField";
import ProposalItemForm, {
  ProposalItemFormOutputData,
} from "@/components/common/form/ProposalItemForm";
import ResumedProposalItem from "@/components/common/cards/ResumedProposalItem";
import { ProposalItem } from "@/types/ProposalItem";
import { unitLabel } from "@/utils/options";
import { useAsync } from "@/lib/useAsync";

type ProposalForm = { delivery: boolean; message?: string };

export default function ProposalFormScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const { callId } = route.params as { callId: string };

  const { data: call, loading } = useAsync(() => callService.getCall(callId), [callId]);
  const { data: itensStatus } = useAsync(
    () => callService.getItensStatus(callId),
    [callId],
    `itens-status-${callId}`
  );

  const { control, handleSubmit } = useForm<ProposalForm>({
    defaultValues: { delivery: false, message: "" },
  });

  const [items, setItems] = useState<ProposalItem[]>([]);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [itemsError, setItemsError] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || user.type !== "farmer") return <Redirect href="/" />;

  if (loading) {
    return (
      <View className="flex-1">
        <Header title="Enviar Proposta" />
        <Loading />
      </View>
    );
  }

  if (!call) return <Redirect href="/calls" />;

  // Usa itens-status se disponível; filtra apenas itens com saldo restante
  const itensDisponiveis: ItemChamadaComStatus[] = (itensStatus ?? []).filter(
    (i) => !i.atendido && !items.some((item) => item.product === i.produto)
  );
  const categoryOptions = Array.from(
    new Set(itensDisponiveis.map((i) => i.categoria))
  ).map((c) => ({ value: c, label: c }));
  const productOptions = itensDisponiveis.map((i) => ({
    value: i.produto,
    label: `${i.produto} (restam ${i.quantidadeRestante} ${i.unidade})`,
  }));
  const maxByProduct: Record<string, number> = Object.fromEntries(
    itensDisponiveis.map((i) => [i.produto, i.quantidadeRestante])
  );

  const handleAdd = (item: ProposalItemFormOutputData) => {
    const unity = unitLabel(item.unity);
    setItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        product: item.product,
        amount: item.amount,
        unity,
        unitPrice: item.unitPrice,
        total: item.amount * item.unitPrice,
      },
    ]);
    setItemsError(false);
    setNewItemDialogOpen(false);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const total = items.reduce((sum, i) => sum + i.total, 0);

  const onSubmit = async (form: ProposalForm) => {
    if (items.length === 0) {
      setItemsError(true);
      return;
    }
    setSending(true);
    try {
      await proposalService.create({
        callId,
        delivery: form.delivery,
        message: form.message,
        itens: items.map((i) => ({
          product: i.product,
          amount: i.amount,
          unity: i.unity,
          unitPrice: i.unitPrice,
        })),
      });
      Alert.alert("Sucesso", "Proposta enviada com sucesso!");
      router.replace(`/calls/${callId}`);
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.response?.data?.message ?? "Não foi possível enviar a proposta"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="flex-1">
      <Header title="Enviar Proposta" description={call.title} />

      <ScrollView contentContainerClassName="pb-44">
        <View className="p-5 flex-col gap-6">
          <View className="flex-col gap-4">
            <View className="flex-row">
              <View className="flex-row gap-2 items-center flex-1">
                <Package color={THEME.primary} />
                <Text className="text-white font-semibold">
                  Itens da Proposta
                </Text>
              </View>
              <Dialog open={newItemDialogOpen}>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    onPress={() => setNewItemDialogOpen(true)}
                  >
                    <Plus size={15} color={THEME.primary} />
                    <Text className="text-primary">Adicionar</Text>
                  </Button>
                </DialogTrigger>
                <BottomSheetContent className="left-0 right-0">
                  <DialogHeader className="flex-row items-center">
                    <DialogTitle className="flex-1">
                      Novo Item da Proposta
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      onPress={() => setNewItemDialogOpen(false)}
                    >
                      <X color={THEME.muted} />
                    </Button>
                  </DialogHeader>
                  <View>
                    <ProposalItemForm
                      categoriesOptions={categoryOptions}
                      productsOptions={productOptions}
                      maxByProduct={maxByProduct}
                      handleAdd={handleAdd}
                    />
                  </View>
                </BottomSheetContent>
              </Dialog>
            </View>

            {items.length === 0 ? (
              <View
                className={clsx(
                  "flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed",
                  itemsError ? "border-destructive" : "border-accent"
                )}
              >
                <Package color={itemsError ? THEME.destructive : THEME.accent} />
                <Text
                  className={clsx(
                    "text-muted text-sm",
                    itemsError && "text-destructive"
                  )}
                >
                  {itemsError
                    ? "Adicione pelo menos um item"
                    : "Adicione os itens que você pode fornecer"}
                </Text>
              </View>
            ) : (
              <View className="flex-col gap-3">
                {items.map((item) => (
                  <View key={item.id} className="flex-row items-center gap-2">
                    <View className="flex-1">
                      <ResumedProposalItem item={item} />
                    </View>
                    <Button variant="ghost" onPress={() => removeItem(item.id)}>
                      <Trash size={20} color={THEME.destructive} />
                    </Button>
                  </View>
                ))}

                <View className="flex-row justify-between bg-primary/20 border border-primary rounded-2xl p-4">
                  <Text className="text-sm text-primary">Valor Total</Text>
                  <Text className="text-primary font-bold">
                    {total.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="bg-card flex-row items-center gap-2 p-4 border border-border rounded-2xl">
            <Controller
              control={control}
              name="delivery"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  className="p-3"
                />
              )}
            />
            <Truck size={20} color={THEME.muted} />
            <View>
              <Text className="text-sm">Realizo entrega própria</Text>
              <Text className="text-xs text-muted">
                Sem custo adicional para a instituição
              </Text>
            </View>
          </View>

          <TextAreaField
            formControl={control}
            name="message"
            label="Mensagem (opcional)"
            placeholder="Informações adicionais sobre sua produção, certificações, disponibilidade de entrega..."
            className="placeholder:text-muted placeholder:text-sm bg-card"
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 right-0 left-0 p-5 border-t border-border bg-background">
        <Button
          className="rounded-2xl"
          disabled={sending}
          onPress={handleSubmit(onSubmit)}
        >
          <Send size={15} color="white" />
          <Text className="font-semibold">
            {sending ? "Enviando..." : "Enviar Proposta"}
          </Text>
        </Button>
      </View>
    </View>
  );
}
