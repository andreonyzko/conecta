import React, { useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';
import { Agricultor, Chamada, Instituicao, ItemChamada, ItemProposta, ProdutoAgricultor, Proposta, PropostaStatus, UserRole } from '../../types';
import { BRAND_NAME, BRAND_TAGLINE } from '../../config/branding';
import { Nav, Route } from '../../navigation/types';
import { C } from '../../shared/theme';
import { logo } from '../../shared/assets';
import { formatCurrency, formatDate } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { statusChamada, statusProposta } from '../../shared/status';
import { KeyboardAwareScrollView, Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../ui/ui';
import { NotFound } from '../ui/NotFound';

export function FinalizarModal({
  visible,
  agricultores,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  agricultores: Agricultor[];
  onClose: () => void;
  onConfirm: (items: Array<{ agricultorId: string; nota: number; comentario: string }>) => void;
}) {
  const [items, setItems] = useState(agricultores.map((a) => ({ agricultorId: a.id, nota: 5, comentario: '' })));
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="max-h-[88%] overflow-hidden rounded-t-[22px] bg-agro-panel">
          <Header title="Encerrar chamada" subtitle="Avalie os agricultores vencedores" onBack={onClose} />
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7">
            {agricultores.map((a) => {
              const item = items.find((x) => x.agricultorId === a.id) ?? { agricultorId: a.id, nota: 5, comentario: '' };
              return (
                <View key={a.id} className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4">
                  <Text className="text-sm font-bold text-white">{a.nome}</Text>
                  <View className="flex-row items-center gap-2.5">
                    {[1, 2, 3, 4, 5].map((nota) => (
                      <TouchableOpacity key={nota} onPress={() => setItems((prev) => prev.map((x) => x.agricultorId === a.id ? { ...x, nota } : x))}>
                        <Star size={24} color={nota <= item.nota ? C.yellow : C.dim} fill={nota <= item.nota ? C.yellow : 'transparent'} />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Field label="Comentario" value={item.comentario} multiline onChangeText={(comentario) => setItems((prev) => prev.map((x) => x.agricultorId === a.id ? { ...x, comentario } : x))} />
                </View>
              );
            })}
            <Button onPress={() => onConfirm(items)}>Finalizar chamada</Button>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
}
