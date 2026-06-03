import { View } from 'react-native'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SignUpFarmer from './SignUpFarmer';
import SignUpInstitution from './SignUpInstitution';
import { Text } from '../ui/text';

export default function SignUp() {
    const [userType, setUserType] = useState("farmer");

  return (
    <View>
        <Tabs value={userType} onValueChange={setUserType}>
            <TabsList>
                <TabsTrigger value='farmer'>
                    <Text>Agricultor</Text>
                </TabsTrigger>
                <TabsTrigger value='institution'>
                    <Text>Instituição</Text>
                </TabsTrigger>
            </TabsList>
            <TabsContent value='farmer'>
                <SignUpFarmer/>
            </TabsContent>
            <TabsContent value='institution'>
                <SignUpInstitution/>
            </TabsContent>
        </Tabs>
    </View>
  )
}