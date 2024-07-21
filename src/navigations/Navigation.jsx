import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScreenName from './ScreenName'
import Splash from '../screens/MainStack/Splash'
import WhatsAppAllStatus from '../screens/MainStack/WhatsAppAllStatus'
import ThemeContext from '../utils/theme/ThemeContext'
import theme from '../utils/theme/theme'

const Navigation = () => {
    const Stack = createNativeStackNavigator()
    const isDarkMode = useColorScheme();

    return (
        <ThemeContext.Provider value={isDarkMode == 'light' ? theme.light : theme.dark}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name={ScreenName.SplashScreen} component={Splash} />
                    <Stack.Screen name={ScreenName.WhatsAppAllStatusScreen} component={WhatsAppAllStatus} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeContext.Provider>
    )
}

export default Navigation