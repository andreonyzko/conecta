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
import { ChamadaCard } from '../../components/commons/ChamadaCard';

export function Chamadas({ nav }: { nav: Nav }) {
  const { chamadas, role, currentUserId, propostas, getInstituicao } = useAppContext();
  const [activeTab, setActiveTab] = useState<'todas' | 'minhas'>('todas');
  const [search, setSearch] = useState('');
  const minhas = role === 'agricultor'
    ? chamadas.filter((c) => propostas.some((p) => p.chamadaId === c.id && p.agricultorId === currentUserId))
    : chamadas.filter((c) => c.instituicaoId === currentUserId);
  const source = role === 'agricultor' || activeTab === 'todas' ? chamadas : minhas;
  const list = source.filter((c) => `${c.titulo} ${getInstituicao(c.instituicaoId)?.nome ?? ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <View className="flex-1 bg-agro-bg">
      <View className={`border-b border-agro-border bg-agro-panel px-4 pt-5 ${role === 'agricultor' ? 'pb-4' : 'pb-0'}`}>
        <Image source={logo} resizeMode="contain" className="h-12 w-40 self-center" />
        <View className={`${role === 'agricultor' ? 'mb-1' : 'mb-0'} mt-4`}>
          <Field label="" value={search} onChangeText={setSearch} placeholder="Buscar chamadas..." />
        </View>
        {role === 'instituicao' && (
          <View className="mt-2 flex-row">
            {(['todas', 'minhas'] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className={`flex-1 items-center py-3 ${activeTab === tab ? 'border-b-2 border-agro-green' : ''}`}>
                <Text className={`text-sm ${activeTab === tab ? 'font-bold text-agro-green' : 'text-agro-muted'}`}>{tab === 'todas' ? 'Todas' : 'Minhas'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7">
        {list.length === 0 ? <Empty title="Nenhuma chamada encontrada" subtitle="Tente ajustar sua busca" /> : list.map((chamada) => (
          <ChamadaCard key={chamada.id} chamada={chamada} instituicao={getInstituicao(chamada.instituicaoId)} onPress={() => nav.go({ name: 'chamadaDetalhe', id: chamada.id })} />
        ))}
      </KeyboardAwareScrollView>
    </View>
  );
}
