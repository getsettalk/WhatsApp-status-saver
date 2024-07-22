import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native'
import React, { useContext } from 'react'
import ThemeContext from '../utils/theme/ThemeContext'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/FontAwesome';


const Header = ({ name = "WhatsSaver" }) => {
    const theme = useContext(ThemeContext)
    const isDarkMode = useColorScheme() == "dark";

    // console.log(isDarkMode)
    return (
        <View style={{
            paddingVertical: heightPercentageToDP(1), backgroundColor: theme.secondary,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: widthPercentageToDP(1.2),
            paddingHorizontal: widthPercentageToDP(1)
        }}>
          
            <Image source={require('../assets/logo/logo.png')} resizeMode='contain' style={style.logo} />
            <Text style={{ fontSize: heightPercentageToDP(2.5), color: theme.textPrimary, fontWeight: '500' }}>{name}</Text>
        </View>
    )
}
const style = StyleSheet.create({
    logo: {
        width: heightPercentageToDP(5),
        height: heightPercentageToDP(5),
        borderRadius: 100
    }
})

export default Header