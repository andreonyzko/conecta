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
import { Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../ui/ui';
import { NotFound } from '../ui/NotFound';

export function ChamadaCard({ chamada, instituicao, onPress }: { chamada: Chamada; instituicao?: Instituicao; onPress: () => void }) {
  const sc = statusChamada(chamada.status);
  return (
    <TouchableOpacity className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4" onPress={onPress} activeOpacity={0.8}>
      <View className="flex-row items-start justify-between gap-2.5">
        <View className="flex-1">
          <Text className="text-sm font-bold text-white">{chamada.titulo}</Text>
          <Text className="text-xs text-agro-muted" numberOfLines={1}>{instituicao?.nome || 'Instituicao'}</Text>
        </View>
        <Badge label={sc.label} tone={sc.tone} />
      </View>
      <Text className="text-xs text-agro-muted">{formatDate(chamada.dataInicio)} - {formatDate(chamada.dataFim)}</Text>
      <Text className="text-sm leading-5 text-white" numberOfLines={2}>{chamada.itens.map((i) => i.produto).join(', ')}</Text>
      <Text className="text-[13px] font-bold text-agro-green">Ver detalhes ›</Text>
    </TouchableOpacity>
  );
}
