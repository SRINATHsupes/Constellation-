import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EkadhikenaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Ekadhikena' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.symbol}>+1</Text>
        <Text style={styles.title}>Ekadhikena</Text>
        <Text style={styles.subtitle}>By one more than the previous one</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>The idea</Text>
          <Text style={styles.body}>
            This principle uses the idea of taking one more than a number or
            its relevant part. It is useful in several Vedic Maths patterns.
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={styles.heading}>Pattern</Text>
          <Text style={styles.pattern}>1 × 1 = 1</Text>
          <Text style={styles.pattern}>11 × 11 = 121</Text>
          <Text style={styles.pattern}>111 × 111 = 12321</Text>
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
  symbol: {
    color: '#55E6FF',
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 18,
  },
  title: { color: '#FFF', fontSize: 32, fontWeight: '800' },
  subtitle: {
    color: '#AEBBD0',
    fontSize: 16,
    marginBottom: 28,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#0B1428',
    borderColor: '#1D3155',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    maxWidth: 650,
    padding: 20,
    width: '100%',
  },
  example: {
    backgroundColor: '#101A36',
    borderColor: '#55E6FF',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    maxWidth: 650,
    padding: 22,
    width: '100%',
  },
  heading: { color: '#55E6FF', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: '#D8E1EF', fontSize: 16, lineHeight: 25 },
  pattern: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 7,
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    maxWidth: 650,
    padding: 15,
    width: '100%',
  },
  buttonText: {
    color: '#020713',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
