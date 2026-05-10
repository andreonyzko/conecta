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
import { AgricultorProfile } from '../../components/commons/AgricultorProfile';
import { InstituicaoProfile } from '../../components/commons/InstituicaoProfile';



export function Perfil({ nav }: { nav: Nav }) {
  const ctx = useAppContext();
  const logout = () => {
    ctx.logout();
    nav.go({ name: 'auth' }, true);
  };
  const content = ctx.role === 'agricultor'
    ? <AgricultorProfile agricultor={ctx.getAgricultor(ctx.currentUserId)} isOwner nav={nav} />
    : <InstituicaoProfile instituicao={ctx.getInstituicao(ctx.currentUserId)} chamadas={ctx.getChamadasByInstituicao(ctx.currentUserId)} isOwner nav={nav} />;
  return (
    <View className="flex-1 bg-agro-bg">
      <ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        {content}
        <Button variant="outline" onPress={logout}>Logout</Button>
      </ScrollView>
    </View>
  );
}
