import { Stack, useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function NikhilamLesson() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <Text style={styles.kicker}>
          VEDIC MATHS
        </Text>

        <Text style={styles.title}>
          NIKHILAM
        </Text>

        <Text style={styles.subtitle}>
          Working with numbers near a base
        </Text>

        <View style={styles.mandala}>
          <Text style={styles.mandalaText}>
            100
          </Text>

          <Text style={styles.mandalaSmall}>
            98 × 97
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            THE IDEA
          </Text>

          <Text style={styles.cardText}>
            When numbers are close to a
            base such as 100, we can use
            their differences from that
            base to calculate quickly.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push(
              '/play/vedic-escape' as any,
            )
          }
          style={({ pressed }) => [
            styles.button,
            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            ENTER MATH ESCAPE →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#080513',
    },

    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 26,
    },

    kicker: {
      color: '#f5c451',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 3,
    },

    title: {
      marginTop: 10,
      color: '#ffffff',
      fontSize: 38,
      fontWeight: '900',
    },

    subtitle: {
      marginTop: 7,
      color: '#aa98c9',
      fontSize: 15,
    },

    mandala: {
      width: 190,
      height: 190,
      marginTop: 28,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#f5c451',
      borderRadius: 95,
      backgroundColor: '#160e28',
    },

    mandalaText: {
      color: '#f5c451',
      fontSize: 38,
      fontWeight: '900',
    },

    mandalaSmall: {
      marginTop: 8,
      color: '#b99aff',
      fontSize: 15,
    },

    card: {
      marginTop: 28,
      padding: 20,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#3c2c5c',
      backgroundColor: '#100b1c',
    },

    cardTitle: {
      color: '#f5c451',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 2,
    },

    cardText: {
      marginTop: 10,
      color: '#ded5ec',
      fontSize: 15,
      lineHeight: 23,
    },

    button: {
      marginTop: 22,
      paddingVertical: 17,
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: '#7c50d9',
    },

    buttonPressed: {
      opacity: 0.7,
    },

    buttonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: 1,
    },
  });
