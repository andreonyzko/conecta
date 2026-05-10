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

export function PropostaDetalhe({ id, nav }: { id: string; nav: Nav }) {
  const ctx = useAppContext();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const proposta = ctx.propostas.find((p) => p.id === id);
  if (!proposta) return <NotFound text="Proposta nao encontrada" nav={nav} />;
  const chamada = ctx.getChamada(proposta.chamadaId);
  const agricultor = ctx.getAgricultor(proposta.agricultorId);
  const inst = chamada ? ctx.getInstituicao(chamada.instituicaoId) : null;
  const sc = statusProposta(proposta.status);
  const isOwnerAgricultor = ctx.role === 'agricultor' && proposta.agricultorId === ctx.currentUserId;
  const isOwnerInstituicao = ctx.role === 'instituicao' && chamada?.instituicaoId === ctx.currentUserId;

  const accept = () => {
    const validation = ctx.canAcceptProposta(proposta.id);
    if (!validation.canAccept) return notify(`Os itens ${validation.blockedProducts.join(', ')} ja foram aceitos em outra proposta.`);
    ctx.updatePropostaStatus(proposta.id, 'aceita');
    notify('Proposta aceita com sucesso.');
    nav.back();
  };

  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Detalhe da Proposta" onBack={nav.back} badge={sc.label} />
      <ScrollView contentContainerClassName="gap-3 p-4 pb-7">
        {chamada && <TouchableOpacity className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4" onPress={() => nav.go({ name: 'chamadaDetalhe', id: chamada.id })}><Text className="text-[11px] font-bold uppercase text-agro-muted">Chamada</Text><Text className="text-sm font-bold text-white">{chamada.titulo}</Text><Text className="text-xs text-agro-muted">{inst?.nome}</Text></TouchableOpacity>}
        <TouchableOpacity className="my-1 flex-row items-center gap-3" onPress={() => nav.go({ name: 'perfilAgricultor', id: proposta.agricultorId })}>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-agro-border"><Icon name="○" /></View>
          <View className="flex-1"><Text className="text-sm font-bold text-white">{agricultor?.nome}</Text><Text className="text-xs text-agro-muted">Enviada em {formatDate(proposta.dataCriacao)}</Text></View>
          <Text className="text-[13px] font-bold text-agro-green">›</Text>
        </TouchableOpacity>
        <Badge label={proposta.realizaEntrega ? 'Realiza entrega propria' : 'Nao realiza entrega propria'} tone={proposta.realizaEntrega ? 'green' : 'gray'} />
        <SectionTitle title="Itens da Proposta" />
        {proposta.itens.map((item) => <View key={item.id} className="flex-row items-center gap-2.5 rounded-[14px] border border-agro-border bg-agro-panel p-3.5"><View><Text className="text-sm font-bold text-white">{item.produto}</Text><Text className="text-xs text-agro-muted">{item.quantidade} {item.unidade} x {formatCurrency(item.precoPorUnidade)}</Text></View><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(item.total)}</Text></View>)}
        <View className="flex-row justify-between rounded-[14px] border border-agro-green/30 bg-agro-green/10 p-3.5"><Text className="text-[15px] font-extrabold text-agro-green">Valor Total</Text><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(proposta.valorTotal)}</Text></View>
        {!!proposta.mensagem && <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4"><Text className="text-[11px] font-bold uppercase text-agro-muted">Mensagem do agricultor</Text><Text className="text-sm leading-5 text-white">{proposta.mensagem}</Text></View>}
      </ScrollView>
      <View className="gap-2.5 border-t border-agro-border bg-agro-bg p-3.5">
        {isOwnerAgricultor && proposta.status === 'pendente' && (confirmCancel ? (
          <View className="flex-row items-center gap-2.5">
            <Button variant="danger" onPress={() => { ctx.cancelarProposta(proposta.id); notify('Proposta cancelada.'); nav.go({ name: 'propostas' }, true); }}>Confirmar</Button>
            <Button variant="outline" onPress={() => setConfirmCancel(false)}>Manter</Button>
          </View>
        ) : <Button variant="danger" onPress={() => setConfirmCancel(true)}>Cancelar Proposta</Button>)}
        {isOwnerInstituicao && proposta.status === 'pendente' && <View className="flex-row items-center gap-2.5"><Button onPress={accept}>Aceitar</Button><Button variant="danger" onPress={() => { ctx.updatePropostaStatus(proposta.id, 'rejeitada'); notify('Proposta rejeitada.'); nav.back(); }}>Rejeitar</Button></View>}
      </View>
    </View>
  );
}
