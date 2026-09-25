import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ConstellationUniverse3D } from '@/features/constellation/constellation-universe-3d';

export default function WorldScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />

      <ConstellationUniverse3D />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020713',
  },
});