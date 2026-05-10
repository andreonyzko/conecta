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
import { PropostaCard } from '../../components/commons/PropostaCard';

export function Propostas({ nav }: { nav: Nav }) {
  const { role, currentUserId, getPropostasForAgricultor, getChamada, getInstituicao } = useAppContext();
  if (role === 'instituicao') setTimeout(() => nav.go({ name: 'chamadas' }, true), 0);
  const propostas = getPropostasForAgricultor(currentUserId);
  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Minhas Propostas" subtitle={`${propostas.length} propostas enviadas`} />
      <ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        {propostas.length === 0 ? <Empty title="Nenhuma proposta enviada" subtitle="Explore chamadas abertas e envie sua proposta" action="Ver chamadas abertas" onAction={() => nav.go({ name: 'chamadas' }, true)} /> : propostas.map((p) => {
          const chamada = getChamada(p.chamadaId);
          return <PropostaCard key={p.id} proposta={p} title={chamada?.titulo || 'Chamada desconhecida'} subtitle={chamada ? getInstituicao(chamada.instituicaoId)?.nome : 'Instituicao'} onPress={() => nav.go({ name: 'propostaDetalhe', id: p.id })} />;
        })}
      </ScrollView>
    </View>
  );
}
