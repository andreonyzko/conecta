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
import { AgricultorProfile } from '../../components/commons/AgricultorProfile';

export function PerfilAgricultorView({ id, nav }: { id: string; nav: Nav }) {
  const { getAgricultor, role, currentUserId } = useAppContext();
  return <View className="flex-1 bg-agro-bg"><Header title="Perfil do Agricultor" onBack={nav.back} /><KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7"><AgricultorProfile agricultor={getAgricultor(id)} isOwner={role === 'agricultor' && id === currentUserId} nav={nav} /></KeyboardAwareScrollView></View>;
}
