import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FileText, Home, PlusSquare, User } from 'lucide-react-native';
import { UserRole } from '../types';
import { Route } from './types';
import { C } from '../shared/theme';

export function BottomNav({ active, role, go }: { active: Route['name']; role: UserRole; go: (route: Route, replace?: boolean) => void }) {
  const items = role === 'agricultor'
    ? [
        { key: 'chamadas' as const, label: 'Chamadas', Icon: Home },
        { key: 'propostas' as const, label: 'Propostas', Icon: FileText },
        { key: 'perfil' as const, label: 'Perfil', Icon: User },
      ]
    : [
        { key: 'chamadas' as const, label: 'Chamadas', Icon: Home },
        { key: 'criarChamada' as const, label: 'Publicar', Icon: PlusSquare },
        { key: 'perfil' as const, label: 'Perfil', Icon: User },
      ];

  return (
    <View className="flex-row border-t border-agro-border bg-agro-panel py-2">
      {items.map((item) => {
        const selected = active === item.key;
        const TabIcon = item.Icon;
        return (
          <TouchableOpacity key={item.key} onPress={() => go({ name: item.key } as Route, true)} className="flex-1 items-center gap-0.5">
            <TabIcon size={22} color={selected ? C.green : C.muted} strokeWidth={selected ? 2.5 : 1.8} />
            <Text className={`text-[11px] ${selected ? 'font-bold text-agro-green' : 'text-agro-muted'}`}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
