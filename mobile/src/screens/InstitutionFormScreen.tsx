import { Alert, View } from "react-native";
import React from "react";
import Header from "@/components/common/layout/Header";
import Loading from "@/components/common/layout/Loading";
import { useAuth } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import z from "zod";
import { PHONE_REGEX } from "@/utils/regex";
import { cnpj } from "cpf-cnpj-validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { institutionService } from "@/services/InstitutionService";
import InputField from "@/components/common/form/InputField";
import CNPJField from "@/components/common/form/CNPJField";
import PhoneField from "@/components/common/form/PhoneField";
import NumberField from "@/components/common/form/NumberField";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAsync } from "@/lib/useAsync";

const editInstitutionSchema = z.object({
  name: z.string().trim().min(1, "O nome da instituição é obrigatório"),
  phone: z
    .string()
    .trim()
    .min(1, "O telefone é obrigatório")
    .regex(PHONE_REGEX, "Telefone inválido"),
  cnpj: z
    .string()
    .trim()
    .min(1, "O CNPJ é obrigatório")
    .refine((value) => cnpj.isValid(value.replace(/\D/g, "")), "CNPJ inválido"),
  students: z.coerce
    .number()
    .int("O número de estudantes deve ser inteiro")
    .min(50, "A instituição deve conter pelo menos 50 alunos"),
  email: z
    .string()
    .trim()
    .min(1, "O E-mail é obrigatório")
    .email("E-mail inválido"),
});

type EditInstitutionFormInputData = z.input<typeof editInstitutionSchema>;
type EditInstitutionFormOutputData = z.output<typeof editInstitutionSchema>;

export default function InstitutionFormScreen() {
  const { user } = useAuth();

  const { data: institution, loading } = useAsync(
    () => institutionService.getInstitution(user!.id),
    [user?.id]
  );

  const { control, handleSubmit } = useForm<
    EditInstitutionFormInputData,
    any,
    EditInstitutionFormOutputData
  >({
    resolver: zodResolver(editInstitutionSchema),
    values: institution
      ? {
          name: institution.name,
          cnpj: institution.cnpj,
          phone: institution.phone,
          email: institution.email,
          students: String(institution.studentsAmount),
        }
      : undefined,
  });

  const [saving, setSaving] = React.useState(false);

  if (!user || user.type !== "institution") return <Redirect href="/" />;

  if (loading) {
    return (
      <View className="flex-1">
        <Header title="Editar Perfil" />
        <Loading />
      </View>
    );
  }

  const handleSave = async (data: EditInstitutionFormOutputData) => {
    setSaving(true);
    try {
      await institutionService.update(user.id, {
        nome: data.name,
        telefone: data.phone,
        email: data.email,
        numeroAlunos: data.students,
      });
      Alert.alert("Sucesso", "Perfil atualizado!");
      router.replace(`/institution/${user.id}`);
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.response?.data?.message ?? "Não foi possível salvar"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1">
      <Header title="Editar Perfil" />
      <View className="p-5 flex-col gap-4">
        <InputField formControl={control} name="name" label="Nome da instituição" className="bg-card" />
        <CNPJField formControl={control} name="cnpj" label="CNPJ" className="bg-card" />
        <PhoneField formControl={control} name="phone" label="Telefone" className="bg-card" />
        <InputField formControl={control} name="email" label="E-mail" className="bg-card" />
        <NumberField formControl={control} name="students" label="Número de alunos" className="bg-card" />
      </View>
      <View className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-border">
        <Button className="rounded-2xl" disabled={saving} onPress={handleSubmit(handleSave)}>
          <Text>{saving ? "Salvando..." : "Salvar Alterações"}</Text>
        </Button>
      </View>
    </View>
  );
}
