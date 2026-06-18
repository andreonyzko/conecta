import { View, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUp from "@/components/common/auth/SignUp";
import SignIn from "@/components/common/auth/SignIn";
import { Text } from "@/components/ui/text";
import clsx from "clsx";

export default function AuthScreen() {
  const [action, setAction] = useState("signin");

  return (
    <ScrollView>
      <View className="flex-1 items-center p-10 px-2">
        <View className="w-8/12 mb-10">
          <Image
            source={require("@/assets/logo-t.png")}
            resizeMode="contain"
            className="h-[120px] w-full"
          />
          <Text className="text-sm text-muted text-center">
            Conectando agricultores familiares com instituições de ensino
          </Text>
        </View>
        <View className="bg-card w-11/12 p-6 rounded-2xl border border-border">
          <Tabs value={action} onValueChange={setAction}>
            <TabsList className="w-full flex bg-background mb-2">
              <TabsTrigger
                value="signin"
                className={clsx(
                  "flex-1 p-2",
                  action === "signin" && "bg-primary"
                )}
              >
                <Text>Login</Text>
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={clsx(
                  "flex-1 p-2",
                  action === "signup" && "bg-primary"
                )}
              >
                <Text>Cadastro</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignIn />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp />
            </TabsContent>
          </Tabs>
        </View>
      </View>
    </ScrollView>
  );
}
