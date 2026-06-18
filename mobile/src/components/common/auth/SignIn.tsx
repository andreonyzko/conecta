import React from "react";
import { View } from "react-native";
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
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.email);
    } catch (_) {}
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
      <Button className="flex gap-1" onPress={handleSubmit(onSubmit)}>
        <Text className="text-white">Entrar</Text>
        <ChevronRight size={15} color="white" />
      </Button>
    </View>
  );
}
