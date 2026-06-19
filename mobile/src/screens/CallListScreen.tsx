import { Image, RefreshControl, ScrollView, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CallCard from "@/components/common/cards/CallCard";
import { callService } from "@/services/CallService";
import { useAsync } from "@/lib/useAsync";
import Loading from "@/components/common/layout/Loading";
import { Search } from "lucide-react-native";
import { THEME } from "@/lib/theme";

export default function CallListScreen() {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [callsList, setCallsList] = useState<"all" | "mine">("all");

  const { data: allCalls, loading, reload } = useAsync(() => callService.getAll(), [], "call-list");

  const calls = useMemo(() => {
    let list = allCalls ?? [];

    if (callsList === "mine") {
      list = list.filter((c) => c.institutionId === user?.id);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.itens.some((i) => i.product.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allCalls, callsList, search, user?.id]);

  const handleSearchBtn = () => {
    setSearchOpen((prev) => !prev);
    setSearch("");
  };

  return (
    <View>
      <View
        className={"border-b border-border bg-card px-4 py-2 flex-col gap-2"}
      >
        <View className="flex-row items-center">
          <Image
            source={require("@/assets/logo-t.png")}
            resizeMode="contain"
            className="h-12 w-40 self-center flex-1"
          />
          <Text className="text-muted" onPress={handleSearchBtn}>
            <Search color={THEME.accent} />
          </Text>
        </View>
        {searchOpen && (
          <Input
            className="py-2"
            placeholder="Buscar chamada..."
            value={search}
            onChangeText={setSearch}
          />
        )}
        {user?.type === "institution" && (
          <Tabs
            value={callsList}
            onValueChange={(value) => setCallsList(value as "all" | "mine")}
          >
            <TabsList className="w-full bg-transparent">
              <TabsTrigger
                value="all"
                className={clsx(
                  "flex-1 rounded-none",
                  callsList === "all" && "border-0 border-b border-primary"
                )}
              >
                <Text
                  className={clsx(
                    "text-muted",
                    callsList === "all" && "text-primary"
                  )}
                >
                  Todas
                </Text>
              </TabsTrigger>
              <TabsTrigger
                value="mine"
                className={clsx(
                  "flex-1 rounded-none",
                  callsList === "mine" && "border-0 border-b border-primary"
                )}
              >
                <Text
                  className={clsx(
                    "text-muted",
                    callsList === "mine" && "text-primary"
                  )}
                >
                  Minhas
                </Text>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </View>
      <ScrollView
        className="p-4"
        contentContainerClassName="pb-52"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} colors={[THEME.primary]} tintColor={THEME.primary} />}
      >
        <View className="flex-col gap-5">
          {loading && !allCalls && <Loading />}
          {!loading && calls.length === 0 && (
            <Text className="text-muted">Nenhuma chamada encontrada.</Text>
          )}
          {calls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
