import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  levelNumber: number;
  onComplete: () => void;
};

type Lock = {
  question: string;
  answer: string;
  base: string;
  explanation: string;
};

const LOCKS: Lock[] = [
  {
    question: '98 × 97',
    answer: '9506',
    base: '100',
    explanation:
      '98 is 2 below 100 and 97 is 3 below 100. Cross-subtract: 98 − 3 = 95. Multiply the deficiencies: 2 × 3 = 06. So the answer is 9506.',
  },
  {
    question: '97 × 96',
    answer: '9312',
    base: '100',
    explanation:
      '97 is 3 below 100 and 96 is 4 below 100. Cross-subtract: 97 − 4 = 93. Multiply the deficiencies: 3 × 4 = 12. So the answer is 9312.',
  },
  {
    question: '99 × 96',
    answer: '9504',
    base: '100',
    explanation:
      '99 is 1 below 100 and 96 is 4 below 100. Cross-subtract: 99 − 4 = 95. Multiply the deficiencies: 1 × 4 = 04. So the answer is 9504.',
  },
];

export default function VedicEscape({
  levelNumber,
  onComplete,
}: Props) {
  const [lockIndex, setLockIndex] = useState(0);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);
  const [escaped, setEscaped] = useState(false);

  const lock = LOCKS[lockIndex];

  const progress = useMemo(
    () => `${lockIndex + 1} / ${LOCKS.length}`,
    [lockIndex],
  );

  function pressDigit(value: string) {
    if (input.length >= 6) return;

    setWrong(false);
    setInput((current) => current + value);
  }

  function clearInput() {
    setWrong(false);
    setInput((current) => current.slice(0, -1));
  }

  function checkAnswer() {
    if (input === lock.answer) {
      if (lockIndex === LOCKS.length - 1) {
        setEscaped(true);
      } else {
        setLockIndex((current) => current + 1);
        setInput('');
        setWrong(false);
      }
    } else {
      setWrong(true);
    }
  }

  if (escaped) {
    return (
      <View style={styles.success}>
        <Text style={styles.star}>✦</Text>

        <Text style={styles.escaped}>
          CHAMBER OPEN
        </Text>

        <Text style={styles.successTitle}>
          Nikhilam mastered
        </Text>

        <Text style={styles.successText}>
          You used the base and the deficiencies to unlock every
          calculation.
        </Text>

        <Pressable
          onPress={onComplete}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            CONTINUE →
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>
            ANCIENT MATHEMATICS CHAMBER
          </Text>

          <Text style={styles.level}>
            LEVEL {levelNumber}
          </Text>
        </View>

        <View style={styles.progress}>
          <Text style={styles.progressText}>
            LOCK {progress}
          </Text>
        </View>
      </View>

      <View style={styles.lockArea}>
        <View style={styles.lockCircle}>
          <Text style={styles.lockIcon}>⌾</Text>

          <Text style={styles.lockText}>
            LOCK {lockIndex + 1}
          </Text>
        </View>

        <Text style={styles.instruction}>
          Open the mathematical lock using the base.
        </Text>

        <View style={styles.questionBox}>
          <Text style={styles.question}>
            {lock.question}
          </Text>

          <Text style={styles.baseText}>
            Base: {lock.base}
          </Text>
        </View>

        <View style={styles.answerBox}>
          <Text
            style={[
              styles.answer,
              !input && styles.answerPlaceholder,
            ]}
          >
            {input || 'ENTER ANSWER'}
          </Text>
        </View>

        {wrong && (
          <Text style={styles.error}>
            Not quite. Look at the deficiencies from 100.
          </Text>
        )}

        <View style={styles.keypad}>
          {[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0',
          ].map((digit) => (
            <Pressable
              key={digit}
              onPress={() => pressDigit(digit)}
              style={styles.key}
            >
              <Text style={styles.keyText}>
                {digit}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={clearInput}
            style={styles.clearKey}
          >
            <Text style={styles.clearText}>
              ⌫
            </Text>
          </Pressable>

          <Pressable
            onPress={checkAnswer}
            style={styles.enterKey}
          >
            <Text style={styles.enterText}>
              UNLOCK
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.explanationBox}>
        <Text style={styles.explanationLabel}>
          REMEMBER
        </Text>

        <Text style={styles.explanation}>
          {lock.explanation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  label: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  level: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
  },

  progress: {
    borderWidth: 1,
    borderColor: 'rgba(191,162,255,0.45)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  progressText: {
    color: '#BFA2FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  lockArea: {
    alignItems: 'center',
  },

  lockCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1.5,
    borderColor: '#BFA2FF',
    backgroundColor: 'rgba(191,162,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  lockIcon: {
    color: '#BFA2FF',
    fontSize: 28,
  },

  lockText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },

  instruction: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 13,
  },

  questionBox: {
    width: '100%',
    marginTop: 18,
    paddingVertical: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
  },

  question: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1,
  },

  baseText: {
    color: '#BFA2FF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 5,
  },

  answerBox: {
    width: '100%',
    height: 54,
    marginTop: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(191,162,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  answer: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 2,
  },

  answerPlaceholder: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    letterSpacing: 1,
  },

  error: {
    color: '#FFB4B4',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },

  keypad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 15,
  },

  key: {
    width: '29%',
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.055)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  keyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  clearKey: {
    width: '44%',
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  clearText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  enterKey: {
    width: '44%',
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BFA2FF',
  },

  enterText: {
    color: '#120A20',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  explanationBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(191,162,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(191,162,255,0.15)',
  },

  explanationLabel: {
    color: '#BFA2FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  explanation: {
    color: 'rgba(255,255,255,0.60)',
    fontSize: 11,
    lineHeight: 17,
  },

  success: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  star: {
    color: '#BFA2FF',
    fontSize: 58,
    marginBottom: 10,
  },

  escaped: {
    color: '#BFA2FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },

  successTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 7,
  },

  successText: {
    color: 'rgba(255,255,255,0.60)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },

  primaryButton: {
    minHeight: 50,
    paddingHorizontal: 30,
    borderRadius: 15,
    backgroundColor: '#BFA2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#120A20',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
