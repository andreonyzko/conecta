import { View } from "react-native";
import React from "react";
import z from "zod";
import { Separator } from "@/components/ui/separator";
import SelectField from "./SelectField";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NumberField from "./NumberField";
import { UNITS_OPTIONS } from "@/utils/options";
import CurrencyField from "./CurrencyField";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Option } from "@/components/ui/select";

type ProposalItemFormProps = {
  handleAdd: (item: ProposalItemFormOutputData) => void;
  categoriesOptions: Option[];
  productsOptions: Option[];
  maxByProduct?: Record<string, number>;
};

export const proposalItemFormSchema = z.object({
  category: z.string().trim().min(1, "A Categoria é obrigatória"),
  product: z.string().trim().min(1, "O Produto é obrigatório"),
  amount: z.coerce
    .number()
    .int("A Quantidade deve ser inteira")
    .positive("A Quantidade deve ser maior que zero"),
  unity: z.string().trim().min(1, "A unidade é obrigatória"),
  unitPrice: z
    .string()
    .trim()
    .min(1, "O preço unitário é obrigatório")
    .transform((value) =>
      Number(
        value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
      )
    )
    .pipe(z.number().nonnegative("Preço unitário inválido")),
});

export type ProposalItemFormInputData = z.input<typeof proposalItemFormSchema>;
export type ProposalItemFormOutputData = z.output<typeof proposalItemFormSchema>;

export default function ProposalItemForm({
  handleAdd,
  categoriesOptions,
  productsOptions,
  maxByProduct,
}: ProposalItemFormProps) {
  const { control, handleSubmit, reset, setError } = useForm<
    ProposalItemFormInputData,
    any,
    ProposalItemFormOutputData
  >({
    resolver: zodResolver(proposalItemFormSchema),
    defaultValues: {
      product: "",
      category: "",
      unity: "kilograms",
      amount: 0,
      unitPrice: "",
    },
  });

  const selectedProduct = useWatch({ control, name: "product" });
  const maxAmount = maxByProduct?.[selectedProduct];

  const onAdd = (item: ProposalItemFormOutputData) => {
    if (maxAmount !== undefined && item.amount > maxAmount) {
      setError("amount", { message: `Máximo disponível: ${maxAmount}` });
      return;
    }
    handleAdd(item);
    reset();
  };

  return (
    <>
      <Separator className="my-3" />
      <View className="flex-col gap-4">
        <SelectField
          formControl={control}
          name="category"
          label="Categoria"
          options={categoriesOptions}
          className="bg-transparent"
        />
        <SelectField
          formControl={control}
          name="product"
          label="Produto"
          options={productsOptions}
          className="bg-transparent"
        />

        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <NumberField
              formControl={control}
              name="amount"
              label={maxAmount !== undefined ? `Quantidade (máx. ${maxAmount})` : "Quantidade"}
              className="bg-transparent"
            />
          </View>
          <SelectField
            formControl={control}
            name="unity"
            label="Unidade"
            options={UNITS_OPTIONS}
            className="bg-transparent"
          />
        </View>

        <CurrencyField
          formControl={control}
          name="unitPrice"
          label="Preço por unidade"
          className="bg-transparent"
        />
      </View>
      <Separator className="my-3" />
      <Button className="rounded-2xl" onPress={handleSubmit(onAdd)}>
        <Text>Adicionar Item</Text>
      </Button>
    </>
  );
}
