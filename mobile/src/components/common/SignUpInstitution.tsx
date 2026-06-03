import { View } from 'react-native'
import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export default function SignUpInstitution() {
  return (
    <View>
        <Label>Nome</Label>
        <Input placeholder='Nome da instituição'/>
        <Label>Telefone</Label>
        <Input placeholder='(00) 00000-0000'/>
        <Label>CNPJ</Label>
        <Input placeholder='00.000.000/0000-00'/>
        <Label>Número de alunos</Label>
        <Input placeholder='850'/>
        <Label>E-mail</Label>
        <Input placeholder='seu@email.com'/>
        <Label>Senha</Label>
        <Input placeholder='Senha' secureTextEntry/>
    </View>
  )
}