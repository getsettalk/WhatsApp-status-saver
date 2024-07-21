import { View, Text, StyleSheet, StatusBar, SafeAreaView, Image } from 'react-native';
import React, { useContext, useEffect } from 'react';
import ThemeContext from '../../utils/theme/ThemeContext';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import ScreenName from '../../navigations/ScreenName';

const Splash = ({ navigation }) => {
    const theme = useContext(ThemeContext); // for colors
    useEffect(() => {
        const interValID = setInterval(() => {
            navigation.replace(ScreenName.WhatsAppAllStatusScreen);
        }, 2000);

        return () => clearInterval(interValID); // Clear the interval on component unmount
    }, [navigation]);


    return (
        <SafeAreaView style={[styles.MainContainer, { backgroundColor: theme.background }]}>
            <StatusBar translucent={true} backgroundColor={theme.background} barStyle={'dark-content'} />
            <View style={styles.MainContent}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/logo/logo.png')} resizeMode='contain' style={styles.logo} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.textPrimary, { color: theme.textSecondary }]}>Download Whatsapp Status</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
    },
    MainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        bottom: heightPercentageToDP(3),
        alignItems: 'center',
    },
    textPrimary: {
        fontSize: 18,
    },
    logo: {
        borderRadius: heightPercentageToDP(1),
        width: heightPercentageToDP(16),
        height: heightPercentageToDP(16),
    },
});

export default Splash;
