import {
  Platform,
  Linking,
  Alert
} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
  openSettings
} from 'react-native-permissions';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) { // Android 13 and above
      return requestMediaPermissions();
    } else if (Platform.Version >= 29) { // Android 10 and above (but below 13)
      return requestStoragePermissions();
    } else { // Below Android 10
      return requestLegacyStoragePermissions();
    }
  }
  // Add iOS permissions here if needed
  return false;
};

const requestMediaPermissions = async () => {
  try {
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ]);

    if (
      results[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === RESULTS.GRANTED &&
      results[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === RESULTS.GRANTED
    ) {
      console.log('Media permissions granted');
      return true;
    } else {
      console.log('Media permissions denied');
      Alert.alert(
        'Permission Required',
        'The app needs access to your media files to function properly.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings }
        ]
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting media permissions:', error);
    return false;
  }
};

const requestStoragePermissions = async () => {
  try {
    const readPermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    let writePermission = RESULTS.GRANTED;

    if (Platform.Version < 30) {  // For Android 10 (API 29)
      writePermission = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }

    if (readPermission === RESULTS.GRANTED && writePermission === RESULTS.GRANTED) {
      console.log('Storage permissions granted');
      return true;
    } else {
      console.log('Storage permissions denied');
      Alert.alert(
        'Permission Required',
        'The app needs storage permissions to function properly.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings }
        ]
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting storage permissions:', error);
    return false;
  }
};

const requestLegacyStoragePermissions = async () => {
  try {
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);

    if (
      results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
      results[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED
    ) {
      console.log('Legacy storage permissions granted');
      return true;
    } else {
      console.log('Legacy storage permissions denied');
      Alert.alert(
        'Permission Required',
        'The app needs storage permissions to function properly.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings }
        ]
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting legacy storage permissions:', error);
    return false;
  }
};