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

export function EditarInstituicao({ nav }: { nav: Nav }) {
  const { currentUserId, getInstituicao, updateInstituicao } = useAppContext();
  const inst = getInstituicao(currentUserId)!;
  const [nome, setNome] = useState(inst.nome);
  const [cnpj, setCnpj] = useState(inst.cnpj);
  const [telefone, setTelefone] = useState(inst.telefone);
  const [email, setEmail] = useState(inst.email);
  const [numeroAlunos, setNumeroAlunos] = useState(String(inst.numeroAlunos));
  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Editar Perfil" onBack={nav.back} />
      <ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        <Field label="Nome da instituicao" value={nome} onChangeText={setNome} />
        <Field label="CNPJ" value={cnpj} onChangeText={setCnpj} />
        <Field label="Telefone" value={telefone} onChangeText={setTelefone} />
        <Field label="E-mail" value={email} onChangeText={setEmail} />
        <Field label="Numero de alunos" value={numeroAlunos} onChangeText={setNumeroAlunos} keyboardType="numeric" />
      </ScrollView>
      <View className="gap-2.5 border-t border-agro-border bg-agro-bg p-3.5"><Button onPress={() => { if (!nome.trim()) return notify('Informe o nome.'); updateInstituicao({ ...inst, nome, cnpj, telefone, email, numeroAlunos: Number(numeroAlunos) }); notify('Perfil atualizado com sucesso.'); nav.go({ name: 'perfil' }, true); }}>Salvar Alteracoes</Button></View>
    </View>
  );
}
