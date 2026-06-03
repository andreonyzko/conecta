import { View } from 'react-native'
import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export default function SignUpFarmer() {
  return (
    <View>
        <Label>Nome</Label>
        <Input placeholder='Nome completo'/>
        <Label>Telefone</Label>
        <Input placeholder='(00) 00000-0000'/>
        <Label>CPF/CNPJ</Label>
        <Input placeholder='000.000.000-00'/>
        <Label>CAF</Label>
        <Input placeholder='CAF-TO-2026-000000'/>
        <Label>E-mail</Label>
        <Input placeholder='seu@email.com'/>
        <Label>Senha</Label>
        <Input placeholder='Senha' secureTextEntry/>
    </View>
  )
}