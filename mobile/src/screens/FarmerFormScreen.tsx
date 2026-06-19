import { Alert, Pressable, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/common/layout/Header";
import Loading from "@/components/common/layout/Loading";
import { useAuth } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import z from "zod";
import { PHONE_REGEX } from "@/utils/regex";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { farmerService } from "@/services/FarmerService";
import InputField from "@/components/common/form/InputField";
import PhoneField from "@/components/common/form/PhoneField";
import ProductForm from "@/components/common/form/ProductForm";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import { THEME } from "@/lib/theme";
import { Leaf, Package, Plus, Trash, Truck, X } from "lucide-react-native";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BottomSheetContent from "@/components/common/layout/BottomSheetContent";
import { useAsync } from "@/lib/useAsync";
import { FarmerProduct } from "@/types/FarmerProduct";
import { CreateProductDTO } from "@/types/Backend";

const editFarmerSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
  caf: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .min(1, "O telefone é obrigatório")
    .regex(PHONE_REGEX, "Telefone inválido"),
  email: z.string().trim().min(1, "O e-mail é obrigatório").email("E-mail inválido"),
  delivery: z.boolean(),
});

type EditFarmerData = z.infer<typeof editFarmerSchema>;

export default function FarmerFormScreen() {
  const { user } = useAuth();

  const { data: farmer, loading } = useAsync(
    () => farmerService.getFarmer(user!.id),
    [user?.id]
  );

  const { control, handleSubmit } = useForm<EditFarmerData>({
    resolver: zodResolver(editFarmerSchema),
    values: farmer
      ? {
          name: farmer.name,
          caf: farmer.caf,
          phone: farmer.phone,
          email: farmer.email,
          delivery: farmer.delivery,
        }
      : undefined,
  });

  const [products, setProducts] = useState<FarmerProduct[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FarmerProduct | undefined>(undefined);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingData, setSavingData] = useState(false);

  useEffect(() => {
    if (farmer) setProducts(farmer.products);
  }, [farmer]);

  if (!user || user.type !== "farmer") return <Redirect href="/" />;

  if (loading) {
    return (
      <View className="flex-1">
        <Header title="Editar Perfil" />
        <Loading />
      </View>
    );
  }

  const openNew = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const openEdit = (p: FarmerProduct) => {
    setEditing(p);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(undefined);
  };

  const handleProductSubmit = async (dto: CreateProductDTO) => {
    setSavingProduct(true);
    try {
      if (editing) {
        const updated = await farmerService.updateProduct(user.id, editing.id, dto);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await farmerService.addProduct(user.id, dto);
        setProducts((prev) => [...prev, created]);
      }
      closeDialog();
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.response?.data?.message ?? "Não foi possível salvar o produto"
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleRemoveProduct = (p: FarmerProduct) => {
    Alert.alert("Remover produto", `Remover "${p.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await farmerService.removeProduct(user.id, p.id);
            setProducts((prev) => prev.filter((x) => x.id !== p.id));
          } catch (e: any) {
            Alert.alert(
              "Erro",
              e?.response?.data?.message ?? "Não foi possível remover"
            );
          }
        },
      },
    ]);
  };

  const onSaveData = async (data: EditFarmerData) => {
    setSavingData(true);
    try {
      await farmerService.update(user.id, {
        nome: data.name,
        caf: data.caf,
        telefone: data.phone,
        email: data.email,
        realizaEntrega: data.delivery,
      });
      Alert.alert("Sucesso", "Perfil atualizado!");
      router.replace(`/farmer/${user.id}`);
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.response?.data?.message ?? "Não foi possível salvar"
      );
    } finally {
      setSavingData(false);
    }
  };

  return (
    <View className="flex-1">
      <Header title="Editar Perfil" />
      <ScrollView contentContainerClassName="pb-44">
        <View className="p-5 flex-col gap-4">
          <InputField formControl={control} name="name" label="Nome" className="bg-card" />
          <PhoneField formControl={control} name="phone" label="Telefone" className="bg-card" />
          <InputField formControl={control} name="email" label="E-mail" className="bg-card" />
          <InputField formControl={control} name="caf" label="CAF" className="bg-card" />

          <View className="bg-card flex-row items-center gap-2 p-4 border border-border rounded-2xl">
            <Controller
              control={control}
              name="delivery"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="p-3"
                />
              )}
            />
            <Truck size={20} color={THEME.muted} />
            <Text className="text-sm">Realizo entrega própria</Text>
          </View>

          <View className="flex-row items-center mt-2">
            <View className="flex-1 flex-row items-center gap-2">
              <Package color={THEME.primary} />
              <Text className="font-semibold text-white">Meus Produtos</Text>
            </View>
            <Dialog open={dialogOpen}>
              <DialogTrigger>
                <Button variant="ghost" onPress={openNew}>
                  <Plus size={15} color={THEME.primary} />
                  <Text className="text-primary">Adicionar</Text>
                </Button>
              </DialogTrigger>
              <BottomSheetContent className="left-0 right-0">
                <DialogHeader className="flex-row items-center">
                  <DialogTitle className="flex-1">
                    {editing ? "Editar Produto" : "Novo Produto"}
                  </DialogTitle>
                  <Button variant="ghost" onPress={closeDialog}>
                    <X color={THEME.muted} />
                  </Button>
                </DialogHeader>
                <ScrollView className="max-h-[480px]">
                  <ProductForm
                    key={editing?.id ?? "new"}
                    initial={editing}
                    submitting={savingProduct}
                    onSubmit={handleProductSubmit}
                  />
                </ScrollView>
              </BottomSheetContent>
            </Dialog>
          </View>

          {products.length === 0 && (
            <Text className="text-muted text-sm">Nenhum produto cadastrado.</Text>
          )}
          {products.map((p) => (
            <View
              key={p.id}
              className="bg-card border border-border rounded-2xl p-4 flex-row items-center gap-2"
            >
              <Pressable className="flex-1" onPress={() => openEdit(p)}>
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold">{p.name}</Text>
                  {p.organic && <Leaf size={13} color={THEME.primary} />}
                </View>
                <Text className="text-xs text-muted">
                  {p.category} • {p.monthlyCapacity} {p.unity}/mês
                </Text>
              </Pressable>
              <Button variant="ghost" onPress={() => handleRemoveProduct(p)}>
                <Trash size={18} color={THEME.destructive} />
              </Button>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-border bg-background">
        <Button className="rounded-2xl" disabled={savingData} onPress={handleSubmit(onSaveData)}>
          <Text>{savingData ? "Salvando..." : "Salvar Alterações"}</Text>
        </Button>
      </View>
    </View>
  );
}
