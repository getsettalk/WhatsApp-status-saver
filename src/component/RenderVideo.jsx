import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const RenderVideo = ({ data }) => {
  return (
    <View style={styles.item}>
      <Video
        source={{ uri: `file://${data.path}` }}
        style={styles.video}
        resizeMode="cover"
        muted={true}
        repeat={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 5,
  },
  video: {
    width: '100%',
    height: heightPercentageToDP(35),
  },
});

export default RenderVideo;