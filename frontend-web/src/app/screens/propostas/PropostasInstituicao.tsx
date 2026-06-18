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
import { KeyboardAwareScrollView, Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../../components/ui/ui';
import { NotFound } from '../../components/ui/NotFound';
import { PropostaCard } from '../../components/commons/PropostaCard';

export function PropostasInstituicao({ chamadaId, nav }: { chamadaId: string; nav: Nav }) {
  const { getChamada, getPropostasForChamada, getAgricultor } = useAppContext();
  const chamada = getChamada(chamadaId);
  const propostas = getPropostasForChamada(chamadaId);
  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Propostas Recebidas" subtitle={chamada?.titulo} onBack={nav.back} badge={`${propostas.length}`} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7">
        {propostas.length === 0 ? <Empty title="Nenhuma proposta recebida" subtitle="Aguarde agricultores enviarem suas propostas" /> : propostas.map((p) => (
          <PropostaCard
            key={p.id}
            proposta={p}
            title={getAgricultor(p.agricultorId)?.nome || 'Agricultor'}
            subtitle={p.itens.map((i) => `${i.produto} (${i.quantidade}${i.unidade})`).join(', ')}
            onPress={() => nav.go({ name: 'propostaDetalhe', id: p.id })}
            onSubtitlePress={() => nav.go({ name: 'perfilAgricultor', id: p.agricultorId })}
          />
        ))}
      </KeyboardAwareScrollView>
    </View>
  );
}
