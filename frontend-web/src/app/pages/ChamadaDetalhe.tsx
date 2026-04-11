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

export function ChamadaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChamada, getInstituicao, getPropostasForChamada, cancelarChamada, role, currentUserId } =
    useAppContext();
  const [confirmCancel, setConfirmCancel] = useState(false);

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
  const sc = statusConfig(chamada.status);
  const isOwner = role === 'instituicao' && chamada.instituicaoId === currentUserId;
  const canPropose =
    role === 'agricultor' && chamada.status === 'ativa';

  const handleCancel = () => {
    cancelarChamada(chamada.id);
    toast.success('Chamada cancelada com sucesso');
    navigate(-1);
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
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                    {item.produto}
                  </p>
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
    </div>
  );
}