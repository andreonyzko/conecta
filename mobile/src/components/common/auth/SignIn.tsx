import React, { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Text } from "../../ui/text";
import InputField from "../form/InputField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight } from "lucide-react-native";

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z.string().trim().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function SignIn() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      Alert.alert(
        "Erro ao entrar",
        e?.response?.data?.message ??
          e?.message ??
          "Não foi possível fazer login. Verifique suas credenciais e a conexão."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex gap-5">
      <InputField
        name="email"
        label="E-mail"
        placeholder="seu@email.com"
        formControl={control}
      />
      <InputField
        name="password"
        label="Senha"
        placeholder="******"
        formControl={control}
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
            <Text className="text-white">Entrar</Text>
            <ChevronRight size={15} color="white" />
          </>
        )}
      </Button>
    </View>
  );
}
