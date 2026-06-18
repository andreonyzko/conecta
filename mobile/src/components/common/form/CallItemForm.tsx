import { View } from "react-native";
import React from "react";
import { CallItem } from "@/types/CallItem";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@/components/ui/text";
import InputField from "./InputField";
import NumberField from "./NumberField";
import SelectField from "./SelectField";
import { FREQUENCY_OPTIONS, UNITS_OPTIONS } from "@/utils/options";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CurrencyField from "./CurrencyField";

type CallItemFormProps = {
  onAdd: (item: CallItemFormOutputData) => void;
};

export const callItemFormSchema = z.object({
  product: z.string().trim().min(1, "O Produto é obrigatório"),
  category: z.string().trim().min(1, "A Categoria é obrigatória"),
  amount: z.coerce
    .number()
    .int("A Quantidade deve ser inteira")
    .positive("A Quantidade deve ser maior que zero"),
  frequency: z.string().trim().min(1, "A frequência é obrigatória"),
  unity: z.string().trim().min(1, "A Unidade é obrigatória"),
  referencePrice: z
    .string()
    .trim()
    .min(1, "O preço de referência é obrigatório")
    .transform((value) => {
      return Number(
        value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
      );
    })
    .pipe(z.number().nonnegative("Preço de referência inválido")),
});

export type CallItemFormInputData = z.input<typeof callItemFormSchema>;
export type CallItemFormOutputData = z.output<typeof callItemFormSchema>;

export default function CallItemForm({ onAdd }: CallItemFormProps) {
  const { control, handleSubmit } = useForm<
    CallItemFormInputData,
    any,
    CallItemFormOutputData
  >({
    resolver: zodResolver(callItemFormSchema),
    defaultValues: {
      product: "",
      category: "",
      amount: 0,
      unity: "kilograms",
      frequency: "monthly",
      referencePrice: "",
    },
  });

  return (
    <>
      <Separator className="my-3" />
      <View className="flex-col gap-4">
        <InputField
          formControl={control}
          name="product"
          label="Produto"
          placeholder="Ex.: Alface"
          className="bg-transparent placeholder:text-muted"
        />
        <InputField
          formControl={control}
          name="category"
          label="Categoria"
          placeholder="Ex.: Hortaliças"
          className="bg-transparent placeholder:text-muted"
        />
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <NumberField
              formControl={control}
              name="amount"
              label="Quantidade"
              placeholder="100"
              className="bg-transparent placeholder:text-muted"
            />
          </View>
          <SelectField
            formControl={control}
            name="unity"
            label="Unidade"
            options={UNITS_OPTIONS}
            className="bg-transparent placeholder:text-muted"
          />
        </View>
        <SelectField
          formControl={control}
          name="frequency"
          label="Frequência de entrega"
          options={FREQUENCY_OPTIONS}
          className="bg-transparent placeholder:text-muted"
        />
        <CurrencyField
          formControl={control}
          name="referencePrice"
          label="Preço de referência (R$/unidade)"
          placeholder="4.50"
          className="bg-transparent placeholder:text-muted"
        />
      </View>
      <Separator className="my-3" />
      <Button className="rounded-2xl" onPress={handleSubmit(onAdd)}>
        <Text>Adicionar Item</Text>
      </Button>
    </>
  );
}
