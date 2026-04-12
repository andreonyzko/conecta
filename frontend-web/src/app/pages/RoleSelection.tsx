import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ChevronRight, School, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { BRAND_NAME, BRAND_TAGLINE, BRAND_ICON_SRC } from '../config/branding';

const inputClass =
  'w-full bg-[#121212] border border-[#2F3336] text-white rounded-xl px-4 py-3 focus:border-[#149D7F] focus:outline-none placeholder:text-[#6F767E]';

export function RoleSelection() {
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAppContext();
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [role, setRole] = useState<UserRole>('agricultor');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [caf, setCaf] = useState('');
  const [numeroAlunos, setNumeroAlunos] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/chamadas" replace />;
  }

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      toast.error('Informe e-mail e senha.');
      return;
    }

    const authenticated = login(email);

    if (!authenticated) {
      toast.error('Usuário não encontrado.');
      return;
    }

    navigate('/chamadas');
  };

  const handleRegister = () => {
    const missingCadastroBase = !nome.trim() || !email.trim() || !telefone.trim() || !senha.trim() || !cpfCnpj.trim();
    const missingAgricultor = role === 'agricultor' && !caf.trim();
    const missingInstituicao = role === 'instituicao' && !numeroAlunos.trim();

    if (missingCadastroBase || missingAgricultor || missingInstituicao) {
      toast.error('Preencha todos os campos do cadastro.');
      return;
    }

    register({
      role,
      nome,
      email,
      telefone,
      cpfCnpj,
      caf,
      numeroAlunos: role === 'instituicao' ? Number(numeroAlunos) : undefined,
    });
    toast.success('Conta criada com sucesso.');
    navigate('/chamadas');
  };

  return (
    <div className="flex-1 overflow-y-auto agro-scroll bg-[#121212]">
      <div className="min-h-full px-6 py-8">
      <div className="flex flex-col items-center pt-6 pb-8">
        <img src={BRAND_ICON_SRC} alt={BRAND_NAME} className="w-70 h-28 object-contain" />
        <p className="text-[#B0B3B8] text-center max-w-[260px]" style={{ fontSize: '14px' }}>
          {BRAND_TAGLINE}
        </p>
      </div>

      <div className="bg-[#1D2226] border border-[#2F3336] rounded-[28px] p-5">
        <div className="flex bg-[#121212] rounded-2xl p-1 mb-5">
          {(['login', 'cadastro'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 rounded-[14px] py-2.5 transition-colors ${
                mode === tab ? 'bg-[#149D7F] text-white' : 'text-[#B0B3B8]'
              }`}
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              {tab === 'login' ? 'Login' : 'Cadastro'}
            </button>
          ))}
        </div>

        {mode === 'cadastro' && (
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setRole('agricultor')}
              className={`flex-1 rounded-2xl border px-4 py-4 text-left transition-colors ${
                role === 'agricultor'
                  ? 'border-[#149D7F] bg-[#149D7F]/10'
                  : 'border-[#2F3336] bg-[#121212]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sprout size={18} className={role === 'agricultor' ? 'text-[#149D7F]' : 'text-[#B0B3B8]'} />
                <span className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Agricultor
                </span>
              </div>
              <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
                Envia propostas e gerencia produtos.
              </p>
            </button>

            <button
              onClick={() => setRole('instituicao')}
              className={`flex-1 rounded-2xl border px-4 py-4 text-left transition-colors ${
                role === 'instituicao'
                  ? 'border-[#149D7F] bg-[#149D7F]/10'
                  : 'border-[#2F3336] bg-[#121212]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <School size={18} className={role === 'instituicao' ? 'text-[#149D7F]' : 'text-[#B0B3B8]'} />
                <span className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Instituição
                </span>
              </div>
              <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
                Publica chamadas e analisa propostas.
              </p>
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {mode === 'cadastro' && (
            <>
              <div>
                <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
                  Nome
                </label>
                <input
                  className={inputClass}
                  style={{ fontSize: '14px' }}
                  placeholder={role === 'agricultor' ? 'Nome completo' : 'Nome da instituição'}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
                  Telefone
                </label>
                <input
                  className={inputClass}
                  style={{ fontSize: '14px' }}
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
                  {role === 'agricultor' ? 'CPF/CNPJ' : 'CNPJ'}
                </label>
                <input
                  className={inputClass}
                  style={{ fontSize: '14px' }}
                  placeholder={role === 'agricultor' ? '000.000.000-00' : '00.000.000/0000-00'}
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                />
              </div>
              {role === 'agricultor' ? (
                <div>
                  <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
                    CAF
                  </label>
                  <input
                    className={inputClass}
                    style={{ fontSize: '14px' }}
                    placeholder="CAF-TO-2024-000000"
                    value={caf}
                    onChange={(e) => setCaf(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
                    Número de alunos
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    style={{ fontSize: '14px' }}
                    placeholder="850"
                    value={numeroAlunos}
                    onChange={(e) => setNumeroAlunos(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
              E-mail
            </label>
            <input
              className={inputClass}
              style={{ fontSize: '14px' }}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[#B0B3B8] mb-1.5" style={{ fontSize: '13px' }}>
              Senha
            </label>
            <input
              type="password"
              className={inputClass}
              style={{ fontSize: '14px' }}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            className="w-full bg-[#149D7F] text-white rounded-full py-3.5 flex items-center justify-center gap-2 active:opacity-80"
            style={{ fontSize: '15px', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Entrar' : 'Criar conta'} <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <p className="text-center text-[#6F767E]" style={{ fontSize: '12px' }}>
        Use um e-mail já existente nos mocks para login, ou crie uma nova conta.
      </p>
      </div>
    </div>
  );
}
