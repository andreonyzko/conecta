import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { ItemChamada, ItemProposta, ProdutoAgricultor } from '../../types';
import { formatCurrency } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { KeyboardAwareScrollView, Badge, Button, Field, Header, SectionTitle, SwitchRow } from '../ui/ui';

export function ItemPropostaModal({ visible, initial, chamadaItens, onClose, onSave }: { visible: boolean; initial?: ItemProposta; chamadaItens: ItemChamada[]; onClose: () => void; onSave: (item: ItemProposta) => void }) {
  const [produto, setProduto] = useState(initial?.produto || '');
  const [isSelectingProduto, setIsSelectingProduto] = useState(false);
  const selected = chamadaItens.find((i) => i.produto === produto);
  const [quantidade, setQuantidade] = useState(String(initial?.quantidade || ''));
  const [unidade, setUnidade] = useState(initial?.unidade || selected?.unidade || 'kg');
  const [preco, setPreco] = useState(String(initial?.precoPorUnidade || ''));
  const total = Number(quantidade) * Number(preco);

  useEffect(() => {
    if (!visible) return;

    const nextProduto = initial?.produto || '';
    const nextSelected = chamadaItens.find((i) => i.produto === nextProduto);
    setProduto(nextProduto);
    setQuantidade(String(initial?.quantidade || ''));
    setUnidade(initial?.unidade || nextSelected?.unidade || 'kg');
    setPreco(String(initial?.precoPorUnidade || ''));
    setIsSelectingProduto(false);
  }, [visible, initial, chamadaItens]);

  const handleSave = () => {
    if (!produto.trim()) return notify('Selecione o produto.');
    if (Number(quantidade) <= 0) return notify('Quantidade deve ser maior que zero.');
    if (Number(preco) <= 0) return notify('Preco deve ser maior que zero.');
    onSave({ id: initial?.id || `pi-${Date.now()}`, produto, quantidade: Number(quantidade), unidade, precoPorUnidade: Number(preco), total });
    setProduto('');
    setQuantidade('');
    setUnidade('kg');
    setPreco('');
    setIsSelectingProduto(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60"><View className="max-h-[88%] overflow-hidden rounded-t-[22px] bg-agro-panel"><Header title={initial ? 'Editar Item' : 'Novo Item da Proposta'} onBack={onClose} /><KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7">
        <Text className="text-[13px] text-agro-muted">Produto</Text>
        <TouchableOpacity
          onPress={() => setIsSelectingProduto((current) => !current)}
          className="rounded-xl border border-agro-border bg-agro-bg px-3.5 py-3"
        >
          <Text className={produto ? 'text-sm text-white' : 'text-sm text-agro-dim'}>{produto || 'Selecionar produto'}</Text>
          {!!selected && <Text className="mt-1 text-xs text-agro-muted">{selected.categoria}</Text>}
        </TouchableOpacity>
        {isSelectingProduto && (
          <View className="gap-2 rounded-[14px] border border-agro-border bg-agro-bg p-2">
            {chamadaItens.map((item) => (
              <TouchableOpacity
                key={item.id}
                className={`rounded-xl border p-3 ${produto === item.produto ? 'border-agro-green bg-agro-green/10' : 'border-agro-border bg-agro-panel'}`}
                onPress={() => {
                  setProduto(item.produto);
                  setUnidade(item.unidade);
                  setIsSelectingProduto(false);
                }}
              >
                <Text className="text-sm font-bold text-white">{item.produto}</Text>
                <Text className="text-xs text-agro-muted">{item.categoria}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Field label="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
        <Field label="Unidade" value={unidade} onChangeText={setUnidade} />
        <Field label="Preco por unidade" value={preco} onChangeText={setPreco} keyboardType="numeric" />
        {total > 0 && <View className="flex-row justify-between rounded-[14px] border border-agro-green/30 bg-agro-green/10 p-3.5"><Text className="text-[15px] font-extrabold text-agro-green">Subtotal</Text><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(total)}</Text></View>}
        <Button onPress={handleSave}>{initial ? 'Salvar item' : 'Adicionar item'}</Button>
      </KeyboardAwareScrollView></View></View>
    </Modal>
  );
}
