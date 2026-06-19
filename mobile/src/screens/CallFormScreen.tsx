import { Alert, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { callService } from "@/services/CallService";
import z from "zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateField from "@/components/common/form/DateField";
import InputField from "@/components/common/form/InputField";
import TextAreaField from "@/components/common/form/TextAreaField";
import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";
import CallItemForm, {
  CallItemFormInputData,
  CallItemFormOutputData,
  callItemFormSchema,
} from "@/components/common/form/CallItemForm";
import { ArrowLeft, Package, Plus, X } from "lucide-react-native";
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BottomSheetContent from "@/components/common/layout/BottomSheetContent";
import { CallItem } from "@/types/CallItem";
import CallItemCard from "@/components/common/cards/CallItemCard";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import clsx from "clsx";
import Header from "@/components/common/layout/Header";

const callFormSchema = z
  .object({
    title: z.string().trim().min(1, "O Título é obrigatório"),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    itens: z.array(callItemFormSchema).min(1, "Adicione pelo menos um item"),
  })
  .refine((data) => data.startDate <= data.endDate, {
    path: ["endDate"],
    message: "A data de encerramento não pode ser anterior a de início",
  });

type CallFormInputData = z.input<typeof callFormSchema>;
type CallFormOutputData = z.output<typeof callFormSchema>;

export default function CallFormScreen() {
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<CallFormInputData, any, CallFormOutputData>({
    resolver: zodResolver(callFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      itens: [],
    },
  });

  const { append, remove } = useFieldArray({ control: control, name: "itens" });
  const itens = useWatch({ control: control, name: "itens" });

  const handleAddItem = (item: CallItemFormOutputData) => {
    append({
      ...item,
      referencePrice: String(item.referencePrice),
    });
    setNewItemDialogOpen(false);
  };

  const onSubmit = async (data: CallFormOutputData) => {
    try {
      await callService.addCall({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        itens: data.itens,
      });
      Alert.alert("Sucesso", "Chamada publicada!");
      router.replace("/calls");
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.response?.data?.message ?? "Não foi possível publicar a chamada"
      );
    }
  };

  return (
    <View className="h-full">
      <Header title="Nova Chamada Pública"/>
      <View className="p-5 flex-col gap-5">
        <InputField
          formControl={control}
          name="title"
          label="Título"
          placeholder="Chamada pública n° 01/2026"
          className="bg-card"
        />
        <TextAreaField
          formControl={control}
          name="description"
          label="Descrição"
          placeholder="Descreva os objetivos e requisitos desta chamada..."
          className="bg-card h- placeholder:text-accent text-sm"
        />

        <View className="flex-row gap-4">
          <DateField
            formControl={control}
            name="startDate"
            label="Data de início"
          />
          <DateField
            formControl={control}
            name="endDate"
            label="Data de encerramento"
          />
        </View>

        <View className="flex-col gap-2">
          <View className="flex-row">
            <View className="flex-row gap-2 items-center flex-1">
              <Package color={THEME.primary} />
              <Text className="text-white font-semibold">Itens da Chamada</Text>
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
                  <DialogTitle className="flex-1">Novo Item</DialogTitle>
                  <Button
                    variant="ghost"
                    onPress={() => setNewItemDialogOpen(false)}
                  >
                    <X color={THEME.muted} />
                  </Button>
                </DialogHeader>
                <View>
                  <CallItemForm onAdd={handleAddItem} />
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
                    : "Adicione os itens que você precisa adquirir"}
                </Text>
              </View>
            )}

            {itens.map((i) => (
              <CallItemCard
                key={i.product}
                item={i as CallItemFormInputData}
                handleRemove={() =>
                  remove(
                    itens.findIndex(
                      (item) => JSON.stringify(item) === JSON.stringify(i)
                    )
                  )
                }
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <View className="absolute bottom-0 right-0 left-0 p-5 border-t border-border">
        <Button className="rounded-2xl" onPress={handleSubmit(onSubmit)}>
          <Text className="font-semibold">Publicar Chamada</Text>
        </Button>
      </View>
    </View>
  );
}
