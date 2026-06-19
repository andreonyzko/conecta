import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Emulador Android usa 10.0.2.2 para alcancar o localhost do PC.
// Device fisico/iOS: defina EXPO_PUBLIC_API_URL com o IP da LAN (ex.: http://192.168.0.10:3333/api).
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3333/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o token JWT (salvo no login) em toda requisicao.
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
