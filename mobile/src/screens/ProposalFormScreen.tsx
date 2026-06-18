import { ScrollView, View } from "react-native";
import Header from "@/components/common/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { Redirect } from "expo-router";
import { callService } from "@/services/CallService";
import { Package, Plus, Send, Truck, X } from "lucide-react-native";
import { THEME } from "@/lib/theme";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import z from "zod";
import ProposalItemForm, {
  ProposalItemFormOutputData,
  proposalItemFormSchema,
} from "@/components/common/form/ProposalItemForm";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const proposalFormSchema = z.object({
  itens: z.array(proposalItemFormSchema).min(1, "Proponha pelo menos um item"),
  delivery: z.boolean(),
  message: z.string().optional(),
});

type ProposalFormInputData = z.input<typeof proposalFormSchema>;
type ProposalFormOutputData = z.output<typeof proposalFormSchema>;

export default function ProposalFormScreen() {
  const { user } = useAuth();
  const route = useRoute();

  if (!user || user.type !== "farmer") return <Redirect href="/" />;

  let { callId } = route.params as { callId: number };
  callId = Number(callId);
  const call = callService.getCall(callId);
  if (!call) return <Redirect href="/" />;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ProposalFormInputData, any, ProposalFormOutputData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      itens: [],
      delivery: false,
      message: "",
    },
  });

  const itens = useWatch({ control, name: "itens" });
  const { append, remove } = useFieldArray({ control, name: "itens" });

  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);

  const categoryOptions = call.itens.map((i) => ({
    value: i.category.toLowerCase(),
    label: i.category,
  }));
  const productOptions = call.itens.map((i) => ({
    value: i.product.toLowerCase(),
    label: i.product,
  }));

  const handleAdd = (item: ProposalItemFormOutputData) => {};

  return (
    <View className="flex-1">
      <Header title="Enviar Proposta" description={call.title} />

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
                    handleAdd={handleAdd}
                  />
                </View>
              </BottomSheetContent>
            </Dialog>
          </View>
          <ScrollView>
            {itens.length === 0 && (
              <View
                className={clsx(
                  "flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed ",
                  errors.itens ? "border-destructive" : "border-accent"
                )}
              >
                <Package
                  color={errors.itens ? THEME.destructive : THEME.accent}
                />
                <Text
                  className={clsx(
                    "text-muted text-sm",
                    errors.itens && "text-destructive"
                  )}
                >
                  {errors.itens
                    ? errors.itens.message
                    : "Adicione os itens que você pode fornecer"}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View className="bg-card flex-row items-center gap-2 p-4 border border-border rounded-2xl">
          <Controller
            control={control}
            name="delivery"
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  className={clsx(
                    "p-3",
                    fieldState.error && "border-destructive"
                  )}
                />
              </>
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

        <View>
          <TextAreaField
            formControl={control}
            name="message"
            label="Mensagem (opcional)"
            placeholder="Informações adicionais sobre sua produção, certificações, disponibilidade de entrega..."
            className="placeholder:text-muted placeholder:text-sm bg-card"
          />
        </View>
      </View>

      <></>
      <View className="absolute bottom-0 right-0 left-0 p-5 border-t border-border">
        <Button className="rounded-2xl" onPress={handleSubmit(() => {})}>
          <Send size={15} color="white" />
          <Text className="font-semibold">Enviar Proposta</Text>
        </Button>
      </View>
    </View>
  );
}
