import { View } from "react-native";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import SignUpFarmer from "./SignUpFarmer";
import SignUpInstitution from "./SignUpInstitution";
import { Text } from "../../ui/text";
import clsx from "clsx";
import { Button } from "../../ui/button";
import { THEME } from "@/lib/theme";
import { Landmark, Leaf } from "lucide-react-native";

export default function SignUp() {
  const [userType, setUserType] = useState("farmer");

  return (
    <View>
      <Tabs value={userType} onValueChange={setUserType}>
        <TabsList className="w-full bg-card flex justify-between mb-2">
          <TabsTrigger
            value="farmer"
            asChild
            className={clsx(
              "p-4 bg-background border border-border",
              userType === "farmer" && "bg-primary/30 border border-primary"
            )}
          >
            <Button variant="ghost" className="flex-col w-36 h-32">
              <View className="w-full flex-row gap-2 items-center">
                <Leaf size={20} color={userType === "farmer" ? THEME.primary : THEME.muted}/>
                <Text className="text-sm">Agricultor</Text>
              </View>
              <Text className="text-xs text-muted">
                Envia propostas e gerencia produtos.
              </Text>
            </Button>
          </TabsTrigger>
          <TabsTrigger
            value="institution"
            asChild
            className={clsx(
              "p-4 bg-background border border-border",
              userType === "institution" &&
                "bg-primary/30 border border-primary"
            )}
          >
            <Button variant="ghost" className="flex-col w-36 h-32">
              <View className="w-full flex-row gap-2 items-center">
                <Landmark size={20} color={userType === "institution" ? THEME.primary : THEME.muted}/>
                <Text className="text-sm">Instituição</Text>
              </View>
              <Text className="text-xs text-muted">
                Publica chamadas e analisa propostas.
              </Text>
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="farmer">
          <SignUpFarmer />
        </TabsContent>
        <TabsContent value="institution">
          <SignUpInstitution />
        </TabsContent>
      </Tabs>
    </View>
  );
}
