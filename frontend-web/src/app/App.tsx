import React from 'react';
import { AppContextProvider } from './context/AppContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <AppContextProvider>
      <AppNavigator />
    </AppContextProvider>
  );
}
