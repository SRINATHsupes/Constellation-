import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AntyayordashakepiScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Antyayordashakepi' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.symbol}>••</Text>
        <Text style={styles.title}>Antyayordashakepi</Text>
        <Text style={styles.subtitle}>The last two and last one</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>The idea</Text>
          <Text style={styles.body}>
            This principle is used for certain multiplication patterns,
            especially when numbers have a convenient relationship with a base.
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={styles.heading}>Look for the relationship</Text>
          <Text style={styles.body}>
            Instead of immediately calculating everything, first inspect the
            final digits and the relationship between the numbers.
          </Text>
          <Text style={styles.pattern}>Pattern → Relationship → Calculation</Text>
        </View>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Return to constellation</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020713' },
  content: { alignItems: 'center', padding: 24, paddingBottom: 48 },
  symbol: { color: '#FF72C8', fontSize: 42, fontWeight: '900', marginBottom: 18 },
  title: { color: '#FFF', fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#AEBBD0', fontSize: 16, marginVertical: 10, textAlign: 'center' },
  card: {
    backgroundColor: '#0B1428',
    borderColor: '#1D3155',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    maxWidth: 650,
    padding: 20,
    width: '100%',
  },
  example: {
    backgroundColor: '#27152A',
    borderColor: '#FF72C8',
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 16,
    maxWidth: 650,
    padding: 22,
    width: '100%',
  },
  heading: { color: '#FF72C8', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: '#D8E1EF', fontSize: 16, lineHeight: 25 },
  pattern: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 18 },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    maxWidth: 650,
    padding: 15,
    width: '100%',
  },
  buttonText: { color: '#020713', fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
