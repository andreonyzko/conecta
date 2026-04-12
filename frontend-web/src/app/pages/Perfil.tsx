import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Star,
  User,
  Sprout,
  School,
  Edit3,
  Truck,
  Leaf,
  CheckCircle,
  Users,
  ChevronRight,
  LogOut,
  Trophy,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Agricultor, Instituicao, ProdutoAgricultor, Chamada } from '../types';

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function ProdutoCard({ produto }: { produto: ProdutoAgricultor }) {
  return (
    <div className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
              {produto.nome}
            </p>
            {produto.organico && (
              <span className="bg-[#149D7F]/15 text-[#149D7F] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ fontSize: '10px', fontWeight: 600 }}>
                <Leaf size={9} /> Orgânico
              </span>
            )}
          </div>
          <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '12px' }}>
            {produto.categoria}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white" style={{ fontSize: '13px', fontWeight: 600 }}>
            {produto.capacidadeMensal} {produto.unidade}/mês
          </p>
          <p className="text-[#149D7F]" style={{ fontSize: '12px' }}>
            R$ {produto.precoSugerido.toFixed(2).replace('.', ',')}/{produto.unidade}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {produto.mesesDisponiveis.map((m) => (
          <span key={m} className="bg-[#2F3336] text-[#B0B3B8] px-2 py-0.5 rounded-full" style={{ fontSize: '10px' }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function AgricultorProfile({
  agricultor,
  isOwner,
  onEdit,
}: {
  agricultor: Agricultor;
  isOwner: boolean;
  onEdit?: () => void;
}) {
  const { getInstituicao, getChamada } = useAppContext();
  const initials = agricultor.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');
  const mediaAvaliacoes =
    agricultor.avaliacoes.length > 0
      ? agricultor.avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0) /
        agricultor.avaliacoes.length
      : 0;

  return (
    <>
      {/* Hero section */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 pt-5 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-full bg-[#149D7F]/20 flex items-center justify-center">
            <span className="text-[#149D7F]" style={{ fontSize: '22px', fontWeight: 700 }}>
              {initials}
            </span>
          </div>
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 border border-[#2F3336] text-white px-3.5 py-2 rounded-full active:bg-[#2F3336]"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Edit3 size={14} /> Editar
            </button>
          )}
        </div>

        <h1 className="text-white mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
          {agricultor.nome}
        </h1>

        <div className="flex items-center gap-1.5 mb-2">
          <Sprout size={13} className="text-[#149D7F]" />
          <span className="text-[#B0B3B8]" style={{ fontSize: '13px' }}>
            CAF: {agricultor.caf}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {agricultor.realizaEntrega && (
            <div className="inline-flex items-center gap-1.5 bg-[#149D7F]/15 text-[#149D7F] px-3 py-1.5 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              <Truck size={12} />
              Realiza entrega própria
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 bg-[#F59E0B]/12 text-[#FBBF24] px-3 py-1.5 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
            <Star size={12} />
            {agricultor.avaliacoes.length > 0 ? mediaAvaliacoes.toFixed(1).replace('.', ',') : 'Sem notas'}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <div className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-5">
          <p className="text-[#B0B3B8]" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Contato
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            <p className="text-white" style={{ fontSize: '13px' }}>{agricultor.email}</p>
            <p className="text-white" style={{ fontSize: '13px' }}>{agricultor.telefone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} className="text-[#149D7F]" />
          <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
            Chamadas publicas ganhas ({agricultor.licitacoesGanhas.length})
          </span>
        </div>
        {agricultor.licitacoesGanhas.length === 0 ? (
          <p className="text-[#B0B3B8] text-center py-4" style={{ fontSize: '14px' }}>
            Nenhuma licitação ganha até o momento
          </p>
        ) : (
          agricultor.licitacoesGanhas.map((licitacao) => {
            const chamada = getChamada(licitacao.chamadaId);
            const instituicao = getInstituicao(licitacao.instituicaoId);
            return (
              <div key={licitacao.id} className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {chamada?.titulo || 'Chamada finalizada'}
                    </p>
                    <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '12px' }}>
                      {instituicao?.nome || 'Instituição'}
                    </p>
                  </div>
                  <p className="text-[#149D7F]" style={{ fontSize: '13px', fontWeight: 700 }}>
                    {formatCurrency(licitacao.valor)}
                  </p>
                </div>
                <p className="text-[#B0B3B8] mt-2" style={{ fontSize: '11px' }}>
                  Concluída em {formatDate(licitacao.dataConclusao)}
                </p>
              </div>
            );
          })
        )}

        <div className="flex items-center gap-2 mb-3 mt-6">
          <Star size={16} className="text-[#149D7F]" />
          <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
            Avaliações ({agricultor.avaliacoes.length})
          </span>
        </div>
        {agricultor.avaliacoes.length === 0 ? (
          <p className="text-[#B0B3B8] text-center py-4" style={{ fontSize: '14px' }}>
            Este agricultor ainda não recebeu avaliações
          </p>
        ) : (
          agricultor.avaliacoes.map((avaliacao) => {
            const instituicao = getInstituicao(avaliacao.instituicaoId);
            return (
              <div key={avaliacao.id} className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="text-white" style={{ fontSize: '13px', fontWeight: 600 }}>
                      {instituicao?.nome || 'Instituição'}
                    </p>
                    <p className="text-[#B0B3B8]" style={{ fontSize: '11px' }}>
                      {formatDate(avaliacao.data)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[#FBBF24]" style={{ fontSize: '12px', fontWeight: 700 }}>
                    <Star size={12} fill="currentColor" />
                    {avaliacao.nota.toFixed(1).replace('.', ',')}
                  </div>
                </div>
                <p className="text-[#B0B3B8]" style={{ fontSize: '13px' }}>
                  {avaliacao.comentario}
                </p>
              </div>
            );
          })
        )}

        <div className="flex items-center gap-2 mb-3">
          <Sprout size={16} className="text-[#149D7F]" />
          <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
            Produtos ({agricultor.produtos.length})
          </span>
        </div>
        {agricultor.produtos.length === 0 ? (
          <p className="text-[#B0B3B8] text-center py-4" style={{ fontSize: '14px' }}>
            Nenhum produto cadastrado
          </p>
        ) : (
          agricultor.produtos.map((p) => <ProdutoCard key={p.id} produto={p} />)
        )}
      </div>
    </>
  );
}

function InstituicaoProfile({
  instituicao,
  chamadas,
  isOwner,
  onEdit,
}: {
  instituicao: Instituicao;
  chamadas: Chamada[];
  isOwner: boolean;
  onEdit?: () => void;
}) {
  const navigate = useNavigate();
  const initials = instituicao.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <>
      {/* Hero */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 pt-5 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-full bg-[#149D7F]/20 flex items-center justify-center">
            <span className="text-[#149D7F]" style={{ fontSize: '20px', fontWeight: 700 }}>
              {initials}
            </span>
          </div>
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 border border-[#2F3336] text-white px-3.5 py-2 rounded-full active:bg-[#2F3336]"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Edit3 size={14} /> Editar
            </button>
          )}
        </div>

        <h1 className="text-white mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>
          {instituicao.nome}
        </h1>

        <div className="flex items-center gap-1.5 mb-2">
          <School size={13} className="text-[#149D7F]" />
          <span className="text-[#B0B3B8]" style={{ fontSize: '13px' }}>
            CNPJ: {instituicao.cnpj}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#149D7F]/15 text-[#149D7F] px-3 py-1.5 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
          <Users size={12} />
          {instituicao.numeroAlunos.toLocaleString('pt-BR')} alunos
        </div>
      </div>

      {/* Contact */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4 mb-5">
          <p className="text-[#B0B3B8]" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Contato
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            <p className="text-white" style={{ fontSize: '13px' }}>{instituicao.email}</p>
            <p className="text-white" style={{ fontSize: '13px' }}>{instituicao.telefone}</p>
          </div>
        </div>

        {/* Chamadas */}
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={16} className="text-[#149D7F]" />
          <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
            Chamadas Publicadas ({chamadas.length})
          </span>
        </div>

        {chamadas.length === 0 ? (
          <p className="text-[#B0B3B8] text-center py-4" style={{ fontSize: '14px' }}>
            Nenhuma chamada publicada
          </p>
        ) : (
          chamadas.map((c) => {
            const sc = c.status === 'ativa' ? { label: 'Ativa', color: 'text-[#149D7F]', bg: 'bg-[#149D7F]/15' } : c.status === 'encerrada' ? { label: 'Encerrada', color: 'text-[#B0B3B8]', bg: 'bg-[#2F3336]' } : { label: 'Cancelada', color: 'text-[#E74C3C]', bg: 'bg-[#E74C3C]/15' };
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/chamadas/${c.id}`)}
                className="w-full bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2 flex items-center justify-between active:border-[#149D7F]/40"
              >
                <div className="flex-1 text-left mr-2">
                  <p className="text-white truncate" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {c.titulo}
                  </p>
                  <span className={`${sc.bg} ${sc.color} px-2 py-0.5 rounded-full`} style={{ fontSize: '10px', fontWeight: 600 }}>
                    {sc.label}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[#B0B3B8] flex-shrink-0" />
              </button>
            );
          })
        )}
      </div>
    </>
  );
}

// Own profile page (with BottomNav, in MainLayout)
export function Perfil() {
  const navigate = useNavigate();
  const { role, currentUserId, getAgricultor, getInstituicao, getChamadasByInstituicao, logout } =
    useAppContext();

  return (
    <div className="flex flex-col bg-[#121212] h-full">
      <div className="flex-1 overflow-y-auto agro-scroll">
        {role === 'agricultor' ? (
          (() => {
            const agr = getAgricultor(currentUserId);
            if (!agr) return null;
            return (
              <AgricultorProfile
                agricultor={agr}
                isOwner={true}
                onEdit={() => navigate('/perfil/editar')}
              />
            );
          })()
        ) : (
          (() => {
            const inst = getInstituicao(currentUserId);
            if (!inst) return null;
            return (
              <InstituicaoProfile
                instituicao={inst}
                chamadas={getChamadasByInstituicao(currentUserId)}
                isOwner={true}
                onEdit={() => navigate('/perfil/editar')}
              />
            );
          })()
        )}

        <div className="px-4 py-4">
          <div className="h-px bg-[#2F3336] mb-4" />
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 border border-[#2F3336] text-[#B0B3B8] rounded-full py-3 active:bg-[#2F3336]"
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// View any agricultor profile (no BottomNav)
export function PerfilAgricultorView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAgricultor, role, currentUserId } = useAppContext();
  const agr = getAgricultor(id!);

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-0">
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white flex-1" style={{ fontSize: '16px', fontWeight: 600 }}>
          Perfil do Agricultor
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto agro-scroll">
        {agr ? (
          <AgricultorProfile
            agricultor={agr}
            isOwner={role === 'agricultor' && id === currentUserId}
            onEdit={() => navigate('/perfil/editar')}
          />
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-[#B0B3B8]">Agricultor não encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

// View any instituicao profile (no BottomNav)
export function PerfilInstituicaoView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInstituicao, getChamadasByInstituicao, role, currentUserId } = useAppContext();
  const inst = getInstituicao(id!);

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-0">
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white flex-1" style={{ fontSize: '16px', fontWeight: 600 }}>
          Perfil da Instituição
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto agro-scroll">
        {inst ? (
          <InstituicaoProfile
            instituicao={inst}
            chamadas={getChamadasByInstituicao(id!)}
            isOwner={role === 'instituicao' && id === currentUserId}
            onEdit={() => navigate('/perfil/editar')}
          />
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-[#B0B3B8]">Instituição não encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
