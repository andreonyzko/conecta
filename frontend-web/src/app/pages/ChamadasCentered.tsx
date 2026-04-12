import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Calendar, ChevronRight, School } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Chamada } from '../types';
import { BRAND_NAME, BRAND_ICON_SRC } from '../config/branding';

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function statusConfig(status: string) {
  if (status === 'ativa') return { label: 'Ativa', color: 'text-[#149D7F]', bg: 'bg-[#149D7F]/15' };
  if (status === 'encerrada') return { label: 'Encerrada', color: 'text-[#B0B3B8]', bg: 'bg-[#2F3336]' };
  return { label: 'Cancelada', color: 'text-[#E74C3C]', bg: 'bg-[#E74C3C]/15' };
}

function ChamadaCard({ chamada, instNome }: { chamada: Chamada; instNome: string }) {
  const navigate = useNavigate();
  const sc = statusConfig(chamada.status);
  const produtos = chamada.itens.map((i) => i.produto).join(', ');

  return (
    <button
      onClick={() => navigate(`/chamadas/${chamada.id}`)}
      className="w-full bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-3 text-left active:border-[#149D7F]/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#149D7F]/15 flex items-center justify-center flex-shrink-0">
            <School size={18} className="text-[#149D7F]" />
          </div>
          <div className="min-w-0">
            <p className="text-white leading-tight" style={{ fontSize: '14px', fontWeight: 600 }}>
              {chamada.titulo}
            </p>
            <p className="text-[#B0B3B8] mt-0.5 truncate" style={{ fontSize: '12px' }}>
              {instNome}
            </p>
          </div>
        </div>
        <span className={`${sc.bg} ${sc.color} px-2 py-0.5 rounded-full flex-shrink-0`} style={{ fontSize: '11px', fontWeight: 600 }}>
          {sc.label}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <Calendar size={12} className="text-[#B0B3B8]" />
        <span className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
          {formatDate(chamada.dataInicio)} - {formatDate(chamada.dataFim)}
        </span>
      </div>

      <p className="text-[#B0B3B8] mb-4 line-clamp-2" style={{ fontSize: '13px' }}>
        {produtos}
      </p>

      <div className="text-[#149D7F] flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600 }}>
        Ver detalhes <ChevronRight size={14} />
      </div>
    </button>
  );
}

export function ChamadasCentered() {
  const { chamadas, role, currentUserId, propostas, getInstituicao } = useAppContext();
  const [activeTab, setActiveTab] = useState<'todas' | 'minhas'>('todas');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const minhasChamadas =
    role === 'agricultor'
      ? chamadas.filter((c) => propostas.some((p) => p.chamadaId === c.id && p.agricultorId === currentUserId))
      : chamadas.filter((c) => c.instituicaoId === currentUserId);

  const availableTabs = role === 'agricultor' ? (['todas'] as const) : (['todas', 'minhas'] as const);

  const list = (role === 'agricultor' || activeTab === 'todas' ? chamadas : minhasChamadas).filter((c) =>
    c.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (getInstituicao(c.instituicaoId)?.nome || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-[#121212] h-full">
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 pt-3 pb-0 flex-shrink-0">
        <div className="relative flex items-center justify-center mb-3 min-h-[44px]">
          <img src={BRAND_ICON_SRC} alt={BRAND_NAME} className="w-35 h-11 object-contain" />
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#B0B3B8] rounded-full active:bg-[#2F3336]"
          >
            <Search size={20} />
          </button>
        </div>

        {showSearch && (
          <div className="mb-3">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar chamadas..."
              className="w-full bg-[#121212] border border-[#2F3336] text-white rounded-xl px-4 py-2.5 focus:border-[#149D7F] focus:outline-none placeholder:text-[#B0B3B8]"
              style={{ fontSize: '14px' }}
            />
          </div>
        )}

        <div className="flex">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 relative transition-colors ${
                activeTab === tab ? 'text-[#149D7F]' : 'text-[#B0B3B8]'
              }`}
              style={{ fontSize: '14px', fontWeight: activeTab === tab ? 600 : 400 }}
            >
              {tab === 'todas' ? 'Todas' : 'Minhas'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#149D7F] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-4 pb-4">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1D2226] flex items-center justify-center mb-4">
              <Search size={28} className="text-[#B0B3B8]" />
            </div>
            <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Nenhuma chamada encontrada
            </p>
            <p className="text-[#B0B3B8] mt-1" style={{ fontSize: '13px' }}>
              {role !== 'agricultor' && activeTab === 'minhas'
                ? 'Você não publicou chamadas ainda'
                : 'Tente ajustar sua busca'}
            </p>
          </div>
        ) : (
          list.map((chamada) => (
            <ChamadaCard
              key={chamada.id}
              chamada={chamada}
              instNome={getInstituicao(chamada.instituicaoId)?.nome || 'Instituição'}
            />
          ))
        )}
      </div>
    </div>
  );
}
