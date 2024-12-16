import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// custom imports
import RootNavigation from './navigation/rootNavigation';
import { Provider as AuthProvider } from './context/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <RootNavigation />
            </SafeAreaProvider>
        </AuthProvider>
    );
}