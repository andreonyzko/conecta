import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useAppContext } from '../context/AppContext';
import { Route } from './types';
import { BottomNav } from './BottomNav';
import { RoleSelection } from '../screens/auth/RoleSelection';
import { Chamadas } from '../screens/chamadas/Chamadas';
import { ChamadaDetalhe } from '../screens/chamadas/ChamadaDetalhe';
import { CriarChamada } from '../screens/chamadas/CriarChamada';
import { Propostas } from '../screens/propostas/Propostas';
import { PropostasInstituicao } from '../screens/propostas/PropostasInstituicao';
import { PropostaDetalhe } from '../screens/propostas/PropostaDetalhe';
import { EnviarProposta } from '../screens/propostas/EnviarProposta';
import { Perfil } from '../screens/perfil/Perfil';
import { PerfilAgricultorView } from '../screens/perfil/PerfilAgricultorView';
import { PerfilInstituicaoView } from '../screens/perfil/PerfilInstituicaoView';
import { EditarPerfil } from '../screens/perfil/EditarPerfil';

export function AppNavigator() {
  const { isAuthenticated, role } = useAppContext();
  const [stack, setStack] = useState<Route[]>([{ name: 'auth' }]);
  const current = stack[stack.length - 1];

  const go = (route: Route, replace = false) => {
    setStack((prev) => (replace ? [route] : [...prev, route]));
  };
  const back = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : [{ name: 'chamadas' }]));

  const nav = { go, back };
  const route = isAuthenticated || current.name === 'auth' ? current : { name: 'auth' as const };
  const showTabs = route.name === 'chamadas' || route.name === 'propostas' || route.name === 'perfil';

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-agro-bg">
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View className="flex-1 bg-agro-bg">
        {route.name === 'auth' && <RoleSelection nav={nav} />}
        {route.name === 'chamadas' && <Chamadas nav={nav} />}
        {route.name === 'propostas' && <Propostas nav={nav} />}
        {route.name === 'perfil' && <Perfil nav={nav} />}
        {route.name === 'chamadaDetalhe' && <ChamadaDetalhe id={route.id} nav={nav} />}
        {route.name === 'propostasInstituicao' && <PropostasInstituicao chamadaId={route.chamadaId} nav={nav} />}
        {route.name === 'propostaDetalhe' && <PropostaDetalhe id={route.id} nav={nav} />}
        {route.name === 'editarPerfil' && <EditarPerfil nav={nav} />}
        {route.name === 'perfilAgricultor' && <PerfilAgricultorView id={route.id} nav={nav} />}
        {route.name === 'perfilInstituicao' && <PerfilInstituicaoView id={route.id} nav={nav} />}
        {route.name === 'criarChamada' && <CriarChamada nav={nav} />}
        {route.name === 'enviarProposta' && <EnviarProposta chamadaId={route.chamadaId} nav={nav} />}
        {showTabs && <BottomNav active={route.name} role={role} go={go} />}
      </View>
    </SafeAreaView>
  );
}
