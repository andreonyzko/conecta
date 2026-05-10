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
import { Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../ui/ui';
import { NotFound } from '../ui/NotFound';

export function PropostaCard({ proposta, title, subtitle, onPress, onSubtitlePress }: { proposta: Proposta; title: string; subtitle?: string; onPress: () => void; onSubtitlePress?: () => void }) {
  const sc = statusProposta(proposta.status);
  return (
    <TouchableOpacity className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4" onPress={onPress}>
      <View className="flex-row items-start justify-between gap-2.5">
        <Text className="flex-1 text-sm font-bold text-white">{title}</Text>
        <Badge label={sc.label} tone={sc.tone} />
      </View>
      <TouchableOpacity disabled={!onSubtitlePress} onPress={onSubtitlePress}><Text className="text-xs text-agro-muted" numberOfLines={2}>{subtitle}</Text></TouchableOpacity>
      <View className="flex-row items-start justify-between gap-2.5">
        <View>
          <Text className="text-[11px] font-bold uppercase text-agro-muted">Valor total</Text>
          <Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(proposta.valorTotal)}</Text>
        </View>
        <Text className="text-xs text-agro-muted">Enviada em{'\n'}{formatDate(proposta.dataCriacao)}</Text>
      </View>
      <Text className="text-[13px] font-bold text-agro-green">Ver detalhes ›</Text>
    </TouchableOpacity>
  );
}
