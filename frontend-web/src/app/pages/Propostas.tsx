import { JSX } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { FileText, ChevronRight, Clock, CheckCircle, XCircle, Ban } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Proposta, PropostaStatus } from '../types';

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function formatCurrency(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

const statusMap: Record<PropostaStatus, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/15',
    icon: <Clock size={13} />,
  },
  aceita: {
    label: 'Aceita',
    color: 'text-[#149D7F]',
    bg: 'bg-[#149D7F]/15',
    icon: <CheckCircle size={13} />,
  },
  rejeitada: {
    label: 'Rejeitada',
    color: 'text-[#E74C3C]',
    bg: 'bg-[#E74C3C]/15',
    icon: <XCircle size={13} />,
  },
  chamada_cancelada: {
    label: 'Chamada cancelada',
    color: 'text-[#F97316]',
    bg: 'bg-[#F97316]/15',
    icon: <Ban size={13} />,
  },
};

function PropostaCard({ proposta, chamadaTitulo, instNome }: { proposta: Proposta; chamadaTitulo: string; instNome: string }) {
  const navigate = useNavigate();
  const sc = statusMap[proposta.status];

  return (
    <button
      onClick={() => navigate(`/propostas/${proposta.id}`)}
      className="w-full bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-3 text-left active:border-[#149D7F]/40"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-white flex-1 leading-tight" style={{ fontSize: '14px', fontWeight: 600 }}>
          {chamadaTitulo}
        </p>
        <span
          className={`${sc.bg} ${sc.color} px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0`}
          style={{ fontSize: '11px', fontWeight: 600 }}
        >
          {sc.icon}
          {sc.label}
        </span>
      </div>

      <p className="text-[#B0B3B8] mb-3" style={{ fontSize: '12px' }}>
        {instNome}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#B0B3B8]" style={{ fontSize: '11px' }}>
            Valor total
          </p>
          <p className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
            {formatCurrency(proposta.valorTotal)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#B0B3B8]" style={{ fontSize: '11px' }}>
            Enviada em
          </p>
          <p className="text-[#B0B3B8]" style={{ fontSize: '13px' }}>
            {formatDate(proposta.dataCriacao)}
          </p>
        </div>
      </div>

      <div className="text-[#149D7F] flex items-center justify-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600 }}>
        Ver detalhes <ChevronRight size={14} />
      </div>
    </button>
  );
}

export function Propostas() {
  const navigate = useNavigate();
  const { role, currentUserId, getPropostasForAgricultor, getChamada, getInstituicao } =
    useAppContext();

  // Redirect institutions to chamadas
  if (role === 'instituicao') {
    return <Navigate to="/chamadas" replace />;
  }

  const propostas = getPropostasForAgricultor(currentUserId);

  return (
    <div className="flex flex-col bg-[#121212] h-full">
      {/* Header */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-4 flex-shrink-0">
        <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
          Minhas Propostas
        </h1>
        <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '13px' }}>
          {propostas.length} {propostas.length === 1 ? 'proposta enviada' : 'propostas enviadas'}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-4 pb-4">
        {propostas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1D2226] flex items-center justify-center mb-4">
              <FileText size={28} className="text-[#B0B3B8]" />
            </div>
            <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Nenhuma proposta enviada
            </p>
            <p className="text-[#B0B3B8] mt-1" style={{ fontSize: '13px' }}>
              Explore chamadas abertas e envie sua proposta
            </p>
            <button
              onClick={() => navigate('/chamadas')}
              className="mt-5 bg-[#149D7F] text-white rounded-full px-6 py-2.5 active:opacity-80"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Ver chamadas abertas
            </button>
          </div>
        ) : (
          propostas.map((p) => {
            const chamada = getChamada(p.chamadaId);
            const inst = chamada ? getInstituicao(chamada.instituicaoId) : null;
            return (
              <PropostaCard
                key={p.id}
                proposta={p}
                chamadaTitulo={chamada?.titulo || 'Chamada desconhecida'}
                instNome={inst?.nome || 'Instituição'}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
