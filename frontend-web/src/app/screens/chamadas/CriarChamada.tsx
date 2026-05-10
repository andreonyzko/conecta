import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { Agricultor, Chamada, Instituicao, ItemChamada, ItemProposta, ProdutoAgricultor, Proposta, PropostaStatus, UserRole } from '../../types';
import { BRAND_NAME, BRAND_TAGLINE } from '../../config/branding';
import { Nav, Route } from '../../navigation/types';
import { C } from '../../shared/theme';
import { logo } from '../../shared/assets';
import { formatCurrency, formatDate } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { statusChamada, statusProposta } from '../../shared/status';
import { Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../../components/ui/ui';
import { NotFound } from '../../components/ui/NotFound';
import { ItemChamadaModal } from '../../components/commons/ItemChamadaModal';

export function CriarChamada({ nav }: { nav: Nav }) {
  const { currentUserId, addChamada } = useAppContext();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [itens, setItens] = useState<ItemChamada[]>([]);
  const [modal, setModal] = useState<ItemChamada | null | undefined>(undefined);
  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Nova Chamada Publica" onBack={nav.back} />
      <ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        <Field label="Titulo *" value={titulo} onChangeText={setTitulo} placeholder="Chamada Publica no 01/2026" />
        <Field label="Descricao" value={descricao} onChangeText={setDescricao} multiline />
        <Field label="Data de inicio *" value={dataInicio} onChangeText={setDataInicio} placeholder="2026-05-01" />
        <Field label="Data de encerramento *" value={dataFim} onChangeText={setDataFim} placeholder="2026-05-20" />
        <SectionTitle title="Itens da Chamada" action="Adicionar" onAction={() => setModal(null)} />
        {itens.length === 0 && <Empty title="Nenhum item" subtitle="Adicione os itens que voce precisa adquirir" />}
        {itens.map((item) => <View key={item.id} className="flex-row items-center gap-2.5 rounded-[14px] border border-agro-border bg-agro-panel p-3.5"><View className="flex-1"><Text className="text-sm font-bold text-white">{item.produto}</Text><Text className="text-xs text-agro-muted">{item.quantidade} {item.unidade} · {item.frequencia} · Ref. {formatCurrency(item.precoReferencia)}</Text></View><Button variant="ghost" onPress={() => setModal(item)}>Editar</Button><Button variant="danger" onPress={() => setItens((prev) => prev.filter((x) => x.id !== item.id))}>Excluir</Button></View>)}
      </ScrollView>
      <View className="gap-2.5 border-t border-agro-border bg-agro-bg p-3.5"><Button onPress={() => { if (!titulo.trim()) return notify('Informe o titulo da chamada.'); if (!dataInicio || !dataFim) return notify('Informe as datas da chamada.'); if (!itens.length) return notify('Adicione ao menos um item.'); addChamada({ titulo, descricao, dataInicio, dataFim, itens, instituicaoId: currentUserId, status: 'ativa' }); notify('Chamada publicada com sucesso.'); nav.go({ name: 'chamadas' }, true); }}>Publicar Chamada</Button></View>
      <ItemChamadaModal visible={modal !== undefined} initial={modal || undefined} onClose={() => setModal(undefined)} onSave={(item) => { setItens((prev) => modal ? prev.map((x) => x.id === item.id ? item : x) : [...prev, item]); setModal(undefined); }} />
    </View>
  );
}
