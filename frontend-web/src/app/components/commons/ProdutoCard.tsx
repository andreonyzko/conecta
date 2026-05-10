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

export function ProdutoCard({ produto }: { produto: ProdutoAgricultor }) {
  return (
    <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4">
      <View className="flex-row items-start justify-between gap-2.5"><Text className="text-sm font-bold text-white">{produto.nome}</Text>{produto.organico && <Badge label="Organico" />}</View>
      <Text className="text-xs text-agro-muted">{produto.categoria}</Text>
      <Text className="text-sm leading-5 text-white">{produto.capacidadeMensal} {produto.unidade}/mes · {formatCurrency(produto.precoSugerido)}/{produto.unidade}</Text>
      <Text className="text-[11px] font-bold uppercase text-agro-muted">{produto.mesesDisponiveis.join(', ')}</Text>
    </View>
  );
}

