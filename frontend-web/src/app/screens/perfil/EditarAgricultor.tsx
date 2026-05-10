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
import { ProdutoModal } from '../../components/commons/ProdutoModal';

export function EditarAgricultor({ nav }: { nav: Nav }) {
  const { currentUserId, getAgricultor, updateAgricultor } = useAppContext();
  const agr = getAgricultor(currentUserId)!;
  const [nome, setNome] = useState(agr.nome);
  const [cpf, setCpf] = useState(agr.cpf);
  const [caf, setCaf] = useState(agr.caf);
  const [telefone, setTelefone] = useState(agr.telefone);
  const [email, setEmail] = useState(agr.email);
  const [realizaEntrega, setRealizaEntrega] = useState(agr.realizaEntrega);
  const [produtos, setProdutos] = useState<ProdutoAgricultor[]>(agr.produtos);
  const [modal, setModal] = useState<ProdutoAgricultor | null | undefined>(undefined);
  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Editar Perfil" onBack={nav.back} />
      <ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        <Field label="Nome completo" value={nome} onChangeText={setNome} />
        <Field label="CPF/CNPJ" value={cpf} onChangeText={setCpf} />
        <Field label="CAF" value={caf} onChangeText={setCaf} />
        <Field label="Telefone" value={telefone} onChangeText={setTelefone} />
        <Field label="E-mail" value={email} onChangeText={setEmail} />
        <SwitchRow label="Realizo entrega propria" value={realizaEntrega} onChange={setRealizaEntrega} />
        <SectionTitle title="Meus Produtos" action="Adicionar" onAction={() => setModal(null)} />
        {produtos.map((p) => <View key={p.id} className="flex-row items-center gap-2.5 rounded-[14px] border border-agro-border bg-agro-panel p-3.5"><View className="flex-1"><Text className="text-sm font-bold text-white">{p.nome}</Text><Text className="text-xs text-agro-muted">{p.categoria} · {p.capacidadeMensal} {p.unidade}/mes</Text></View><Button variant="ghost" onPress={() => setModal(p)}>Editar</Button><Button variant="danger" onPress={() => setProdutos((prev) => prev.filter((x) => x.id !== p.id))}>Excluir</Button></View>)}
      </ScrollView>
      <View className="gap-2.5 border-t border-agro-border bg-agro-bg p-3.5"><Button onPress={() => { if (!nome.trim()) return notify('Informe o nome.'); updateAgricultor({ ...agr, nome, cpf, caf, telefone, email, realizaEntrega, produtos }); notify('Perfil atualizado com sucesso.'); nav.go({ name: 'perfil' }, true); }}>Salvar Alteracoes</Button></View>
      <ProdutoModal initial={modal || undefined} visible={modal !== undefined} onClose={() => setModal(undefined)} onSave={(p) => { setProdutos((prev) => modal ? prev.map((x) => x.id === p.id ? p : x) : [...prev, p]); setModal(undefined); }} />
    </View>
  );
}
