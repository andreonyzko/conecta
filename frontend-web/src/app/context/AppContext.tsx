import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  UserRole,
  Agricultor,
  Instituicao,
  Chamada,
  Proposta,
  PropostaStatus,
  ChamadaStatus,
  AvaliacaoEncerramento,
  ItemChamada,
} from '../types';
import {
  mockAgricultores,
  mockInstituicoes,
  mockChamadas,
  mockPropostas,
} from '../data/mockData';

interface AppContextType {
  isAuthenticated: boolean;
  role: UserRole;
  currentUserId: string;
  login: (email: string) => boolean;
  register: (data: {
    role: UserRole;
    nome: string;
    email: string;
    telefone: string;
    cpfCnpj: string;
    caf?: string;
    numeroAlunos?: number;
  }) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  chamadas: Chamada[];
  propostas: Proposta[];
  agricultores: Agricultor[];
  instituicoes: Instituicao[];
  addChamada: (chamada: Omit<Chamada, 'id'>) => void;
  cancelarChamada: (id: string) => void;
  encerrarChamada: (id: string, avaliacoes: AvaliacaoEncerramento[]) => void;
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
  getProdutosAceitosForChamada: (chamadaId: string) => string[];
  getItensDisponiveisForChamada: (chamadaId: string) => ItemChamada[];
  canAcceptProposta: (propostaId: string) => { canAccept: boolean; blockedProducts: string[] };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRoleState] = useState<UserRole>('agricultor');
  const [currentUserId, setCurrentUserId] = useState<string>('agr-1');
  const [chamadas, setChamadas] = useState<Chamada[]>(mockChamadas);
  const [propostas, setPropostas] = useState<Proposta[]>(mockPropostas);
  const [agricultores, setAgricultores] = useState<Agricultor[]>(mockAgricultores);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>(mockInstituicoes);

  const login = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const agricultor = agricultores.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (agricultor) {
      setRoleState('agricultor');
      setCurrentUserId(agricultor.id);
      setIsAuthenticated(true);
      return true;
    }

    const instituicao = instituicoes.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!instituicao) {
      return false;
    }

    setRoleState('instituicao');
    setCurrentUserId(instituicao.id);
    setIsAuthenticated(true);
    return true;
  };

  const register = ({
    role: nextRole,
    nome,
    email,
    telefone,
    cpfCnpj,
    caf,
    numeroAlunos,
  }: {
    role: UserRole;
    nome: string;
    email: string;
    telefone: string;
    cpfCnpj: string;
    caf?: string;
    numeroAlunos?: number;
  }) => {
    if (nextRole === 'agricultor') {
      const id = `agr-${Date.now()}`;
      setAgricultores((prev) => [
        {
          id,
          nome,
          cpf: cpfCnpj,
          caf: caf || '',
          telefone,
          email,
          realizaEntrega: false,
          produtos: [],
          avaliacoes: [],
          licitacoesGanhas: [],
        },
        ...prev,
      ]);
      setCurrentUserId(id);
    } else {
      const id = `inst-${Date.now()}`;
      setInstituicoes((prev) => [
        {
          id,
          nome,
          cnpj: cpfCnpj,
          telefone,
          email,
          numeroAlunos: numeroAlunos || 0,
        },
        ...prev,
      ]);
      setCurrentUserId(id);
    }

    setRoleState(nextRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRoleState('agricultor');
    setCurrentUserId('agr-1');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUserId(newRole === 'agricultor' ? 'agr-1' : 'inst-1');
  };

  const addChamada = (chamadaData: Omit<Chamada, 'id'>) => {
    const newChamada: Chamada = { ...chamadaData, id: `cha-${Date.now()}` };
    setChamadas((prev) => [newChamada, ...prev]);
  };

  const getProdutosAceitosForChamada = (chamadaId: string) => {
    const normalized = new Set<string>();

    propostas
      .filter((proposta) => proposta.chamadaId === chamadaId && proposta.status === 'aceita')
      .forEach((proposta) => {
        proposta.itens.forEach((item) => normalized.add(item.produto.trim().toLowerCase()));
      });

    return Array.from(normalized);
  };

  const getItensDisponiveisForChamada = (chamadaId: string) => {
    const chamada = chamadas.find((item) => item.id === chamadaId);
    if (!chamada) {
      return [];
    }

    const aceitos = new Set(getProdutosAceitosForChamada(chamadaId));
    return chamada.itens.filter((item) => !aceitos.has(item.produto.trim().toLowerCase()));
  };

  const canAcceptProposta = (propostaId: string) => {
    const proposta = propostas.find((item) => item.id === propostaId);
    if (!proposta) {
      return { canAccept: false, blockedProducts: [] };
    }

    const acceptedProducts = new Set(
      propostas
        .filter(
          (item) =>
            item.chamadaId === proposta.chamadaId &&
            item.status === 'aceita' &&
            item.id !== proposta.id
        )
        .flatMap((item) => item.itens.map((produto) => produto.produto.trim().toLowerCase()))
    );

    const blockedProducts = proposta.itens
      .map((item) => item.produto)
      .filter((produto) => acceptedProducts.has(produto.trim().toLowerCase()));

    return { canAccept: blockedProducts.length === 0, blockedProducts };
  };

  const cancelarChamada = (id: string) => {
    setChamadas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'cancelada' as ChamadaStatus } : c))
    );
    setPropostas((prev) =>
      prev.map((proposta) =>
        proposta.chamadaId === id
          ? { ...proposta, status: 'chamada_cancelada' as PropostaStatus }
          : proposta
      )
    );
  };

  const encerrarChamada = (id: string, avaliacoes: AvaliacaoEncerramento[]) => {
    setChamadas((prev) =>
      prev.map((chamada) => (chamada.id === id ? { ...chamada, status: 'encerrada' as ChamadaStatus } : chamada))
    );

    const chamada = chamadas.find((item) => item.id === id);
    if (!chamada) {
      return;
    }

    const propostasAceitas = propostas.filter(
      (proposta) => proposta.chamadaId === id && proposta.status === 'aceita'
    );

    setAgricultores((prev) =>
      prev.map((agricultor) => {
        const avaliacao = avaliacoes.find((item) => item.agricultorId === agricultor.id);
        const propostaAceita = propostasAceitas.find((item) => item.agricultorId === agricultor.id);

        if (!avaliacao && !propostaAceita) {
          return agricultor;
        }

        return {
          ...agricultor,
          avaliacoes: avaliacao
            ? [
                {
                  id: `ava-${Date.now()}-${agricultor.id}`,
                  instituicaoId: chamada.instituicaoId,
                  nota: avaliacao.nota,
                  comentario: avaliacao.comentario,
                  data: new Date().toISOString().split('T')[0],
                },
                ...agricultor.avaliacoes,
              ]
            : agricultor.avaliacoes,
          licitacoesGanhas: propostaAceita
            ? [
                {
                  id: `lic-${Date.now()}-${agricultor.id}`,
                  chamadaId: chamada.id,
                  instituicaoId: chamada.instituicaoId,
                  valor: propostaAceita.valorTotal,
                  dataConclusao: new Date().toISOString().split('T')[0],
                },
                ...agricultor.licitacoesGanhas.filter((item) => item.chamadaId !== chamada.id),
              ]
            : agricultor.licitacoesGanhas,
        };
      })
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
        isAuthenticated,
        role,
        currentUserId,
        login,
        register,
        logout,
        setRole,
        chamadas,
        propostas,
        agricultores,
        instituicoes,
        addChamada,
        cancelarChamada,
        encerrarChamada,
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
        getProdutosAceitosForChamada,
        getItensDisponiveisForChamada,
        canAcceptProposta,
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
