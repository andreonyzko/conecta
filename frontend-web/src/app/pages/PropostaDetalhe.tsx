import { JSX, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Truck,
  MessageSquare,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { PropostaStatus } from '../types';

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function formatCurrency(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

const statusConfig: Record<PropostaStatus, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/15',
    icon: <Clock size={14} />,
  },
  aceita: {
    label: 'Aceita',
    color: 'text-[#149D7F]',
    bg: 'bg-[#149D7F]/15',
    icon: <CheckCircle size={14} />,
  },
  rejeitada: {
    label: 'Rejeitada',
    color: 'text-[#E74C3C]',
    bg: 'bg-[#E74C3C]/15',
    icon: <XCircle size={14} />,
  },
};

export function PropostaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    propostas,
    getChamada,
    getAgricultor,
    getInstituicao,
    role,
    currentUserId,
    cancelarProposta,
    updatePropostaStatus,
  } = useAppContext();

  const [confirmCancel, setConfirmCancel] = useState(false);

  const proposta = propostas.find((p) => p.id === id);
  if (!proposta) {
    return (
      <div className="flex-1 flex flex-col bg-[#121212] items-center justify-center">
        <p className="text-[#B0B3B8]">Proposta não encontrada</p>
        <button onClick={() => navigate(-1)} className="text-[#149D7F] mt-3" style={{ fontSize: '14px' }}>
          Voltar
        </button>
      </div>
    );
  }

  const chamada = getChamada(proposta.chamadaId);
  const agricultor = getAgricultor(proposta.agricultorId);
  const inst = chamada ? getInstituicao(chamada.instituicaoId) : null;
  const sc = statusConfig[proposta.status];

  const isOwnerAgricultor = role === 'agricultor' && proposta.agricultorId === currentUserId;
  const isOwnerInstituicao =
    role === 'instituicao' &&
    chamada &&
    chamada.instituicaoId === currentUserId;

  const handleCancelProposta = () => {
    cancelarProposta(proposta.id);
    toast.success('Proposta cancelada.');
    navigate('/propostas');
  };

  const handleAccept = () => {
    updatePropostaStatus(proposta.id, 'aceita');
    toast.success('Proposta aceita com sucesso!');
    navigate(-1);
  };

  const handleReject = () => {
    updatePropostaStatus(proposta.id, 'rejeitada');
    toast.error('Proposta rejeitada.');
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
          Detalhe da Proposta
        </h2>
        <span
          className={`${sc.bg} ${sc.color} px-2.5 py-1 rounded-full flex items-center gap-1`}
          style={{ fontSize: '11px', fontWeight: 600 }}
        >
          {sc.icon}
          {sc.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-5 pb-4">
        {/* Chamada reference */}
        {chamada && (
          <div className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-4">
            <p className="text-[#B0B3B8]" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Chamada
            </p>
            <p className="text-white mt-1" style={{ fontSize: '14px', fontWeight: 600 }}>
              {chamada.titulo}
            </p>
            <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '12px' }}>
              {inst?.nome}
            </p>
          </div>
        )}

        {/* Agricultor info */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#2F3336] flex items-center justify-center">
            <User size={22} className="text-[#B0B3B8]" />
          </div>
          <div>
            <p className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
              {agricultor?.nome}
            </p>
            <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
              Enviada em {formatDate(proposta.dataCriacao)}
            </p>
          </div>
        </div>

        {/* Delivery */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 ${
            proposta.realizaEntrega
              ? 'bg-[#149D7F]/15 text-[#149D7F]'
              : 'bg-[#2F3336] text-[#B0B3B8]'
          }`}
          style={{ fontSize: '13px', fontWeight: 500 }}
        >
          <Truck size={14} />
          {proposta.realizaEntrega ? 'Realiza entrega própria' : 'Não realiza entrega própria'}
        </div>

        {/* Items */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#149D7F]" />
            <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
              Itens da Proposta
            </span>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {proposta.itens.map((item) => (
              <div
                key={item.id}
                className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                    {item.produto}
                  </p>
                  <p className="text-[#149D7F]" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {formatCurrency(item.total)}
                  </p>
                </div>
                <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
                  {item.quantidade} {item.unidade} × {formatCurrency(item.precoPorUnidade)}/{item.unidade}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-[#149D7F]/10 border border-[#149D7F]/30 rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-[#149D7F]" style={{ fontSize: '14px', fontWeight: 600 }}>
              Valor Total
            </span>
            <span className="text-[#149D7F]" style={{ fontSize: '18px', fontWeight: 700 }}>
              {formatCurrency(proposta.valorTotal)}
            </span>
          </div>
        </div>

        {/* Message */}
        {proposta.mensagem && (
          <div className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-[#B0B3B8]" />
              <span className="text-[#B0B3B8]" style={{ fontSize: '12px', fontWeight: 600 }}>
                Mensagem do agricultor
              </span>
            </div>
            <p className="text-white leading-relaxed" style={{ fontSize: '14px' }}>
              {proposta.mensagem}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t border-[#2F3336] bg-[#121212] flex flex-col gap-3">
        {isOwnerAgricultor && proposta.status === 'pendente' && (
          <>
            {confirmCancel ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCancelProposta}
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
                  Manter proposta
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                className="w-full border border-[#E74C3C] text-[#E74C3C] rounded-full py-3 flex items-center justify-center gap-2 active:bg-[#E74C3C]/10"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                <AlertTriangle size={15} /> Cancelar Proposta
              </button>
            )}
          </>
        )}

        {isOwnerInstituicao && proposta.status === 'pendente' && (
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-[#149D7F] text-white rounded-full py-3 flex items-center justify-center gap-1.5 active:opacity-80"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <CheckCircle size={15} /> Aceitar
            </button>
            <button
              onClick={handleReject}
              className="flex-1 border border-[#E74C3C] text-[#E74C3C] rounded-full py-3 flex items-center justify-center gap-1.5 active:bg-[#E74C3C]/10"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <XCircle size={15} /> Rejeitar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}