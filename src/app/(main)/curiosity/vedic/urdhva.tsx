import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function UrdhvaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Urdhva Tiryagbhyam' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.symbol}>↗ × ↘</Text>
        <Text style={styles.title}>Urdhva Tiryagbhyam</Text>
        <Text style={styles.subtitle}>Vertically and crosswise</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>The idea</Text>
          <Text style={styles.body}>
            Urdhva Tiryagbhyam is a multiplication method based on vertical
            and crosswise operations.
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={styles.heading}>Think in directions</Text>
          <Text style={styles.diagram}>↕     ↘</Text>
          <Text style={styles.diagram}>  ×</Text>
          <Text style={styles.diagram}>↙     ↕</Text>
          <Text style={styles.body}>
            Instead of treating multiplication as one long process, break it
            into smaller vertical and crosswise calculations.
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
  symbol: { color: '#C084FC', fontSize: 36, fontWeight: '900', marginBottom: 18 },
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
    backgroundColor: '#17132A',
    borderColor: '#C084FC',
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 16,
    maxWidth: 650,
    padding: 22,
    width: '100%',
  },
  heading: { color: '#C084FC', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: '#D8E1EF', fontSize: 16, lineHeight: 25 },
  diagram: { color: '#FFF', fontSize: 30, textAlign: 'center', marginVertical: 3 },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    maxWidth: 650,
    padding: 15,
    width: '100%',
  },
  buttonText: { color: '#020713', fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
