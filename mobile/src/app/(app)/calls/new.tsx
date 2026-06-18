import { useAuth } from "@/context/AuthContext";
import CallFormScreen from "@/screens/CallFormScreen";
import { Redirect } from "expo-router";

export default function NewCallRoute() {
  const { user } = useAuth();

  if(!user || user.type !== "institution") return <Redirect href="/"/>

  return <CallFormScreen/>
}