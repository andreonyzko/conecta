import { createBrowserRouter } from 'react-router';
import { PhoneWrapper } from './components/PhoneWrapper';
import { MainLayout } from './components/MainLayout';
import { RoleSelection } from './pages/RoleSelection';
import { Chamadas } from './pages/Chamadas';
import { ChamadaDetalhe } from './pages/ChamadaDetalhe';
import { Propostas } from './pages/Propostas';
import { PropostasInstituicao } from './pages/PropostasInstituicao';
import { PropostaDetalhe } from './pages/PropostaDetalhe';
import { Perfil, PerfilAgricultorView, PerfilInstituicaoView } from './pages/Perfil';
import { EditarPerfil } from './pages/EditarPerfil';
import { CriarChamada } from './pages/CriarChamada';
import { EnviarProposta } from './pages/EnviarProposta';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PhoneWrapper,
    children: [
      { index: true, Component: RoleSelection },
      {
        // Pathless layout route (with BottomNav)
        Component: MainLayout,
        children: [
          { path: 'chamadas', Component: Chamadas },
          { path: 'propostas', Component: Propostas },
          { path: 'perfil', Component: Perfil },
        ],
      },
      // Detail / Form pages (no BottomNav)
      { path: 'chamadas/:id', Component: ChamadaDetalhe },
      { path: 'chamadas/:chamadaId/propostas', Component: PropostasInstituicao },
      { path: 'propostas/:id', Component: PropostaDetalhe },
      { path: 'perfil/editar', Component: EditarPerfil },
      { path: 'perfil/agricultor/:id', Component: PerfilAgricultorView },
      { path: 'perfil/instituicao/:id', Component: PerfilInstituicaoView },
      { path: 'criar-chamada', Component: CriarChamada },
      { path: 'enviar-proposta/:chamadaId', Component: EnviarProposta },
    ],
  },
]);
