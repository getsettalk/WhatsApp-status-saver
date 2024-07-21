import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

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

export const findStatusFiles = async () => {
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
  const rootPath = '/storage/emulated/0';
  return await searchDirectories(rootPath);
};

const findStatusFilesLegacy = async () => {
  for (const path of WHATSAPP_FOLDERS) {
    try {
      const files = await RNFS.readDir(path);
      if (files && files.length > 0) {
        console.log('Status folder found:', path);
        return files.filter(file => file.isFile());
      }
    } catch (error) {
      console.log('Path not accessible:', path);
    }
  }
  console.error('Could not find WhatsApp status folder');
  return [];
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
    return [];
  }
};

const searchWhatsAppFolder = async (whatsappPath) => {
  try {
    const mediaPath = `${whatsappPath}/Media/.Statuses`;
    const files = await RNFS.readDir(mediaPath);
    return files.filter(file => file.isFile());
  } catch (error) {
    console.log('Error reading WhatsApp folder:', error);
    return [];
  }
};

export const saveStatus = async (filePath) => {
  try {
    // Request write permission for external storage
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write permission denied');
      alert('Permission to write to storage was denied');
      return;
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
};