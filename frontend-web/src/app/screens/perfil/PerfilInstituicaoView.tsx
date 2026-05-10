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
import { InstituicaoProfile } from '../../components/commons/InstituicaoProfile';

export function PerfilInstituicaoView({ id, nav }: { id: string; nav: Nav }) {
  const { getInstituicao, getChamadasByInstituicao, role, currentUserId } = useAppContext();
  return <View className="flex-1 bg-agro-bg"><Header title="Perfil da Instituicao" onBack={nav.back} /><ScrollView contentContainerClassName="gap-3 p-4 pb-7"><InstituicaoProfile instituicao={getInstituicao(id)} chamadas={getChamadasByInstituicao(id)} isOwner={role === 'instituicao' && id === currentUserId} nav={nav} /></ScrollView></View>;
}
