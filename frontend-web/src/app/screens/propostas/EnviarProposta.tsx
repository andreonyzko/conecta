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
import { ItemPropostaModal } from '../../components/commons/ItemPropostaModal';

export function EnviarProposta({ chamadaId, nav }: { chamadaId: string; nav: Nav }) {
  const ctx = useAppContext();
  const chamada = ctx.getChamada(chamadaId);
  const [itens, setItens] = useState<ItemProposta[]>([]);
  const [realizaEntrega, setRealizaEntrega] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [modal, setModal] = useState<ItemProposta | null | undefined>(undefined);
  if (!chamada) return <NotFound text="Chamada nao encontrada" nav={nav} />;
  const jaEnviou = ctx.propostas.some((p) => p.chamadaId === chamadaId && p.agricultorId === ctx.currentUserId);
  const disponiveis = ctx.getItensDisponiveisForChamada(chamadaId);
  const disponiveisParaModal = disponiveis.filter((item) => !itens.some((propostaItem) => propostaItem.produto === item.produto && propostaItem.id !== modal?.id));
  const valorTotal = itens.reduce((sum, item) => sum + item.total, 0);
  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Enviar Proposta" subtitle={chamada.titulo} onBack={nav.back} />
      {jaEnviou && <Text className="mx-4 mt-4 rounded-xl border border-agro-yellow/30 bg-agro-yellow/10 p-3 text-agro-yellow">Voce ja enviou uma proposta para esta chamada.</Text>}
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7">
        <SectionTitle title="Itens da Proposta" action="Adicionar" onAction={() => setModal(null)} />
        {itens.length === 0 && <Empty title="Nenhum item" subtitle="Adicione os itens que voce pode fornecer" />}
        {itens.map((item) => <View key={item.id} className="flex-row items-center gap-2.5 rounded-[14px] border border-agro-border bg-agro-panel p-3.5"><View className="flex-1"><Text className="text-sm font-bold text-white">{item.produto}</Text><Text className="text-xs text-agro-muted">{item.quantidade} {item.unidade} x {formatCurrency(item.precoPorUnidade)}</Text></View><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(item.total)}</Text><Button variant="danger" size="compact" grow={false} onPress={() => setItens((prev) => prev.filter((x) => x.id !== item.id))}>Excluir</Button></View>)}
        {!!itens.length && <View className="flex-row justify-between rounded-[14px] border border-agro-green/30 bg-agro-green/10 p-3.5"><Text className="text-[15px] font-extrabold text-agro-green">Valor Total</Text><Text className="text-[15px] font-extrabold text-agro-green">{formatCurrency(valorTotal)}</Text></View>}
        <SwitchRow label="Realizo entrega propria" value={realizaEntrega} onChange={setRealizaEntrega} />
        <Field label="Mensagem (opcional)" value={mensagem} onChangeText={setMensagem} multiline />
      </KeyboardAwareScrollView>
      <View className="gap-2.5 border-t border-agro-border bg-agro-bg px-3.5 pb-8 pt-3.5"><Button grow={false} disabled={jaEnviou} onPress={() => { if (jaEnviou) return notify('Voce ja enviou uma proposta para esta chamada.'); if (chamada.status !== 'ativa') return notify('Esta chamada nao esta mais recebendo propostas.'); if (!disponiveis.length) return notify('Todos os itens desta chamada ja foram atendidos.'); if (!itens.length) return notify('Adicione ao menos um item a proposta.'); ctx.addProposta({ chamadaId, agricultorId: ctx.currentUserId, itens, realizaEntrega, mensagem, valorTotal, status: 'pendente' }); notify('Proposta enviada com sucesso.'); nav.go({ name: 'propostas' }, true); }}>Enviar Proposta</Button></View>
      <ItemPropostaModal visible={modal !== undefined} initial={modal || undefined} chamadaItens={disponiveisParaModal} onClose={() => setModal(undefined)} onSave={(item) => { if (!disponiveis.some((d) => d.produto === item.produto)) return notify('Esse item ja foi atendido por outra proposta aceita.'); if (itens.some((x) => x.produto === item.produto && x.id !== item.id)) return notify('Esse item ja foi adicionado a proposta.'); setItens((prev) => modal ? prev.map((x) => x.id === item.id ? item : x) : [...prev, item]); setModal(undefined); }} />
    </View>
  );
}
