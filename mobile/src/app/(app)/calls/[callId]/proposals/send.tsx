import { useAuth } from '@/context/AuthContext'
import ProposalFormScreen from '@/screens/ProposalFormScreen'
import { Redirect } from 'expo-router';
import React from 'react'

export default function CallSendProposalRoute() {
  const {user} = useAuth();

  if(!user || user.type !== "farmer"){
    return <Redirect href="/calls"/>
  }

  return <ProposalFormScreen/>
}