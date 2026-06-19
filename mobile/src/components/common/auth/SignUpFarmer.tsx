import { ActivityIndicator, Alert, View } from "react-native";
import React, { useState } from "react";
import InputField from "../form/InputField";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import z from "zod";
import { PHONE_REGEX } from "@/utils/regex";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneField from "../form/PhoneField";
import CpfCNPJField from "../form/CpfCNPJField";
import { ChevronRight } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

const signUpFarmerFormSchema = z
  .object({
    name: z.string().trim().min(1, "O nome é obrigatório"),
    phone: z
      .string()
      .trim()
      .min(1, "O telefone é obrigatório")
      .regex(PHONE_REGEX, "Telefone inválido"),
    cpf_cnpj: z
      .string()
      .trim()
      .min(1, "O CPF ou CNPJ é obrigatório")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 11
          ? cpf.isValid(digits)
          : cnpj.isValid(digits);
      }, "CPF/CNPJ inválido"),
    caf: z.string().trim().min(1, "O CAF é obrigatório"),
    email: z
      .string()
      .trim()
      .min(1, "O Email é obrigatório")
      .email("E-mail inválido"),
    password: z
      .string()
      .trim()
      .min(1, "A senha é obrigatória")
      .min(8, "A senha deve conter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve possuir uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve possuir uma letra maiúscula")
      .regex(/\d/, "A senha deve possuir um número")
      .regex(/[@$!%*?&.#_\-]/, "A senha deve possuir um caractere especial"),
    confirmPassword: z.string().trim().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

type SignUpFarmerFormData = z.infer<typeof signUpFarmerFormSchema>;

export default function SignUpFarmer() {
  const { signup } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<SignUpFarmerFormData>({
    resolver: zodResolver(signUpFarmerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      cpf_cnpj: "",
      caf: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFarmerFormData) => {
    setSubmitting(true);
    try {
      await signup({
        userType: "farmer",
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        cpfCnpj: data.cpf_cnpj,
        caf: data.caf,
      });
    } catch (e: any) {
      Alert.alert(
        "Erro no cadastro",
        e?.response?.data?.message ?? e?.message ?? "Não foi possível cadastrar"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex gap-5">
      <InputField
        formControl={control}
        name="name"
        label="Nome"
        placeholder="Nome completo"
      />

      <PhoneField formControl={control} name="phone" label="Telefone" />

      <CpfCNPJField formControl={control} name="cpf_cnpj" label="CPF/CNPJ" />

      <InputField
        formControl={control}
        name="caf"
        label="CAF"
        placeholder="CAF-TO-2026-000000"
      />
      <InputField
        formControl={control}
        name="email"
        label="E-mail"
        placeholder="seu@email.com"
      />
      <InputField
        formControl={control}
        name="password"
        label="Senha"
        placeholder="******"
        secureTextEntry
      />
      <InputField
        formControl={control}
        name="confirmPassword"
        label="Confirmar senha"
        placeholder="******"
        secureTextEntry
      />
      <Button
        className="flex gap-1"
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="text-white">Criar Conta</Text>
            <ChevronRight size={15} color="white" />
          </>
        )}
      </Button>
    </View>
  );
}
