import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ItemChamada, ItemProposta, ProdutoAgricultor } from '../../types';
import { formatCurrency } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { Badge, Button, Field, Header, SectionTitle, SwitchRow } from '../ui/ui';

export function ItemChamadaModal({ visible, initial, onClose, onSave }: { visible: boolean; initial?: ItemChamada; onClose: () => void; onSave: (item: ItemChamada) => void }) {
  const [produto, setProduto] = useState(initial?.produto || '');
  const [categoria, setCategoria] = useState(initial?.categoria || '');
  const [quantidade, setQuantidade] = useState(String(initial?.quantidade || ''));
  const [unidade, setUnidade] = useState(initial?.unidade || 'kg');
  const [frequencia, setFrequencia] = useState(initial?.frequencia || 'Semanal');
  const [preco, setPreco] = useState(String(initial?.precoReferencia || ''));
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60"><View className="max-h-[88%] overflow-hidden rounded-t-[22px] bg-agro-panel"><Header title={initial ? 'Editar Item' : 'Novo Item'} onBack={onClose} /><ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        <Field label="Produto" value={produto} onChangeText={setProduto} />
        <Field label="Categoria" value={categoria} onChangeText={setCategoria} />
        <Field label="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
        <Field label="Unidade" value={unidade} onChangeText={setUnidade} />
        <Field label="Frequencia de entrega" value={frequencia} onChangeText={setFrequencia} />
        <Field label="Preco de referencia" value={preco} onChangeText={setPreco} keyboardType="numeric" />
        <Button onPress={() => { if (!produto.trim()) return notify('Informe o produto.'); if (Number(quantidade) <= 0) return notify('Quantidade deve ser maior que zero.'); onSave({ id: initial?.id || `item-${Date.now()}`, produto, categoria, quantidade: Number(quantidade), unidade, frequencia, precoReferencia: Number(preco) }); }}>Salvar</Button>
      </ScrollView></View></View>
    </Modal>
  );
}
