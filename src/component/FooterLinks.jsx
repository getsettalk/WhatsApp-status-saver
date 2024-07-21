import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import ThemeContext from '../utils/theme/ThemeContext'

const FooterLinks = () => {

    const theme = useContext(ThemeContext)

    return (
        <View style={style.Footer}>
            <TouchableOpacity >
                <Text style={[style.btnName, { color: theme.textSecondary }]}>Read Policy</Text>
            </TouchableOpacity>
            <View style={{
                width: heightPercentageToDP(0.7),
                height: heightPercentageToDP(0.7),
                backgroundColor: theme.textSecondary,
                borderRadius: 100
            }} />
            <TouchableOpacity >
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