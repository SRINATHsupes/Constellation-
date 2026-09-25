import { Stack } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SpaceWorld() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <Text style={styles.kicker}>
          DEEP SPACE
        </Text>

        <Text style={styles.title}>
          SPACE EXPLORER
        </Text>

        <Text style={styles.description}>
          Discover how astronauts live,
          move, communicate and work
          beyond Earth.
        </Text>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>
            FIRST DISCOVERY
          </Text>

          <Text style={styles.panelText}>
            Explore the spacecraft,
            understand its systems and
            prepare for a mission.
          </Text>
        </View>

        <View style={styles.status}>
          <Text style={styles.statusText}>
            ◉ LIFE SUPPORT ONLINE
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
      backgroundColor: '#030611',
    },

    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 28,
    },

    kicker: {
      color: '#a98cff',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 3,
    },

    title: {
      marginTop: 10,
      color: '#ffffff',
      fontSize: 32,
      fontWeight: '900',
    },

    description: {
      marginTop: 16,
      color: '#a9b6d0',
      fontSize: 16,
      lineHeight: 25,
    },

    panel: {
      marginTop: 35,
      padding: 22,
      borderWidth: 1,
      borderColor: '#352b60',
      borderRadius: 18,
      backgroundColor: '#0b0b1c',
    },

    panelTitle: {
      color: '#b59aff',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 2,
    },

    panelText: {
      marginTop: 10,
      color: '#dce2f3',
      fontSize: 15,
      lineHeight: 23,
    },

    status: {
      marginTop: 18,
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#211b3b',
    },

    statusText: {
      color: '#c4b2ff',
      fontSize: 12,
      fontWeight: '700',
    },
  });
