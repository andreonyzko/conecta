import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/AuthContext";
import { THEME } from "@/lib/theme";
import clsx from "clsx";
import { Redirect, router, usePathname } from "expo-router";
import { FileText, House, SquarePlus, User } from "lucide-react-native";
import { View } from "react-native";

export default function BottomNavBar() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/" />;

  const pathname = usePathname();
  let route: "calls" | "proposals" | "publish" | "profile" | undefined;
  if (pathname == "/calls") route = "calls";
  else if (pathname == `/farmer/${user.id}/proposals`) route = "proposals";
  else if (pathname == "/calls/new") route = "publish";
  else if (pathname == `/farmer/${user.id}` || `/institution/${user.id}`)
    route = "profile";

  return (
    <View className="absolute bottom-0 flex-row bg-card border-t border-border py-2 px-2">
      <Button
        variant="ghost"
        className="flex-1 flex-col h-max"
        onPress={() => router.push("/calls")}
      >
        <Text
          className={clsx("text-muted", route == "calls" && "text-primary")}
        >
          <House color={route === "calls" ? THEME.primary : THEME.muted}/>
        </Text>
        <Text
          className={clsx(
            "text-xs text-muted",
            route == "calls" && "text-primary"
          )}
        >
          Chamadas
        </Text>
      </Button>
      {user.type === "farmer" && (
        <Button
          variant="ghost"
          className="flex-1 flex-col h-max"
          onPress={() => router.push(`/farmer/${user.id}/proposals`)}
        >
          <Text
            className={clsx(
              "text-muted",
              route == "proposals" && "text-primary"
            )}
          >
            <FileText color={route === "proposals" ? THEME.primary : THEME.muted}/>
          </Text>
          <Text
            className={clsx(
              "text-xs text-muted",
              route == "proposals" && "text-primary"
            )}
          >
            Propostas
          </Text>
        </Button>
      )}
      {user.type === "institution" && (
        <Button
          variant="ghost"
          className="flex-1 flex-col h-max"
          onPress={() => router.push(`/calls/new`)}
        >
          <Text
            className={clsx("text-muted", route == "publish" && "text-primary")}
          >
            <SquarePlus color={route === "publish" ? THEME.primary : THEME.muted}/>
          </Text>
          <Text
            className={clsx(
              "text-xs text-muted",
              route == "publish" && "text-primary"
            )}
          >
            Publicar
          </Text>
        </Button>
      )}
      <Button
        variant="ghost"
        className="flex-1 flex-col h-max"
        onPress={() => router.push(`/${user.type}/${user.id}`)}
      >
        <Text
          className={clsx("text-muted", route == "profile" && "text-primary")}
        >
          <User color={route === "profile" ? THEME.primary : THEME.muted}/>
        </Text>
        <Text
          className={clsx(
            "text-xs text-muted",
            route == "profile" && "text-primary"
          )}
        >
          Perfil
        </Text>
      </Button>
    </View>
  );
}
