import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ItemChamada, ItemProposta, ProdutoAgricultor } from '../../types';
import { formatCurrency } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { Badge, Button, Field, Header, SectionTitle, SwitchRow } from '../ui/ui';

export function ItemPropostaModal({ visible, initial, chamadaItens, onClose, onSave }: { visible: boolean; initial?: ItemProposta; chamadaItens: ItemChamada[]; onClose: () => void; onSave: (item: ItemProposta) => void }) {
  const [produto, setProduto] = useState(initial?.produto || chamadaItens[0]?.produto || '');
  const selected = chamadaItens.find((i) => i.produto === produto);
  const [quantidade, setQuantidade] = useState(String(initial?.quantidade || ''));
  const [unidade, setUnidade] = useState(initial?.unidade || selected?.unidade || 'kg');
  const [preco, setPreco] = useState(String(initial?.precoPorUnidade || ''));
  const total = Number(quantidade) * Number(preco);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60"><View className="max-h-[88%] overflow-hidden rounded-t-[22px] bg-agro-panel"><Header title={initial ? 'Editar Item' : 'Novo Item da Proposta'} onBack={onClose} /><ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        <SectionTitle title="Produtos disponiveis" />
        {chamadaItens.map((item) => <TouchableOpacity key={item.id} className={`rounded-xl border p-3 ${produto === item.produto ? 'border-agro-green bg-agro-green/10' : 'border-agro-border bg-agro-bg'}`} onPress={() => { setProduto(item.produto); setUnidade(item.unidade); }}><Text className="text-sm font-bold text-white">{item.produto}</Text><Text className="text-xs text-agro-muted">{item.categoria}</Text></TouchableOpacity>)}
        <Field label="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
        <Field label="Unidade" value={unidade} onChangeText={setUnidade} />
        <Field label="Preco por unidade" value={preco} onChangeText={setPreco} keyboardType="numeric" />
        {total > 0 && <View className="flex-row justify-between rounded-[14px] border border-agro-green/30 bg-agro-green/10 p-3.5"><Text className="text-[15px] font-extrabold text-agro-green">Subtotal</Text><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(total)}</Text></View>}
        <Button onPress={() => { if (!produto.trim()) return notify('Informe o produto.'); if (Number(quantidade) <= 0) return notify('Quantidade deve ser maior que zero.'); if (Number(preco) <= 0) return notify('Preco deve ser maior que zero.'); onSave({ id: initial?.id || `pi-${Date.now()}`, produto, quantidade: Number(quantidade), unidade, precoPorUnidade: Number(preco), total }); }}>Adicionar item</Button>
      </ScrollView></View></View>
    </Modal>
  );
}
