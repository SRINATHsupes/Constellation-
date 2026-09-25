import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function YavadunamScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Yavadunam' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.symbol}>−Δ</Text>
        <Text style={styles.title}>Yavadunam</Text>
        <Text style={styles.subtitle}>Whatever the deficiency</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>The idea</Text>
          <Text style={styles.body}>
            Yavadunam works with how far a number is below a convenient base.
            This makes numbers close to 10, 100, or another base easier to
            manipulate.
          </Text>
        </View>

        <View style={styles.example}>
          <Text style={styles.heading}>Example idea</Text>
          <Text style={styles.number}>98 → 100 − 2</Text>
          <Text style={styles.number}>97 → 100 − 3</Text>
          <Text style={styles.body}>
            The small differences from the base become part of the calculation.
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
  symbol: { color: '#65E572', fontSize: 44, fontWeight: '900', marginBottom: 18 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#AEBBD0', fontSize: 16, marginVertical: 10 },
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
    backgroundColor: '#0C201D',
    borderColor: '#65E572',
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 16,
    maxWidth: 650,
    padding: 22,
    width: '100%',
  },
  heading: { color: '#65E572', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { color: '#D8E1EF', fontSize: 16, lineHeight: 25 },
  number: { color: '#FFF', fontSize: 23, fontWeight: '700', marginVertical: 7 },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    maxWidth: 650,
    padding: 15,
    width: '100%',
  },
  buttonText: { color: '#020713', fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
