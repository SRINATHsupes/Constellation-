import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MentalCalculationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Mental Calculation' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.symbol}>123</Text>
        <Text style={styles.title}>Mental Calculation</Text>
        <Text style={styles.subtitle}>See the structure, not just the numbers</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>The idea</Text>
          <Text style={styles.body}>
            Mental calculation becomes easier when a problem is broken into
            familiar patterns instead of being treated as a long sequence of
            operations.
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={styles.heading}>Example</Text>
          <Text style={styles.equation}>48 + 27</Text>
          <Text style={styles.equation}>= 50 + 25</Text>
          <Text style={styles.answer}>= 75</Text>
          <Text style={styles.body}>
            We adjusted the numbers into an easier pair while keeping the
            total unchanged.
          </Text>
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
  symbol: { color: '#58A6FF', fontSize: 40, fontWeight: '900', marginBottom: 18 },
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
    backgroundColor: '#101C32',
    borderColor: '#58A6FF',
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 16,
    maxWidth: 650,
    padding: 22,
    width: '100%',
  },
  heading: { color: '#58A6FF', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: '#D8E1EF', fontSize: 16, lineHeight: 25, marginTop: 14 },
  equation: { color: '#FFF', fontSize: 28, fontWeight: '800', marginVertical: 5 },
  answer: { color: '#7FFFD4', fontSize: 30, fontWeight: '900', marginTop: 8 },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    maxWidth: 650,
    padding: 15,
    width: '100%',
  },
  buttonText: { color: '#020713', fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
