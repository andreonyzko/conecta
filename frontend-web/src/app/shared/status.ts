import { PropostaStatus } from '../types';

export function statusChamada(status: string) {
  if (status === 'ativa') return { label: 'Ativa', tone: 'green' as const };
  if (status === 'encerrada') return { label: 'Encerrada', tone: 'gray' as const };
  return { label: 'Cancelada', tone: 'red' as const };
}

export function statusProposta(status: PropostaStatus) {
  const map = {
    pendente: { label: 'Pendente', tone: 'yellow' as const },
    aceita: { label: 'Aceita', tone: 'green' as const },
    rejeitada: { label: 'Rejeitada', tone: 'red' as const },
    chamada_cancelada: { label: 'Chamada cancelada', tone: 'orange' as const },
  };
  return map[status];
}
