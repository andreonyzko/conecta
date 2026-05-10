import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { UserRole } from '../types';
import { Route } from './types';
import { C } from '../shared/theme';
import { Icon } from '../components/ui/ui';

export function BottomNav({ active, role, go }: { active: Route['name']; role: UserRole; go: (route: Route, replace?: boolean) => void }) {
  const items = role === 'agricultor'
    ? [
        { key: 'chamadas' as const, label: 'Chamadas', icon: '⌂' },
        { key: 'propostas' as const, label: 'Propostas', icon: '□' },
        { key: 'perfil' as const, label: 'Perfil', icon: '○' },
      ]
    : [
        { key: 'chamadas' as const, label: 'Chamadas', icon: '⌂' },
        { key: 'criarChamada' as const, label: 'Publicar', icon: '+' },
        { key: 'perfil' as const, label: 'Perfil', icon: '○' },
      ];

  return (
    <View className="flex-row border-t border-agro-border bg-agro-panel py-2">
      {items.map((item) => {
        const selected = active === item.key;
        return (
          <TouchableOpacity key={item.key} onPress={() => go({ name: item.key } as Route, true)} className="flex-1 items-center gap-0.5">
            <Icon name={item.icon} size={22} color={selected ? C.green : C.muted} />
            <Text className={`text-[11px] ${selected ? 'font-bold text-agro-green' : 'text-agro-muted'}`}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
