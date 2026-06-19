import { Pressable, View } from "react-native";
import React from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import InputField from "./InputField";
import NumberField from "./NumberField";
import SelectField from "./SelectField";
import CurrencyField from "./CurrencyField";
import { UNITS_OPTIONS, MONTHS_OPTIONS, unitLabel } from "@/utils/options";
import { CreateProductDTO } from "@/types/Backend";
import { FarmerProduct } from "@/types/FarmerProduct";
import clsx from "clsx";

const productFormSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
  category: z.string().trim().min(1, "A categoria é obrigatória"),
  monthlyCapacity: z.coerce
    .number()
    .int("A capacidade deve ser inteira")
    .nonnegative("Capacidade inválida"),
  unity: z.string().trim().min(1, "A unidade é obrigatória"),
  monthsAvaliable: z.array(z.string()).min(1, "Selecione pelo menos um mês"),
  organic: z.boolean(),
  suggestedPrice: z
    .string()
    .trim()
    .min(1, "O preço é obrigatório")
    .transform((v) =>
      Number(v.replace("R$", "").replace(/\./g, "").replace(",", ".").trim())
    )
    .pipe(z.number().nonnegative("Preço inválido")),
});

type ProductFormInputData = z.input<typeof productFormSchema>;
type ProductFormOutputData = z.output<typeof productFormSchema>;

type ProductFormProps = {
  initial?: FarmerProduct;
  submitting?: boolean;
  onSubmit: (dto: CreateProductDTO) => void;
};

export default function ProductForm({ initial, submitting, onSubmit }: ProductFormProps) {
  const { control, handleSubmit } = useForm<
    ProductFormInputData,
    any,
    ProductFormOutputData
  >({
    resolver: zodResolver(productFormSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          category: initial.category,
          monthlyCapacity: initial.monthlyCapacity,
          unity:
            UNITS_OPTIONS.find((o) => o.label === initial.unity)?.value ??
            "kilograms",
          monthsAvaliable: initial.monthsAvaliable,
          organic: initial.organic,
          suggestedPrice: String(initial.suggestedPrice),
        }
      : {
          name: "",
          category: "",
          monthlyCapacity: 0,
          unity: "kilograms",
          monthsAvaliable: [],
          organic: false,
          suggestedPrice: "",
        },
  });

  const submit = (data: ProductFormOutputData) => {
    onSubmit({
      nome: data.name,
      categoria: data.category,
      capacidadeMensal: data.monthlyCapacity,
      unidade: unitLabel(data.unity),
      mesesDisponiveis: data.monthsAvaliable,
      organico: data.organic,
      precoSugerido: data.suggestedPrice,
    });
  };

  return (
    <>
      <Separator className="my-3" />
      <View className="flex-col gap-4">
        <InputField
          formControl={control}
          name="name"
          label="Nome do produto"
          placeholder="Ex.: Alface Americana"
          className="bg-transparent"
        />
        <InputField
          formControl={control}
          name="category"
          label="Categoria"
          placeholder="Ex.: Hortaliças"
          className="bg-transparent"
        />
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <NumberField
              formControl={control}
              name="monthlyCapacity"
              label="Capacidade mensal"
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
          name="suggestedPrice"
          label="Preço sugerido (por unidade)"
          className="bg-transparent"
        />

        <Controller
          control={control}
          name="monthsAvaliable"
          render={({ field, fieldState }) => (
            <View className="flex-col gap-2">
              <Text className="text-sm text-muted">Meses disponíveis</Text>
              <View className="flex-row flex-wrap gap-2">
                {MONTHS_OPTIONS.map((m) => {
                  const selected = (field.value ?? []).includes(m);
                  return (
                    <Pressable
                      key={m}
                      onPress={() =>
                        field.onChange(
                          selected
                            ? field.value.filter((v: string) => v !== m)
                            : [...(field.value ?? []), m]
                        )
                      }
                      className={clsx(
                        "px-3 py-2 rounded-xl border",
                        selected
                          ? "bg-primary/20 border-primary"
                          : "bg-card border-border"
                      )}
                    >
                      <Text
                        className={clsx(
                          "text-xs",
                          selected ? "text-primary" : "text-muted"
                        )}
                      >
                        {m}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {fieldState.error && (
                <Text className="text-destructive text-xs">
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="organic"
          render={({ field }) => (
            <Pressable
              onPress={() => field.onChange(!field.value)}
              className="flex-row items-center gap-2"
            >
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="p-3"
              />
              <Text className="text-sm">Produto orgânico</Text>
            </Pressable>
          )}
        />
      </View>
      <Separator className="my-3" />
      <Button
        className="rounded-2xl"
        disabled={submitting}
        onPress={handleSubmit(submit)}
      >
        <Text>{submitting ? "Salvando..." : "Salvar Produto"}</Text>
      </Button>
    </>
  );
}
