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
import { FinalizarModal } from '../../components/commons/FinalizarModal';

export function ChamadaDetalhe({ id, nav }: { id: string; nav: Nav }) {
  const ctx = useAppContext();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showFinalizar, setShowFinalizar] = useState(false);
  const chamada = ctx.getChamada(id);
  if (!chamada) return <NotFound text="Chamada nao encontrada" nav={nav} />;

  const instituicao = ctx.getInstituicao(chamada.instituicaoId);
  const propostas = ctx.getPropostasForChamada(chamada.id);
  const produtosAceitos = ctx.getProdutosAceitosForChamada(chamada.id);
  const sc = statusChamada(chamada.status);
  const isOwner = ctx.role === 'instituicao' && chamada.instituicaoId === ctx.currentUserId;
  const allItensAtendidos = chamada.itens.length > 0 && chamada.itens.every((item) => produtosAceitos.includes(item.produto.trim().toLowerCase()));
  const canPropose = ctx.role === 'agricultor' && chamada.status === 'ativa' && !allItensAtendidos;
  const vencedores = propostas
    .filter((p) => p.status === 'aceita')
    .map((p) => ctx.getAgricultor(p.agricultorId))
    .filter((a): a is Agricultor => Boolean(a))
    .filter((a, index, list) => list.findIndex((x) => x.id === a.id) === index);

  const cancel = () => {
    ctx.cancelarChamada(chamada.id);
    notify('Chamada cancelada com sucesso.');
    nav.back();
  };

  return (
    <View className="flex-1 bg-agro-bg">
      <Header title="Detalhes da Chamada" onBack={nav.back} badge={sc.label} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4 pb-7">
        <Text className="mb-1 text-xl font-extrabold text-white">{chamada.titulo}</Text>
        <TouchableOpacity onPress={() => nav.go({ name: 'perfilInstituicao', id: chamada.instituicaoId })}>
          <Text className="text-[13px] font-bold text-agro-green">{instituicao?.nome}</Text>
        </TouchableOpacity>
        <Text className="text-xs text-agro-muted">{formatDate(chamada.dataInicio)} - {formatDate(chamada.dataFim)}</Text>
        <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4"><Text className="text-sm leading-5 text-white">{chamada.descricao}</Text></View>
        <SectionTitle title="Itens da Chamada" />
        {chamada.itens.map((item) => (
          <View key={item.id} className="flex-row items-center gap-2.5 rounded-[14px] border border-agro-border bg-agro-panel p-3.5">
            <View className="flex-1">
              <Text className="text-sm font-bold text-white">{item.produto}</Text>
              <Text className="text-xs text-agro-muted">{item.categoria} · {item.frequencia}</Text>
              {produtosAceitos.includes(item.produto.trim().toLowerCase()) && <Badge label="Atendido" />}
            </View>
            <Text className="text-right text-xs font-bold text-white">{item.quantidade} {item.unidade}{'\n'}{formatCurrency(item.precoReferencia)}/{item.unidade}</Text>
          </View>
        ))}
        <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4"><Text className="text-sm leading-5 text-white">{propostas.length} {propostas.length === 1 ? 'proposta recebida' : 'propostas recebidas'}</Text></View>
      </KeyboardAwareScrollView>
      <View className="gap-2.5 border-t border-agro-border bg-agro-bg px-3.5 pb-8 pt-3.5">
        {canPropose && <Button grow={false} onPress={() => nav.go({ name: 'enviarProposta', chamadaId: chamada.id })}>Enviar Proposta</Button>}
        {ctx.role === 'agricultor' && chamada.status === 'ativa' && allItensAtendidos && <Text className="text-center text-[13px] text-agro-muted">Todos os itens desta chamada ja foram atendidos.</Text>}
        {isOwner && (
          <>
            <Button grow={false} onPress={() => nav.go({ name: 'propostasInstituicao', chamadaId: chamada.id })}>Ver Propostas ({propostas.length})</Button>
            {chamada.status === 'ativa' && allItensAtendidos && vencedores.length > 0 && <Button grow={false} onPress={() => setShowFinalizar(true)}>Encerrar chamada</Button>}
            {chamada.status === 'ativa' && (confirmCancel ? (
              <View className="flex-row items-center gap-2.5">
                <Button variant="danger" onPress={cancel}>Confirmar</Button>
                <Button variant="outline" onPress={() => setConfirmCancel(false)}>Cancelar</Button>
              </View>
            ) : <Button grow={false} variant="danger" onPress={() => setConfirmCancel(true)}>Cancelar Chamada</Button>)}
          </>
        )}
      </View>
      <FinalizarModal visible={showFinalizar} agricultores={vencedores} onClose={() => setShowFinalizar(false)} onConfirm={(avaliacoes) => {
        if (avaliacoes.some((a) => !a.comentario.trim())) return notify('Preencha o comentario de todos os agricultores vencedores.');
        ctx.encerrarChamada(chamada.id, avaliacoes);
        setShowFinalizar(false);
        notify('Chamada encerrada com sucesso.');
      }} />
    </View>
  );
}
