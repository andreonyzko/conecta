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
import { Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../../components/ui/ui';
import { NotFound } from '../../components/ui/NotFound';
import { ProdutoCard } from './ProdutoCard';

export function AgricultorProfile({ agricultor, isOwner, nav }: { agricultor?: Agricultor; isOwner: boolean; nav: Nav }) {
  const { getInstituicao, getChamada } = useAppContext();
  if (!agricultor) return <Empty title="Agricultor nao encontrado" />;
  const initials = agricultor.nome.split(' ').slice(0, 2).map((n) => n[0]).join('');
  const media = agricultor.avaliacoes.length ? agricultor.avaliacoes.reduce((t, a) => t + a.nota, 0) / agricultor.avaliacoes.length : 0;
  return (
    <>
      <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4">
        <View className="flex-row items-center justify-between"><View className="h-[66px] w-[66px] items-center justify-center rounded-full bg-agro-green/15"><Text className="text-[21px] font-extrabold text-agro-green">{initials}</Text></View>{isOwner && <Button variant="outline" size="compact" grow={false} onPress={() => nav.go({ name: 'editarPerfil' })}>Editar</Button>}</View>
        <Text className="mb-1 text-xl font-extrabold text-white">{agricultor.nome}</Text>
        <Text className="text-xs text-agro-muted">CAF: {agricultor.caf}</Text>
        <View className="flex-row flex-wrap gap-2"><Badge label={agricultor.realizaEntrega ? 'Entrega propria' : 'Sem entrega'} /><Badge label={agricultor.avaliacoes.length ? media.toFixed(1).replace('.', ',') : 'Sem notas'} tone="yellow" /></View>
      </View>
      <InfoCard title="Contato" lines={[agricultor.email, agricultor.telefone]} />
      <SectionTitle title={`Chamadas publicas ganhas (${agricultor.licitacoesGanhas.length})`} />
      {agricultor.licitacoesGanhas.map((l) => <View key={l.id} className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4"><Text className="text-sm font-bold text-white">{getChamada(l.chamadaId)?.titulo || 'Chamada finalizada'}</Text><Text className="text-xs text-agro-muted">{getInstituicao(l.instituicaoId)?.nome || 'Instituicao'}</Text><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(l.valor)}</Text></View>)}
      <SectionTitle title={`Avaliacoes (${agricultor.avaliacoes.length})`} />
      {agricultor.avaliacoes.map((a) => <View key={a.id} className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4"><View className="flex-row items-center gap-1.5"><Text className="text-sm font-bold text-white">{getInstituicao(a.instituicaoId)?.nome || 'Instituicao'}</Text><Star size={14} color={C.yellow} fill={C.yellow} /><Text className="text-sm font-bold text-white">{a.nota}</Text></View><Text className="text-xs text-agro-muted">{formatDate(a.data)}</Text><Text className="text-sm leading-5 text-white">{a.comentario}</Text></View>)}
      <SectionTitle title={`Produtos (${agricultor.produtos.length})`} />
      {agricultor.produtos.map((p) => <ProdutoCard key={p.id} produto={p} />)}
    </>
  );
}

