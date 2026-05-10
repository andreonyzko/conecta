import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { Agricultor, Chamada, Instituicao, ItemChamada, ItemProposta, ProdutoAgricultor, Proposta, PropostaStatus, UserRole } from '../../types';
import { BRAND_NAME, BRAND_TAGLINE } from '../../config/branding';
import { Nav, Route } from '../../navigation/types';
import { C } from '../../shared/theme';
import { logo } from '../../shared/assets';
import { formatCurrency, formatDate } from '../../shared/formatters';
import { notify } from '../../shared/feedback';
import { statusChamada, statusProposta } from '../../shared/status';
import { Badge, Button, Empty, Field, Header, Icon, InfoCard, SectionTitle, SwitchRow } from '../../components/ui/ui';
import { NotFound } from '../../components/ui/NotFound';

export function RoleSelection({ nav }: { nav: Nav }) {
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
    setTimeout(() => nav.go({ name: 'chamadas' }, true), 0);
  }

  const submit = () => {
    if (mode === 'login') {
      if (!email.trim() || !senha.trim()) return notify('Informe e-mail e senha.');
      if (!login(email)) return notify('Usuario nao encontrado.');
      nav.go({ name: 'chamadas' }, true);
      return;
    }

    const missingBase = !nome.trim() || !email.trim() || !telefone.trim() || !senha.trim() || !cpfCnpj.trim();
    const missingRole = role === 'agricultor' ? !caf.trim() : !numeroAlunos.trim();
    if (missingBase || missingRole) return notify('Preencha todos os campos do cadastro.');
    register({ role, nome, email, telefone, cpfCnpj, caf, numeroAlunos: role === 'instituicao' ? Number(numeroAlunos) : undefined });
    nav.go({ name: 'chamadas' }, true);
  };

  return (
    <ScrollView className="flex-1 bg-agro-bg" contentContainerClassName="gap-4 px-6 pb-6 pt-9">
      <Image source={logo} resizeMode="contain" className="mb-[-4px] h-[120px] w-full" accessibilityLabel={BRAND_NAME} />
      <Text className="mb-3 text-center text-sm text-agro-muted">{BRAND_TAGLINE}</Text>

      <View className="gap-2.5 rounded-[18px] border border-agro-border bg-agro-panel p-4">
        <View className="mb-2.5 flex-row rounded-2xl bg-agro-bg p-1">
          {(['login', 'cadastro'] as const).map((item) => (
            <TouchableOpacity key={item} onPress={() => setMode(item)} className={`flex-1 items-center rounded-xl py-2.5 ${mode === item ? 'bg-agro-green' : ''}`}>
              <Text className={`font-bold ${mode === item ? 'text-white' : 'text-agro-muted'}`}>{item === 'login' ? 'Login' : 'Cadastro'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'cadastro' && (
          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity onPress={() => setRole('agricultor')} className={`flex-1 rounded-[14px] border p-3 ${role === 'agricultor' ? 'border-agro-green bg-agro-green/10' : 'border-agro-border bg-agro-bg'}`}>
              <Text className="mb-1 font-bold text-white">Agricultor</Text>
              <Text className="text-xs text-agro-muted">Envia propostas e gerencia produtos.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRole('instituicao')} className={`flex-1 rounded-[14px] border p-3 ${role === 'instituicao' ? 'border-agro-green bg-agro-green/10' : 'border-agro-border bg-agro-bg'}`}>
              <Text className="mb-1 font-bold text-white">Instituicao</Text>
              <Text className="text-xs text-agro-muted">Publica chamadas e analisa propostas.</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'cadastro' && (
          <>
            <Field label="Nome" value={nome} onChangeText={setNome} placeholder={role === 'agricultor' ? 'Nome completo' : 'Nome da instituicao'} />
            <Field label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" />
            <Field label={role === 'agricultor' ? 'CPF/CNPJ' : 'CNPJ'} value={cpfCnpj} onChangeText={setCpfCnpj} placeholder="00.000.000/0000-00" />
            {role === 'agricultor' ? (
              <Field label="CAF" value={caf} onChangeText={setCaf} placeholder="CAF-TO-2024-000000" />
            ) : (
              <Field label="Numero de alunos" value={numeroAlunos} onChangeText={setNumeroAlunos} keyboardType="numeric" placeholder="850" />
            )}
          </>
        )}
        <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="seu@email.com" />
        <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="********" />
        <Button onPress={submit}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Button>
      </View>
      <Text className="text-center text-xs text-agro-dim">Use um e-mail existente nos mocks para login, ou crie uma nova conta.</Text>
    </ScrollView>
  );
}
