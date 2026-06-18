export type Route =
  | { name: 'auth' }
  | { name: 'chamadas' }
  | { name: 'propostas' }
  | { name: 'perfil' }
  | { name: 'chamadaDetalhe'; id: string }
  | { name: 'propostasInstituicao'; chamadaId: string }
  | { name: 'propostaDetalhe'; id: string }
  | { name: 'editarPerfil' }
  | { name: 'perfilAgricultor'; id: string }
  | { name: 'perfilInstituicao'; id: string }
  | { name: 'criarChamada' }
  | { name: 'enviarProposta'; chamadaId: string };

export type Nav = {
  go: (route: Route, replace?: boolean) => void;
  back: () => void;
};
