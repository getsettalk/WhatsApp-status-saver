import RNFS from 'react-native-fs';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import * as ScopedStorage from "react-native-scoped-storage"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPermissions } from './Permission';


const STORAGE_KEY = 'WHATSAPP_STATUS_URI';




const WHATSAPP_FOLDERS = [
  '/storage/emulated/0/WhatsApp/Media/.Statuses',
  '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
  '/sdcard/WhatsApp/Media/.Statuses',
  '/storage/emulated/0/WhatsApp Business/Media/.Statuses',
  '/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses',
];

const isMediaFile = (fileName) => {
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov'];
  return mediaExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

const checkFolderPermissions = async (path) => {
  try {
    const exists = await RNFS.exists(path);
    console.log(`Folder ${path} exists: ${exists}`);
    if (exists) {
      const canRead = await RNFS.readDir(path).then(() => true).catch(() => false);
      console.log(`Can read folder ${path}: ${canRead}`);
    }
  } catch (error) {
    console.log(`Error checking folder ${path}:`, error.message);
  }
};

const checkPermissions = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
  );
  console.log('Read external storage permission:', granted);

  for (const path of WHATSAPP_FOLDERS) {
    await checkFolderPermissions(path);
  }
};

export const findStatusFiles = async () => {
  await checkPermissions();

  let statusFiles = [];

  if (Platform.Version >= 30) {
    statusFiles = await findStatusFilesAndroid11Plus();
  } else {
    statusFiles = await findStatusFilesLegacy();
  }

  return statusFiles.filter(file => isMediaFile(file.name))
    .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
};

const findStatusFilesAndroid11Plus = async () => {
  let statusFiles = [];
  const WA_MEDIA_FOLDER = '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media';

  let storedUri = await AsyncStorage.getItem(STORAGE_KEY);

  if (!storedUri) {
    const directory = await ScopedStorage.openDocumentTree(true, WA_MEDIA_FOLDER);
    if (directory) {
      storedUri = directory.uri;
      await AsyncStorage.setItem(STORAGE_KEY, storedUri);
    } else {
      console.log('User did not select a directory');
      return statusFiles;
    }
  }

  try {
    // First, list the contents of the WhatsApp Media folder
    const mediaFiles = await ScopedStorage.listFiles(storedUri);
    console.log("Media folder contents:", mediaFiles);

    // Find the .Statuses folder
    const statusFolder = mediaFiles.find(file => file.name === '.Statuses');

    if (statusFolder) {
      // Now list the contents of the .Statuses folder
      const statusFiles = await ScopedStorage.listFiles(statusFolder.uri);
      console.log("Status files:", statusFiles);

      const mediaFiles = statusFiles.filter(file => isMediaFile(file.name)).map(file => ({
        name: file.name,
        path: file.uri,
        mtime: file.lastModified,
        size: file.size,
      }));

      console.log(`Android 11+: Media files found in .Statuses: ${mediaFiles.length}`);
      return mediaFiles;
    } else {
      console.log('.Statuses folder not found');
      return [];
    }
  } catch (error) {
    console.log('Error accessing Android 11+ path:', error.message);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  return statusFiles;
};
const findStatusFilesLegacy = async () => {
  let allFiles = [];
  for (const path of WHATSAPP_FOLDERS) {
    try {
      const files = await RNFS.readDir(path);
      if (files && files.length > 0) {
        console.log(`Legacy status folder found: ${path}. File count: ${files.length}`);
        const mediaFiles = files
          .filter(file => file.isFile() && isMediaFile(file.name))
          .map(file => ({
            name: file.name,
            uri: `file://${file.path}`,
            path: file.path,
            mtime: file.mtime,
            size: file.size,
            mime: getMimeType(file.name),
            isFile: file.isFile,
            isDirectory: file.isDirectory
          }));
        console.log(`Media files found: ${mediaFiles.length}`);
        allFiles = [...allFiles, ...mediaFiles];
      }
    } catch (error) {
      console.log('Path not accessible:', path, error.message);
    }
  }
  if (allFiles.length === 0) {
    console.error('Could not find any WhatsApp status files');
  }
  return allFiles;
};

const getMimeType = (fileName) => {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'mp4':
    case 'mov':
      return 'video/mp4';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
};
const searchDirectories = async (path) => {
  try {
    const contents = await RNFS.readDir(path);
    let statusFiles = [];

    for (const item of contents) {
      if (item.isDirectory()) {
        if (item.name.toLowerCase().includes('whatsapp')) {
          const files = await searchWhatsAppFolder(item.path);
          statusFiles = [...statusFiles, ...files];
        } else {
          const files = await searchDirectories(item.path);
          statusFiles = [...statusFiles, ...files];
        }
      }
    }

    return statusFiles;
  } catch (error) {
    console.log('Error reading directory:', path, error);
    Alert.alert("error", `Path: ${path}, error: ${error}`);
    return [];
  }
};

const searchWhatsAppFolder = async (whatsappPath) => {
  try {
    const mediaPath = `${whatsappPath}/Media/.Statuses`;
    const files = await RNFS.readDir(mediaPath);
    console.log("Search:", mediaPath, files);
    return files.filter(file => file.isFile() && isMediaFile(file.name));
  } catch (error) {
    console.log('Error reading WhatsApp folder:', error);
    return [];
  }
};

/* export const saveStatus = async (filePath) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write permission denied');
      alert('Permission to write to storage was denied');
      return false;
    }

    const fileName = filePath.split('/').pop();
    const destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    await RNFS.copyFile(filePath, destPath);
    await CameraRoll.save(destPath, { type: 'auto' });
    console.log('Status saved successfully to:', destPath);
    return true;
  } catch (error) {
    console.error('Error saving status:', error);
    return false;
  }
}; */

export const saveStatus = async (filePath) => {
  try {
    // Request permissions using your existing function
    const permissionsGranted = await requestPermissions();

    if (!permissionsGranted) {
      console.log('Necessary permissions were not granted');
      return false;
    }

    let fileUri = filePath;

    // Handle scoped storage for Android 11+
    if (Platform.OS === 'android' && Platform.Version >= 30) {
      // Convert the content URI to a file path
      const fileInfo = await ScopedStorage.getDocumentContent(filePath);
      if (fileInfo && fileInfo.filePath) {
        fileUri = `file://${fileInfo.filePath}`;
      } else {
        throw new Error('Unable to get file path from scoped storage');
      }
    }

    // Save the file
    await CameraRoll.save(fileUri, { type: 'auto' });

    console.log('Status saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving status:', error);
    return false;
  }
};