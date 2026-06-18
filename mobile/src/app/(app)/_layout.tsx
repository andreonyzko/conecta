import BottomNavBar from "@/components/common/layout/BottomNavBar";
import { Stack, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NavBarLayout() {
  const pathname = usePathname();

  const showNavbar = /^\/(calls|farmer\/[^/]+|institution\/[^/]+)$/.test(pathname);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      {showNavbar && <BottomNavBar />}
    </>
  );
}
