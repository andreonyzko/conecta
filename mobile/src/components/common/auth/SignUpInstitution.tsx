import { View } from "react-native";
import React from "react";
import InputField from "../form/InputField";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import z from "zod";
import { PHONE_REGEX } from "@/utils/regex";
import { cnpj } from "cpf-cnpj-validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneField from "../form/PhoneField";
import CNPJField from "../form/CNPJField";
import NumberField from "../form/NumberField";
import { ChevronRight } from "lucide-react-native";

const signUpInstitutionSchema = z
  .object({
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
      .refine(
        (value) => cnpj.isValid(value.replace(/\D/g, "")),
        "CNPJ inválido"
      ),
    students: z.coerce
      .number()
      .int("O número de estudantes deve ser inteiro")
      .min(50, "A instituição deve conter pelo menos 50 alunos"),
    email: z
      .string()
      .trim()
      .min(1, "O E-mail é obrigatório")
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

type SignUpInstitutionFormData = z.input<typeof signUpInstitutionSchema>;

export default function SignUpInstitution() {
  const { control, handleSubmit } = useForm<SignUpInstitutionFormData>({
    resolver: zodResolver(signUpInstitutionSchema),
    defaultValues: {
      name: "",
      phone: "",
      cnpj: "",
      students: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <View className="flex gap-5">
      <InputField
        formControl={control}
        name="name"
        label="Instituição"
        placeholder="Nome da instituição"
      />

      <PhoneField formControl={control} name="phone" label="Telefone" />

      <CNPJField formControl={control} name="cnpj" label="CNPJ" />

      <NumberField
        formControl={control}
        name="students"
        label="Número de estudantes"
        placeholder="850"
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
      />
      <InputField
        formControl={control}
        name="confirmPassword"
        label="Confirmar Senha"
        placeholder="******"
      />

      <Button className="flex gap-1" onPress={handleSubmit(() => {})}>
        <Text className="text-white">Criar Conta</Text>
        <ChevronRight size={15} color="white" />
      </Button>
    </View>
  );
}
