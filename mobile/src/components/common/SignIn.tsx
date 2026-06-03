import React from "react";
import { View } from "react-native";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

export default function SignIn() {
  return (
    <View>
      <Label>E-mail</Label>
      <Input placeholder="seu@email.com" />
      <Label>Senha</Label>
      <Input placeholder="Senha" secureTextEntry />
      <Button>
        <Text>Entrar</Text>
      </Button>
    </View>
  );
}
