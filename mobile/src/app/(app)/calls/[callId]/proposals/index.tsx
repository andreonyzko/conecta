import { View, Text } from 'react-native'
import React from 'react'
import ProposalListScreen from '@/screens/ProposalListScreen'
import { useAuth } from '@/context/AuthContext';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { mockCalls } from '@/data/mock';

export default function CallProposalsRoute() {
  const { user } = useAuth();
  const { callId } = useLocalSearchParams<{ callId: string }>();

  const call = mockCalls.find(c => c.id === Number(callId));

  if(!user || !call || user.type !== "institution" || user.id !== Number(call.institutionId)){
    return <Redirect href="/calls"/>
  }

  return <ProposalListScreen/>;
}