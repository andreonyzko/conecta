import React, { useEffect, useState } from "react";
import { Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Farmer } from "@/types/Farmer";
import { Star, X } from "lucide-react-native";
import { THEME } from "@/lib/theme";

export interface FinalizarData {
  agricultorId: string;
  grade: number;
  comment: string;
}

type FinalizarChamadaModalProps = {
  visible: boolean;
  farmers: Farmer[];
  onClose: () => void;
  onConfirm: (data: FinalizarData[]) => void;
};

export default function FinalizarChamadaModal({
  visible,
  farmers,
  onClose,
  onConfirm,
}: FinalizarChamadaModalProps) {
  const [reviews, setReviews] = useState<FinalizarData[]>([]);

  useEffect(() => {
    if (farmers.length > 0) {
      setReviews(farmers.map((f) => ({ agricultorId: f.id, grade: 5, comment: "" })));
    }
  }, [farmers]);

  const submit = () => {
    const allHaveComment = reviews.every((r) => r.comment.trim());
    if (!allHaveComment) {
      alert("Todos os comentários são obrigatórios");
      return;
    }
    onConfirm(reviews);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/60">
        <View className="max-h-[88%] rounded-t-3xl bg-background">
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <View>
              <Text className="font-bold">Encerrar Chamada</Text>
              <Text className="text-xs text-muted">Avalie os agricultores</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={THEME.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerClassName="p-4 gap-4 pb-8">
            {farmers.map((farmer) => {
              const review = reviews.find((r) => r.agricultorId === farmer.id);
              if (!review) return null;
              return (
                <View key={farmer.id} className="bg-card border border-border rounded-2xl p-4 gap-3">
                  <Text className="font-semibold">{farmer.name}</Text>
                  <View className="flex-row gap-1">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <TouchableOpacity
                        key={grade}
                        onPress={() =>
                          setReviews((prev) =>
                            prev.map((r) =>
                              r.agricultorId === farmer.id ? { ...r, grade } : r
                            )
                          )
                        }
                      >
                        <Star
                          size={24}
                          color={grade <= review.grade ? THEME.primary : THEME.muted}
                          fill={grade <= review.grade ? THEME.primary : "transparent"}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    placeholder="Comentário obrigatório"
                    placeholderTextColor={THEME.muted}
                    value={review.comment}
                    onChangeText={(comment: string) =>
                      setReviews((prev) =>
                        prev.map((r) =>
                          r.agricultorId === farmer.id ? { ...r, comment } : r
                        )
                      )
                    }
                    multiline
                    className="bg-background border border-border rounded-xl p-3 text-white min-h-20"
                  />
                </View>
              );
            })}
            <Button onPress={submit} className="rounded-2xl">
              <Text>Finalizar Chamada</Text>
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
