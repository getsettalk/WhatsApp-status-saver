import React from 'react';
import { View, Modal, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Platform, Alert } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import { saveStatus } from '../utils/theme/FileManager';

const { width, height } = Dimensions.get('window');

const LightBox = ({ isVisible, onClose, media }) => {
    const isVideo = media && (media.path.toLowerCase().endsWith('.mp4') || media.path.toLowerCase().endsWith('.mov'));

    const handleSave = async () => {
        if (media) {
            const success = await saveStatus(media.path);
            if (success) {
                Alert.alert('WhatsApp Status', 'WhatsApp Status saved successfully!');
            } else {
                alert('Failed to save media.');
            }
        }
    };

    const handleShare = async () => {
        if (media) {
            try {
                let filePath = media.path;
                if (Platform.OS === 'android' && !filePath.startsWith('file://')) {
                    filePath = `file://${filePath}`;
                }

                const options = {
                    url: filePath,
                    title: 'Share Media',
                    subject: 'WhatsApp Status',
                    type: isVideo ? 'video/mp4' : 'image/jpeg',
                };

                const result = await Share.open(options);
                console.log('Share result:', result);
            } catch (error) {
                console.error('Error sharing:', error);
                if (error.message !== 'User did not share') {
                    alert('Failed to share: ' + error.message);
                }
            }
        }
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}

        >
            <StatusBar hidden />
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Icon name="close" size={30} color="#fff" />
                </TouchableOpacity>
                {isVideo ? (
                    <Video
                        source={{ uri: `file://${media?.path}` }}
                        style={styles.media}
                        resizeMode="contain"
                        controls={true}
                        repeat={true}
                    />
                ) : (
                    <Image
                        source={{ uri: `file://${media?.path}` }}
                        style={styles.media}
                        resizeMode="contain"
                    />
                )}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Icon name="download-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleShare}>
                        <Icon name="share-social-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    media: {
        width: width,
        height: height,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 10,
    },
});

export default LightBox;