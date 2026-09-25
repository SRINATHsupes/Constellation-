import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { RoomConfig } from './room-config';

type Props = {
  room: RoomConfig;
  children: React.ReactNode;
};

export function RoomBackground({ room, children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.45)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },

  content: {
    flex: 1,
  },
});
