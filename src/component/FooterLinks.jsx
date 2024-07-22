import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useContext } from 'react'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import ThemeContext from '../utils/theme/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import ScreenName from '../navigations/ScreenName'

const FooterLinks = () => {
    const navigation = useNavigation();

    const theme = useContext(ThemeContext)

    return (
        <View style={style.Footer}>
            <TouchableOpacity onPress={()=> navigation.navigate(ScreenName.PrivacyScreen)}>
                <Text style={[style.btnName, { color: theme.textSecondary }]}>Read Policy</Text>
            </TouchableOpacity>
            <View style={{
                width: heightPercentageToDP(0.7),
                height: heightPercentageToDP(0.7),
                backgroundColor: theme.textSecondary,
                borderRadius: 100
            }} />
            <TouchableOpacity onPress={()=> Alert.alert("Contact Us", "Contact us via our email rajrock7254@gmail.com")}>
                <Text style={[style.btnName, { color: theme.textSecondary }]}>Contact us</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    Footer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: heightPercentageToDP(1)
    },
    btnName: {
        fontSize: heightPercentageToDP(1.89)
    }
})

export default FooterLinks