import { Stack } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function RocketWorld() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <Text style={styles.kicker}>
          SPACE WORLD
        </Text>

        <Text style={styles.title}>
          ROCKET WORKSHOP
        </Text>

        <Text style={styles.description}>
          Explore a spacecraft and learn
          how its systems work.
        </Text>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>
            MISSION
          </Text>

          <Text style={styles.panelText}>
            Find the systems that need
            attention and learn what each
            system does.
          </Text>
        </View>

        <View style={styles.status}>
          <Text style={styles.statusText}>
            🚀 SPACECRAFT READY
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#050b18',
    },

    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 28,
    },

    kicker: {
      color: '#55d9ff',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 3,
    },

    title: {
      marginTop: 10,
      color: '#ffffff',
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: 1,
    },

    description: {
      marginTop: 16,
      color: '#9db3d1',
      fontSize: 16,
      lineHeight: 25,
    },

    panel: {
      marginTop: 35,
      padding: 22,
      borderWidth: 1,
      borderColor: '#214064',
      borderRadius: 18,
      backgroundColor: '#0a1426',
    },

    panelTitle: {
      color: '#55d9ff',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 2,
    },

    panelText: {
      marginTop: 10,
      color: '#d7e5f8',
      fontSize: 15,
      lineHeight: 23,
    },

    status: {
      marginTop: 18,
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#102b45',
    },

    statusText: {
      color: '#79e2ff',
      fontSize: 12,
      fontWeight: '700',
    },
  });
