import { PermissionsAndroid, Platform, Linking } from 'react-native';

export const requestPermissions = async () => {
  if (Platform.Version >= 33) { // Android 13 and above
    return requestMediaPermissions();
  } else if (Platform.Version >= 30) { // Android 11 and 12
    return requestManageExternalStoragePermission();
  } else { // Android 10 and below
    return requestStoragePermissions();
  }
};

const requestMediaPermissions = async () => {
  try {
    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);

    if (
      permissions['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED &&
      permissions['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Media permissions granted');
      return true;
    } else {
      console.log('Media permissions denied');
      alert('The app needs access to your media files to function properly.');
      return false;
    }
  } catch (error) {
    console.error('Error requesting media permissions:', error);
    return false;
  }
};

const requestManageExternalStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE);
    if (!granted) {
      console.log("MANAGE_EXTERNAL_STORAGE permission not granted, requesting...");
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE);
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("MANAGE_EXTERNAL_STORAGE permission denied, opening settings...");
        alert(
          'This app needs access to manage all files on your device. ' +
          'Please grant this permission in the app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    }
    console.log('MANAGE_EXTERNAL_STORAGE permission granted');
    return true;
  } catch (error) {
    console.error('Error checking or requesting MANAGE_EXTERNAL_STORAGE permission:', error);
    return false;
  }
};

const requestStoragePermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    if (
      granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Storage permissions granted');
      return true;
    } else {
      console.log('Storage permissions denied');
      alert('The app needs storage permissions to function properly.');
      return false;
    }
  } catch (error) {
    console.error('Error requesting storage permissions:', error);
    return false;
  }
};