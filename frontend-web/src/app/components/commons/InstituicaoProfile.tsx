import React, { useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
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

export function InstituicaoProfile({ instituicao, chamadas, isOwner, nav }: { instituicao?: Instituicao; chamadas: Chamada[]; isOwner: boolean; nav: Nav }) {
  if (!instituicao) return <Empty title="Instituicao nao encontrada" />;
  const initials = instituicao.nome.split(' ').slice(0, 2).map((n) => n[0]).join('');
  return (
    <>
      <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4">
        <View className="flex-row items-center justify-between"><View className="h-[66px] w-[66px] items-center justify-center rounded-full bg-agro-green/15"><Text className="text-[21px] font-extrabold text-agro-green">{initials}</Text></View>{isOwner && <Button variant="outline" size="compact" grow={false} onPress={() => nav.go({ name: 'editarPerfil' })}>Editar</Button>}</View>
        <Text className="mb-1 text-xl font-extrabold text-white">{instituicao.nome}</Text>
        <Text className="text-xs text-agro-muted">CNPJ: {instituicao.cnpj}</Text>
        <Badge label={`${instituicao.numeroAlunos.toLocaleString('pt-BR')} alunos`} />
      </View>
      <InfoCard title="Contato" lines={[instituicao.email, instituicao.telefone]} />
      <SectionTitle title={`Chamadas Publicadas (${chamadas.length})`} />
      {chamadas.map((c) => <TouchableOpacity key={c.id} className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4" onPress={() => nav.go({ name: 'chamadaDetalhe', id: c.id })}><Text className="text-sm font-bold text-white">{c.titulo}</Text><Badge label={statusChamada(c.status).label} tone={statusChamada(c.status).tone} /></TouchableOpacity>)}
    </>
  );
}

