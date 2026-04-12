import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Truck, TruckIcon, User, CheckCircle, XCircle, Ban } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Proposta, PropostaStatus } from '../types';

function formatCurrency(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

const statusColors: Record<PropostaStatus, string> = {
  pendente: 'text-yellow-400',
  aceita: 'text-[#149D7F]',
  rejeitada: 'text-[#E74C3C]',
  chamada_cancelada: 'text-[#F97316]',
};

const statusLabels: Record<PropostaStatus, string> = {
  pendente: 'Pendente',
  aceita: 'Aceita',
  rejeitada: 'Rejeitada',
  chamada_cancelada: 'Chamada cancelada',
};

function PropostaItem({
  proposta,
  agricultorNome,
  onView,
  onOpenAgricultor,
}: {
  proposta: Proposta;
  agricultorNome: string;
  onView: () => void;
  onOpenAgricultor: () => void;
}) {
  const resumoItens = proposta.itens
    .map((i) => `${i.produto} (${i.quantidade}${i.unidade})`)
    .join(', ');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onView();
        }
      }}
      className="w-full bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-3 text-left active:border-[#149D7F]/40"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#2F3336] flex items-center justify-center">
            <User size={16} className="text-[#B0B3B8]" />
          </div>
          <div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenAgricultor();
              }}
              className="text-white text-left active:text-[#149D7F]"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {agricultorNome}
            </button>
            <span className={`${statusColors[proposta.status]}`} style={{ fontSize: '11px', fontWeight: 600 }}>
              {statusLabels[proposta.status]}
            </span>
          </div>
        </div>
        <p className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
          {formatCurrency(proposta.valorTotal)}
        </p>
      </div>

      {/* Delivery badge */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            proposta.realizaEntrega
              ? 'bg-[#149D7F]/15 text-[#149D7F]'
              : 'bg-[#2F3336] text-[#B0B3B8]'
          }`}
          style={{ fontSize: '12px', fontWeight: 500 }}
        >
          <Truck size={12} />
          {proposta.realizaEntrega ? 'Entrega própria' : 'Sem entrega'}
        </div>
      </div>

      {/* Items summary */}
      <p className="text-[#B0B3B8] mb-4 line-clamp-2" style={{ fontSize: '12px' }}>
        {resumoItens}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
          Toque no card para visualizar a proposta completa
        </span>
        {proposta.status === 'pendente' ? (
          <CheckCircle size={14} className="text-[#149D7F]" />
        ) : proposta.status === 'rejeitada' ? (
          <XCircle size={14} className="text-[#E74C3C]" />
        ) : proposta.status === 'chamada_cancelada' ? (
          <Ban size={14} className="text-[#F97316]" />
        ) : (
          <CheckCircle size={14} className="text-[#149D7F]" />
        )}
      </div>
    </div>
  );
}

export function PropostasInstituicao() {
  const { chamadaId } = useParams<{ chamadaId: string }>();
  const navigate = useNavigate();
  const { getChamada, getPropostasForChamada, getAgricultor } = useAppContext();

  const chamada = getChamada(chamadaId!);
  const propostas = getPropostasForChamada(chamadaId!);

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-0">
      {/* Header */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Propostas Recebidas
            </h2>
            {chamada && (
              <p className="text-[#B0B3B8] truncate" style={{ fontSize: '12px' }}>
                {chamada.titulo}
              </p>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-[#149D7F]/15 flex items-center justify-center">
            <span className="text-[#149D7F]" style={{ fontSize: '12px', fontWeight: 700 }}>
              {propostas.length}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-4 pb-4">
        {propostas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1D2226] flex items-center justify-center mb-4">
              <TruckIcon size={28} className="text-[#B0B3B8]" />
            </div>
            <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Nenhuma proposta recebida
            </p>
            <p className="text-[#B0B3B8] mt-1" style={{ fontSize: '13px' }}>
              Aguarde agricultores enviarem suas propostas
            </p>
          </div>
        ) : (
          propostas.map((p) => {
            const agr = getAgricultor(p.agricultorId);
            return (
              <PropostaItem
                key={p.id}
                proposta={p}
                agricultorNome={agr?.nome || 'Agricultor'}
                onView={() => navigate(`/propostas/${p.id}`)}
                onOpenAgricultor={() => navigate(`/perfil/agricultor/${p.agricultorId}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
