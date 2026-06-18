import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function FarmerProfileScreen() {
   const { signOut } = useAuth();

  return (
    <View>
      <Text>FarmerProfileScreen</Text>
      <Button onPress={signOut}>
        <Text>Sair</Text>
      </Button>
    </View>
  )
}