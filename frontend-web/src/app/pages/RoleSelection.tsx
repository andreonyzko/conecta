import { useNavigate } from 'react-router';
import { Sprout, School, ChevronRight, Leaf } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

export function RoleSelection() {
  const { setRole } = useAppContext();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole) => {
    setRole(role);
    navigate('/chamadas');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] px-6 py-10 h-full">
      {/* Logo */}
      <div className="flex flex-col items-center pt-10 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#149D7F]/20 flex items-center justify-center mb-4">
          <Leaf size={32} className="text-[#149D7F]" />
        </div>
        <h1 className="text-white text-center" style={{ fontSize: '26px', fontWeight: 700 }}>
          AgroConecta
        </h1>
        <p className="text-[#B0B3B8] text-center mt-2" style={{ fontSize: '14px' }}>
          Conectando agricultores familiares{'\n'}com instituições de ensino
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-[#2F3336]" />
        <span className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
          Como você quer acessar?
        </span>
        <div className="flex-1 h-px bg-[#2F3336]" />
      </div>

      {/* Role cards */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleSelect('agricultor')}
          className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-5 flex items-center gap-4 active:border-[#149D7F] active:bg-[#149D7F]/10 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#149D7F]/20 flex items-center justify-center flex-shrink-0">
            <Sprout size={24} className="text-[#149D7F]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Agricultor Familiar
            </p>
            <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '13px' }}>
              Visualize chamadas e envie propostas de fornecimento
            </p>
          </div>
          <ChevronRight size={18} className="text-[#B0B3B8] flex-shrink-0" />
        </button>

        <button
          onClick={() => handleSelect('instituicao')}
          className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-5 flex items-center gap-4 active:border-[#149D7F] active:bg-[#149D7F]/10 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#149D7F]/20 flex items-center justify-center flex-shrink-0">
            <School size={24} className="text-[#149D7F]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Instituição de Ensino
            </p>
            <p className="text-[#B0B3B8] mt-0.5" style={{ fontSize: '13px' }}>
              Publique chamadas e receba propostas de agricultores
            </p>
          </div>
          <ChevronRight size={18} className="text-[#B0B3B8] flex-shrink-0" />
        </button>
      </div>

      <div className="flex-1" />

      <p className="text-center text-[#B0B3B8]" style={{ fontSize: '12px' }}>
        Programa Nacional de Alimentação Escolar · PNAE
      </p>
    </div>
  );
}
