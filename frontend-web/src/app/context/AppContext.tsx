import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  UserRole,
  Agricultor,
  Instituicao,
  Chamada,
  Proposta,
  PropostaStatus,
  ChamadaStatus,
} from '../types';
import {
  mockAgricultores,
  mockInstituicoes,
  mockChamadas,
  mockPropostas,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  currentUserId: string;
  setRole: (role: UserRole) => void;
  chamadas: Chamada[];
  propostas: Proposta[];
  agricultores: Agricultor[];
  instituicoes: Instituicao[];
  addChamada: (chamada: Omit<Chamada, 'id'>) => void;
  cancelarChamada: (id: string) => void;
  addProposta: (proposta: Omit<Proposta, 'id' | 'dataCriacao'>) => void;
  cancelarProposta: (id: string) => void;
  updatePropostaStatus: (id: string, status: PropostaStatus) => void;
  updateAgricultor: (agricultor: Agricultor) => void;
  updateInstituicao: (instituicao: Instituicao) => void;
  getInstituicao: (id: string) => Instituicao | undefined;
  getAgricultor: (id: string) => Agricultor | undefined;
  getPropostasForChamada: (chamadaId: string) => Proposta[];
  getPropostasForAgricultor: (agricultorId: string) => Proposta[];
  getChamada: (id: string) => Chamada | undefined;
  getChamadasByInstituicao: (instituicaoId: string) => Chamada[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('agricultor');
  const [currentUserId, setCurrentUserId] = useState<string>('agr-1');
  const [chamadas, setChamadas] = useState<Chamada[]>(mockChamadas);
  const [propostas, setPropostas] = useState<Proposta[]>(mockPropostas);
  const [agricultores, setAgricultores] = useState<Agricultor[]>(mockAgricultores);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>(mockInstituicoes);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUserId(newRole === 'agricultor' ? 'agr-1' : 'inst-1');
  };

  const addChamada = (chamadaData: Omit<Chamada, 'id'>) => {
    const newChamada: Chamada = { ...chamadaData, id: `cha-${Date.now()}` };
    setChamadas((prev) => [newChamada, ...prev]);
  };

  const cancelarChamada = (id: string) => {
    setChamadas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'cancelada' as ChamadaStatus } : c))
    );
  };

  const addProposta = (propostaData: Omit<Proposta, 'id' | 'dataCriacao'>) => {
    const newProposta: Proposta = {
      ...propostaData,
      id: `prop-${Date.now()}`,
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setPropostas((prev) => [newProposta, ...prev]);
  };

  const cancelarProposta = (id: string) => {
    setPropostas((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePropostaStatus = (id: string, status: PropostaStatus) => {
    setPropostas((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const updateAgricultor = (agricultor: Agricultor) => {
    setAgricultores((prev) => prev.map((a) => (a.id === agricultor.id ? agricultor : a)));
  };

  const updateInstituicao = (instituicao: Instituicao) => {
    setInstituicoes((prev) => prev.map((i) => (i.id === instituicao.id ? instituicao : i)));
  };

  const getInstituicao = (id: string) => instituicoes.find((i) => i.id === id);
  const getAgricultor = (id: string) => agricultores.find((a) => a.id === id);
  const getPropostasForChamada = (chamadaId: string) =>
    propostas.filter((p) => p.chamadaId === chamadaId);
  const getPropostasForAgricultor = (agricultorId: string) =>
    propostas.filter((p) => p.agricultorId === agricultorId);
  const getChamada = (id: string) => chamadas.find((c) => c.id === id);
  const getChamadasByInstituicao = (instituicaoId: string) =>
    chamadas.filter((c) => c.instituicaoId === instituicaoId);

  return (
    <AppContext.Provider
      value={{
        role,
        currentUserId,
        setRole,
        chamadas,
        propostas,
        agricultores,
        instituicoes,
        addChamada,
        cancelarChamada,
        addProposta,
        cancelarProposta,
        updatePropostaStatus,
        updateAgricultor,
        updateInstituicao,
        getInstituicao,
        getAgricultor,
        getPropostasForChamada,
        getPropostasForAgricultor,
        getChamada,
        getChamadasByInstituicao,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
