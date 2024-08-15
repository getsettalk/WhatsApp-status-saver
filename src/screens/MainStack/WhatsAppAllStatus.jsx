import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, useColorScheme, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, Text } from 'react-native';
import ThemeContext from '../../utils/theme/ThemeContext';
import Header from '../../component/Header';
import FooterLinks from '../../component/FooterLinks';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { requestPermissions } from '../../utils/theme/Permission';
import { findStatusFiles, saveStatus } from '../../utils/theme/FileManager';
import Video from 'react-native-video';
import LightBox from '../../component/LightBox';
import AntDesign from "react-native-vector-icons/AntDesign"


const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 15;

const WhatsAppAllStatus = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const isDarkMode = useColorScheme() === 'dark';
    const [statusData, setStatusData] = useState([]);
    const [Loading, setLoading] = useState(false); // show loader
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isLightBoxVisible, setIsLightBoxVisible] = useState(false);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        const permissionGranted = await requestPermissions();
        if (permissionGranted) {
            setLoading(true)
            const statusFiles = await findStatusFiles();
            setStatusData(statusFiles);
            setLoading(false)
        }
    };



    const onRefresh = useCallback(() => {
        setRefreshing(true);
        initializeApp().then(() => setRefreshing(false));
    }, []);

    const openLightBox = (item) => {
        setSelectedMedia(item);
        setIsLightBoxVisible(true);
    };

    const closeLightBox = () => {
        setIsLightBoxVisible(false);
        setSelectedMedia(null);
    };

    const renderItem = ({ item, index }) => {
        const isVideo = item?.mime?.startsWith('video/');
        const itemHeight = COLUMN_WIDTH * (1 + Math.random() * 0.5);
        console.log("OPOPOP", item)
        return (
            <TouchableOpacity
                style={[styles.item, { height: itemHeight, backgroundColor: theme.textPrimary }]}
                onPress={() => openLightBox(item)}
            >
                {isVideo ? (
                    <View style={styles.videoContainer}>
                        <Video
                            source={{ uri: item?.uri || item?.path  }}
                            style={styles.media}
                            resizeMode="cover"
                            paused={true}
                        />
                        <View style={styles.videoIndicator} >
                            <AntDesign name="playcircleo" size={heightPercentageToDP(4)} color={theme.secondary} />
                        </View>
                    </View>
                ) : (
                    <Image
                        source={{ uri: item?.uri || item?.path  }}
                        style={styles.media}
                        resizeMode="cover"
                    />
                )}
            </TouchableOpacity>
        );
    };
    const EmptyStateMessage = () => {
        return (
            <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No WhatsApp status found</Text>
            </View>
        )
    };

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
            <StatusBar translucent={false} backgroundColor={theme.secondary} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={styles.mainContent}>
                <Header name='WhatsApp Status' />
                <View style={styles.listContainer}>
                    {Loading && <ActivityIndicator color={theme.secondary} />}
                    {!Loading && statusData.length === 0 ? (
                        <EmptyStateMessage />
                    ) : (
                        <FlatList
                            data={statusData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            contentContainerStyle={styles.flatListContent}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    )}
                </View>
                <FooterLinks />
            </View>
            <LightBox
                isVisible={isLightBoxVisible}
                onClose={closeLightBox}
                media={selectedMedia}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
        height: heightPercentageToDP(90),
    },
    flatListContent: {
        paddingHorizontal: 5,
        paddingBottom: heightPercentageToDP(10),
    },
    item: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    media: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    videoContainer: {
        flex: 1,
    },
    videoIndicator: {
        position: 'absolute',
        top: '40%',
        left: '43%'
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
    },
});

export default memo(WhatsAppAllStatus);