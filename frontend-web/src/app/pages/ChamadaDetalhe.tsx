import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  School,
  Calendar,
  Package,
  Users,
  ChevronRight,
  AlertTriangle,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function formatCurrency(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

function statusConfig(status: string) {
  if (status === 'ativa') return { label: 'Ativa', color: 'text-[#149D7F]', bg: 'bg-[#149D7F]/15' };
  if (status === 'encerrada') return { label: 'Encerrada', color: 'text-[#B0B3B8]', bg: 'bg-[#2F3336]' };
  return { label: 'Cancelada', color: 'text-[#E74C3C]', bg: 'bg-[#E74C3C]/15' };
}

function FinalizarChamadaModal({
  agricultores,
  onClose,
  onConfirm,
}: {
  agricultores: Array<{ id: string; nome: string }>;
  onClose: () => void;
  onConfirm: (avaliacoes: Array<{ agricultorId: string; nota: number; comentario: string }>) => void;
}) {
  const [avaliacoes, setAvaliacoes] = useState(
    agricultores.map((agricultor) => ({
      agricultorId: agricultor.id,
      nota: 5,
      comentario: '',
    }))
  );

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full max-h-[88%] bg-[#1D2226] rounded-t-3xl border-t border-[#2F3336] flex flex-col">
        <div className="px-4 py-4 border-b border-[#2F3336] flex items-center justify-between">
          <div>
            <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
              Encerrar chamada
            </h3>
            <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
              Avalie os agricultores vencedores antes de finalizar.
            </p>
          </div>
          <button onClick={onClose} className="text-[#B0B3B8] px-2 py-1">
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto agro-scroll px-4 py-4 flex flex-col gap-4">
          {agricultores.map((agricultor) => {
            const avaliacao = avaliacoes.find((item) => item.agricultorId === agricultor.id)!;
            return (
              <div key={agricultor.id} className="bg-[#121212] border border-[#2F3336] rounded-2xl p-4">
                <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>
                  {agricultor.nome}
                </p>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((nota) => (
                    <button
                      key={nota}
                      onClick={() =>
                        setAvaliacoes((prev) =>
                          prev.map((item) =>
                            item.agricultorId === agricultor.id ? { ...item, nota } : item
                          )
                        )
                      }
                      className={nota <= avaliacao.nota ? 'text-[#FBBF24]' : 'text-[#4B5563]'}
                    >
                      <Star size={22} fill="currentColor" />
                    </button>
                  ))}
                </div>
                <p className="text-[#B0B3B8] mb-2" style={{ fontSize: '11px' }}>
                  1 muito ruim e 5 muito bom
                </p>
                <textarea
                  value={avaliacao.comentario}
                  onChange={(event) =>
                    setAvaliacoes((prev) =>
                      prev.map((item) =>
                        item.agricultorId === agricultor.id
                          ? { ...item, comentario: event.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="Escreva um comentário sobre a experiência com este agricultor"
                  className="w-full min-h-[96px] bg-[#1D2226] border border-[#2F3336] text-white rounded-xl px-4 py-3 focus:border-[#149D7F] focus:outline-none placeholder:text-[#6F767E] resize-none"
                  style={{ fontSize: '14px' }}
                />
              </div>
            );
          })}
        </div>

        <div className="px-4 py-4 border-t border-[#2F3336]">
          <button
            onClick={() => onConfirm(avaliacoes)}
            className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80"
            style={{ fontSize: '15px', fontWeight: 600 }}
          >
            Finalizar chamada
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChamadaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getChamada,
    getInstituicao,
    getPropostasForChamada,
    cancelarChamada,
    encerrarChamada,
    getProdutosAceitosForChamada,
    getAgricultor,
    role,
    currentUserId,
  } = useAppContext();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);

  const chamada = getChamada(id!);
  if (!chamada) {
    return (
      <div className="flex-1 flex flex-col bg-[#121212] items-center justify-center">
        <p className="text-[#B0B3B8]">Chamada não encontrada</p>
        <button onClick={() => navigate(-1)} className="text-[#149D7F] mt-3" style={{ fontSize: '14px' }}>
          Voltar
        </button>
      </div>
    );
  }

  const instituicao = getInstituicao(chamada.instituicaoId);
  const propostas = getPropostasForChamada(chamada.id);
  const produtosAceitos = getProdutosAceitosForChamada(chamada.id);
  const sc = statusConfig(chamada.status);
  const isOwner = role === 'instituicao' && chamada.instituicaoId === currentUserId;
  const itensCobertos = chamada.itens.filter((item) =>
    produtosAceitos.includes(item.produto.trim().toLowerCase())
  ).length;
  const allItensAtendidos = chamada.itens.length > 0 && itensCobertos === chamada.itens.length;
  const canPropose = role === 'agricultor' && chamada.status === 'ativa' && !allItensAtendidos;
  const agricultoresVencedores = propostas
    .filter((proposta) => proposta.status === 'aceita')
    .map((proposta) => getAgricultor(proposta.agricultorId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index);

  const handleCancel = () => {
    cancelarChamada(chamada.id);
    toast.success('Chamada cancelada com sucesso');
    navigate(-1);
  };

  const handleEncerrar = (avaliacoes: Array<{ agricultorId: string; nota: number; comentario: string }>) => {
    if (avaliacoes.some((item) => !item.comentario.trim())) {
      toast.error('Preencha o comentário de todos os agricultores vencedores.');
      return;
    }

    encerrarChamada(chamada.id, avaliacoes);
    toast.success('Chamada encerrada com sucesso.');
    setShowFinalizarModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-0">
      {/* Header */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white flex-1" style={{ fontSize: '16px', fontWeight: 600 }}>
          Detalhes da Chamada
        </h2>
        <span className={`${sc.bg} ${sc.color} px-2.5 py-1 rounded-full`} style={{ fontSize: '11px', fontWeight: 600 }}>
          {sc.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-5 pb-4">
        {/* Title & Institution */}
        <h1 className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 700 }}>
          {chamada.titulo}
        </h1>

        <button
          onClick={() => navigate(`/perfil/instituicao/${chamada.instituicaoId}`)}
          className="flex items-center gap-2 mb-4 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#149D7F]/15 flex items-center justify-center">
            <School size={15} className="text-[#149D7F]" />
          </div>
          <span className="text-[#149D7F] group-active:underline" style={{ fontSize: '14px' }}>
            {instituicao?.nome}
          </span>
        </button>

        <div className="flex items-center gap-1.5 mb-5">
          <Calendar size={14} className="text-[#B0B3B8]" />
          <span className="text-[#B0B3B8]" style={{ fontSize: '13px' }}>
            {formatDate(chamada.dataInicio)} – {formatDate(chamada.dataFim)}
          </span>
        </div>

        {/* Description */}
        <div className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-4">
          <p className="text-[#B0B3B8] leading-relaxed" style={{ fontSize: '13px' }}>
            {chamada.descricao}
          </p>
        </div>

        {/* Items */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#149D7F]" />
            <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
              Itens da Chamada
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {chamada.itens.map((item) => (
              <div
                key={item.id}
                className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {item.produto}
                    </p>
                    {produtosAceitos.includes(item.produto.trim().toLowerCase()) && (
                      <span className="bg-[#149D7F]/15 text-[#149D7F] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ fontSize: '10px', fontWeight: 600 }}>
                        <CheckCircle2 size={10} />
                        Atendido
                      </span>
                    )}
                  </div>
                  <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '12px' }}>
                    {item.categoria} · {item.frequencia}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                    {item.quantidade} {item.unidade}
                  </p>
                  <p className="text-[#149D7F] mt-0.5" style={{ fontSize: '12px' }}>
                    Ref. {formatCurrency(item.precoReferencia)}/{item.unidade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal count */}
        <div className="flex items-center gap-2 bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-6">
          <Users size={16} className="text-[#B0B3B8]" />
          <span className="text-[#B0B3B8]" style={{ fontSize: '14px' }}>
            <span className="text-white" style={{ fontWeight: 600 }}>
              {propostas.length}
            </span>{' '}
            {propostas.length === 1 ? 'proposta recebida' : 'propostas recebidas'}
          </span>
        </div>
      </div>

      {/* Action area */}
      {chamada.status !== 'cancelada' && (
        <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t border-[#2F3336] bg-[#121212] flex flex-col gap-3">
          {canPropose && (
            <button
              onClick={() => navigate(`/enviar-proposta/${chamada.id}`)}
              className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80 transition-opacity"
              style={{ fontSize: '15px', fontWeight: 600 }}
            >
              Enviar Proposta
            </button>
          )}

          {role === 'agricultor' && chamada.status === 'ativa' && allItensAtendidos && (
            <p className="text-center text-[#B0B3B8]" style={{ fontSize: '13px' }}>
              Todos os itens desta chamada já foram atendidos por propostas aceitas.
            </p>
          )}

          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/chamadas/${chamada.id}/propostas`)}
                className="w-full bg-[#149D7F] text-white rounded-full py-3.5 flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
                style={{ fontSize: '15px', fontWeight: 600 }}
              >
                Ver Propostas ({propostas.length}) <ChevronRight size={16} />
              </button>

              {chamada.status === 'ativa' && (
                <>
                  {allItensAtendidos && agricultoresVencedores.length > 0 && (
                    <button
                      onClick={() => setShowFinalizarModal(true)}
                      className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80 transition-opacity"
                      style={{ fontSize: '15px', fontWeight: 600 }}
                    >
                      Encerrar proposta
                    </button>
                  )}

                  {confirmCancel ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-[#E74C3C] text-white rounded-full py-3 active:opacity-80"
                        style={{ fontSize: '14px', fontWeight: 600 }}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmCancel(false)}
                        className="flex-1 border border-[#2F3336] text-white rounded-full py-3 active:bg-[#2F3336]"
                        style={{ fontSize: '14px', fontWeight: 600 }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="w-full border border-[#E74C3C] text-[#E74C3C] rounded-full py-3 flex items-center justify-center gap-2 active:bg-[#E74C3C]/10 transition-colors"
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      <AlertTriangle size={15} /> Cancelar Chamada
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {role === 'agricultor' && chamada.status !== 'ativa' && (
            <p className="text-center text-[#B0B3B8]" style={{ fontSize: '13px' }}>
              Esta chamada não está mais aceitando propostas.
            </p>
          )}
        </div>
      )}

      {showFinalizarModal && (
        <FinalizarChamadaModal
          agricultores={agricultoresVencedores.map((agricultor) => ({
            id: agricultor.id,
            nome: agricultor.nome,
          }))}
          onClose={() => setShowFinalizarModal(false)}
          onConfirm={handleEncerrar}
        />
      )}
    </div>
  );
}
