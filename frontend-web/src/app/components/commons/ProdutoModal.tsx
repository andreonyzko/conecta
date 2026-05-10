import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ItemChamada, ItemProposta, ProdutoAgricultor } from '../../types';
import { formatCurrency } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { Badge, Button, Field, Header, SectionTitle, SwitchRow } from '../ui/ui';

export function ProdutoModal({ visible, initial, onClose, onSave }: { visible: boolean; initial?: ProdutoAgricultor; onClose: () => void; onSave: (produto: ProdutoAgricultor) => void }) {
  const [nome, setNome] = useState(initial?.nome || '');
  const [categoria, setCategoria] = useState(initial?.categoria || '');
  const [capacidade, setCapacidade] = useState(String(initial?.capacidadeMensal || ''));
  const [unidade, setUnidade] = useState(initial?.unidade || 'kg');
  const [preco, setPreco] = useState(String(initial?.precoSugerido || ''));
  const [organico, setOrganico] = useState(initial?.organico || false);
  const [meses, setMeses] = useState<string[]>(initial?.mesesDisponiveis || []);
  const mesesList = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60"><View className="max-h-[88%] overflow-hidden rounded-t-[22px] bg-agro-panel"><Header title={initial ? 'Editar Produto' : 'Novo Produto'} onBack={onClose} /><ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        <Field label="Nome do produto" value={nome} onChangeText={setNome} />
        <Field label="Categoria" value={categoria} onChangeText={setCategoria} />
        <Field label="Capacidade mensal" value={capacidade} onChangeText={setCapacidade} keyboardType="numeric" />
        <Field label="Unidade" value={unidade} onChangeText={setUnidade} />
        <Field label="Preco sugerido" value={preco} onChangeText={setPreco} keyboardType="numeric" />
        <SwitchRow label="Produto organico" value={organico} onChange={setOrganico} />
        <View className="flex-row flex-wrap gap-2">{mesesList.map((m) => <TouchableOpacity key={m} onPress={() => setMeses((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])}><Badge label={m} tone={meses.includes(m) ? 'green' : 'gray'} /></TouchableOpacity>)}</View>
        <Button onPress={() => { if (!nome.trim() || !categoria.trim()) return notify('Preencha o nome e a categoria.'); onSave({ id: initial?.id || `prod-${Date.now()}`, nome, categoria, capacidadeMensal: Number(capacidade), unidade, mesesDisponiveis: meses, organico, precoSugerido: Number(preco) }); }}>Salvar</Button>
      </ScrollView></View></View>
    </Modal>
  );
}
