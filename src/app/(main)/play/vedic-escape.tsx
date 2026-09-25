import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const CHALLENGES = [
  {
    question: '98 × 97 = ?',
    hint: 'Think of both numbers as close to 100.',
    answers: ['9506', '9406', '9606', '9306'],
    correct: '9506',
    explanation: '98 × 97 = (100 − 2)(100 − 3) = 9506.',
  },
  {
    question: '97 × 96 = ?',
    hint: 'Think of 100 − 3 and 100 − 4.',
    answers: ['9312', '9212', '9412', '9302'],
    correct: '9312',
    explanation: '97 × 96 = (100 − 3)(100 − 4) = 9312.',
  },
  {
    question: '99 × 96 = ?',
    hint: 'Both numbers are close to 100.',
    answers: ['9504', '9404', '9604', '9506'],
    correct: '9504',
    explanation: '99 × 96 = (100 − 1)(100 − 4) = 9504.',
  },
];

export default function VedicEscapeScreen() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(0);
  const [escaped, setEscaped] = useState(false);

  const challenge = CHALLENGES[current];

  const chooseAnswer = (answer: string) => {
    if (selected || escaped) return;

    setSelected(answer);

    if (answer === challenge.correct) {
      const next = unlocked + 1;
      setUnlocked(next);

      if (next === CHALLENGES.length) {
        setEscaped(true);
      }
    }
  };

  const nextLock = () => {
    setCurrent(current + 1);
    setSelected(null);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setUnlocked(0);
    setEscaped(false);
  };

  if (escaped) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.escapeScreen}>
          <View style={styles.portal}>
            <Text style={styles.portalText}>∞</Text>
          </View>

          <Text style={styles.escapedTitle}>YOU ESCAPED</Text>

          <Text style={styles.escapedText}>
            All three mathematical locks are open.
          </Text>

          <Text style={styles.escapedSmall}>
            You discovered a faster way to work with numbers close to 100.
          </Text>

          <Pressable style={styles.mainButton} onPress={restart}>
            <Text style={styles.mainButtonText}>PLAY AGAIN</Text>
          </Pressable>

          <Pressable
            style={styles.backButtonLarge}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              RETURN TO CONSTELLATION
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerSmall}>VEDIC MATHS</Text>
          <Text style={styles.headerTitle}>MATH ESCAPE</Text>
        </View>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {unlocked + 1} / {CHALLENGES.length}
          </Text>
        </View>
      </View>

      <View style={styles.world}>
        <View style={styles.mandalaOuter}>
          <View style={styles.mandalaMiddle}>
            <View style={styles.mandalaInner}>
              <Text style={styles.lockSymbol}>✦</Text>
            </View>
          </View>
        </View>

        <Text style={styles.chamberTitle}>NUMBER CHAMBER</Text>

        <Text style={styles.chamberText}>
          Solve the lock to move deeper into the chamber.
        </Text>
      </View>

      <View style={styles.challenge}>
        <Text style={styles.lockLabel}>
          MATHEMATICAL LOCK {current + 1}
        </Text>

        <Text style={styles.question}>
          {challenge.question}
        </Text>

        <Text style={styles.hint}>
          HINT · {challenge.hint}
        </Text>

        <View style={styles.answers}>
          {challenge.answers.map((answer) => {
            const correct =
              selected !== null && answer === challenge.correct;

            const wrong =
              selected === answer && answer !== challenge.correct;

            return (
              <Pressable
                key={answer}
                onPress={() => chooseAnswer(answer)}
                style={[
                  styles.answer,
                  correct && styles.correct,
                  wrong && styles.wrong,
                ]}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>
              {selected === challenge.correct
                ? 'LOCK OPENED'
                : 'TRY AGAIN'}
            </Text>

            <Text style={styles.explanation}>
              {selected === challenge.correct
                ? challenge.explanation
                : 'Use the distance from 100 and try again.'}
            </Text>

            {selected === challenge.correct &&
              current < CHALLENGES.length - 1 && (
                <Pressable
                  style={styles.nextButton}
                  onPress={nextLock}
                >
                  <Text style={styles.nextButtonText}>
                    NEXT LOCK →
                  </Text>
                </Pressable>
              )}

            {selected !== challenge.correct && (
              <Pressable
                style={styles.nextButton}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.nextButtonText}>
                  TRY AGAIN
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080511',
  },

  header: {
    minHeight: 72,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,196,81,0.15)',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245,196,81,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    color: '#f5c451',
    fontSize: 25,
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerSmall: {
    color: 'rgba(245,196,81,0.55)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
  },

  headerTitle: {
    marginTop: 3,
    color: '#fff3cf',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },

  counter: {
    minWidth: 52,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,196,81,0.18)',
  },

  counterText: {
    color: 'rgba(255,235,190,0.65)',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },

  world: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  mandalaOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(245,196,81,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '22.5deg' }],
  },

  mandalaMiddle: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: 'rgba(170,100,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },

  mandalaInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: 'rgba(245,196,81,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-67.5deg' }],
  },

  lockSymbol: {
    color: '#f5c451',
    fontSize: 30,
  },

  chamberTitle: {
    marginTop: 18,
    color: '#fff3cf',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },

  chamberText: {
    marginTop: 7,
    color: 'rgba(230,215,235,0.55)',
    fontSize: 11,
    textAlign: 'center',
  },

  challenge: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    backgroundColor: 'rgba(17,8,28,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,196,81,0.15)',
  },

  lockLabel: {
    color: 'rgba(245,196,81,0.55)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },

  question: {
    marginTop: 8,
    color: '#fff8e8',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  hint: {
    marginTop: 7,
    color: 'rgba(220,205,230,0.5)',
    fontSize: 9,
    textAlign: 'center',
  },

  answers: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 9,
  },

  answer: {
    width: '46%',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,196,81,0.2)',
    backgroundColor: 'rgba(245,196,81,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  correct: {
    borderColor: 'rgba(105,230,189,0.65)',
    backgroundColor: 'rgba(105,230,189,0.12)',
  },

  wrong: {
    borderColor: 'rgba(231,92,145,0.65)',
    backgroundColor: 'rgba(231,92,145,0.12)',
  },

  answerText: {
    color: '#fff4dc',
    fontSize: 16,
    fontWeight: '800',
  },

  result: {
    marginTop: 13,
    padding: 13,
    borderRadius: 15,
    backgroundColor: 'rgba(245,196,81,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245,196,81,0.14)',
  },

  resultTitle: {
    color: '#f5c451',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  explanation: {
    marginTop: 5,
    color: 'rgba(245,235,220,0.7)',
    fontSize: 11,
    lineHeight: 17,
  },

  nextButton: {
    marginTop: 11,
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: '#f5c451',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonText: {
    color: '#1b1020',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  escapeScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  portal: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(245,196,81,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  portalText: {
    color: '#f5c451',
    fontSize: 58,
  },

  escapedTitle: {
    marginTop: 28,
    color: '#fff3cf',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 3,
  },

  escapedText: {
    marginTop: 10,
    color: '#f5c451',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  escapedSmall: {
    marginTop: 8,
    color: 'rgba(230,215,235,0.55)',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
  },

  mainButton: {
    marginTop: 28,
    width: '100%',
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: '#f5c451',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainButtonText: {
    color: '#1b1020',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  backButtonLarge: {
    marginTop: 10,
    width: '100%',
    minHeight: 48,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(245,196,81,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    color: 'rgba(255,240,210,0.65)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
