import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const TOPICS = [
  {
    icon: '⚡',
    title: 'Rocket Electronics',
    text: 'Learn about circuits, sensors, batteries, controllers and communication systems.',
  },
  {
    icon: '🧪',
    title: 'Rocket Chemistry',
    text: 'Explore combustion, fuels, oxidizers and the chemistry behind propulsion.',
  },
  {
    icon: '🔥',
    title: 'Pyrochemistry',
    text: 'Understand how controlled chemical reactions create heat, gas and useful energy.',
  },
  {
    icon: '🔧',
    title: 'Repair the Rocket',
    text: 'Find the damaged system and use what you learned to repair the spacecraft.',
  },
];

export default function RocketScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Rocket Workshop',
          headerShown: true,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.rocket}>🚀</Text>

        <Text style={styles.title}>ROCKET WORKSHOP</Text>

        <Text style={styles.subtitle}>
          Learn how a spacecraft works — then repair it.
        </Text>

        {TOPICS.map(topic => (
          <Pressable
            key={topic.title}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.icon}>{topic.icon}</Text>

            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <Text style={styles.cardDescription}>{topic.text}</Text>
            </View>

            <Text style={styles.arrow}>→</Text>
          </Pressable>
        ))}

        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Return to universe</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020713',
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  rocket: {
    fontSize: 72,
    textAlign: 'center',
    marginTop: 20,
  },

  title: {
    marginTop: 12,
    color: '#eef5ff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 28,
    color: 'rgba(205,225,255,0.65)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },

  card: {
    minHeight: 105,
    marginBottom: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(200,220,250,0.14)',
    backgroundColor: 'rgba(12,22,39,0.82)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
  },

  icon: {
    fontSize: 32,
    width: 48,
  },

  cardText: {
    flex: 1,
    paddingHorizontal: 8,
  },

  cardTitle: {
    color: '#edf4ff',
    fontSize: 16,
    fontWeight: '700',
  },

  cardDescription: {
    marginTop: 6,
    color: 'rgba(190,215,250,0.55)',
    fontSize: 12,
    lineHeight: 18,
  },

  arrow: {
    color: '#dce9ff',
    fontSize: 25,
    fontWeight: '300',
  },

  back: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
  },

  backText: {
    color: '#8fdfff',
    fontSize: 14,
    fontWeight: '600',
  },
});
