import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const RenderImage = ({ data }) => {

  return (
    <View style={styles.item}>
      <Image source={{ uri: `file://${data.path}` }} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    height: heightPercentageToDP(35),
  },
});

export default RenderImage;