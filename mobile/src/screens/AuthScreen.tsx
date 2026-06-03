import { View, Image } from "react-native";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUp from "@/components/common/SignUp";
import SignIn from "@/components/common/SignIn";
import { Text } from "@/components/ui/text";

export default function AuthScreen() {
  const [action, setAction] = useState("signin");

  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-10/12 justify-center">
        <View className="w-30 h-20">
          <Image source={require("@/assets/logo-t.png")} className="w-full h-full" resizeMode="stretch"/>
        </View>
        <View>
          <Tabs value={action} onValueChange={setAction}>
            <TabsList>
              <TabsTrigger value="signin">
                <Text>Login</Text>
              </TabsTrigger>
              <TabsTrigger value="signup">
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
    </View>
  );
}
