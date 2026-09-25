import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const BITS = [128, 64, 32, 16, 8, 4, 2, 1];

const TARGETS = [
  {
    letter: 'A',
    value: 65,
    binary: '01000001',
  },
  {
    letter: 'B',
    value: 66,
    binary: '01000010',
  },
  {
    letter: 'C',
    value: 67,
    binary: '01000011',
  },
];

export default function BinaryCodeGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [bits, setBits] = useState<boolean[]>(
    Array(8).fill(false),
  );
  const [touches, setTouches] = useState(0);

  const target = TARGETS[targetIndex];

  const signal = useMemo(() => new Animated.Value(0), []);
  const decodePulse = useMemo(
    () => new Animated.Value(0.7),
    [],
  );

  const value = bits.reduce(
    (total, active, index) =>
      total + (active ? BITS[index] : 0),
    0,
  );

  const binary = bits
    .map((bit) => (bit ? '1' : '0'))
    .join('');

  const matchesTarget =
    binary === target.binary;

  const decoded = matchesTarget;

  useEffect(() => {
    Animated.loop(
      Animated.timing(signal, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      signal.stopAnimation();
    };
  }, [signal]);

  useEffect(() => {
    if (!matchesTarget) {
      return;
    }


    Animated.sequence([
      Animated.timing(decodePulse, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(decodePulse, {
        toValue: 0.7,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [matchesTarget, decodePulse]);

  function toggleBit(index: number) {
    setTouches((current) => current + 1);

    setBits((current) =>
      current.map((bit, bitIndex) =>
        bitIndex === index ? !bit : bit,
      ),
    );
  }

  function loadTarget(index: number) {
    const next = TARGETS[index];

    setTargetIndex(index);

    setBits(
      next.binary
        .split('')
        .map((bit) => bit === '1'),
    );

    setTouches((current) => current + 1);
  }

  function resetBits() {
    setBits(Array(8).fill(false));
    setTouches((current) => current + 1);
  }

  const signalTravel = signal.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 300],
  });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          CODE DECODER
        </Text>

        <Text style={styles.title}>
          From binary to a letter
        </Text>

        <Text style={styles.subtitle}>
          Build the binary pattern and watch the machine decode it.
        </Text>
      </View>

      <View style={styles.machine}>
        <View style={styles.machineHeader}>
          <Text style={styles.machineLabel}>
            COMPUTER INPUT
          </Text>

          <View style={styles.machineLight} />
        </View>

        <View style={styles.signalTrack}>
          <View style={styles.signalLine} />

          <Animated.View
            style={[
              styles.signalDot,
              {
                transform: [
                  {
                    translateX: signalTravel,
                  },
                ],
              },
            ]}
          />
        </View>

        <View style={styles.bitGrid}>
          {BITS.map((weight, index) => {
            const active = bits[index];

            return (
              <Pressable
                key={weight}
                onPress={() => toggleBit(index)}
                style={[
                  styles.bit,
                  active && styles.bitActive,
                ]}
              >
                <Text style={styles.weight}>
                  {weight}
                </Text>

                <View
                  style={[
                    styles.bitLamp,
                    active && styles.bitLampActive,
                  ]}
                />

                <Text
                  style={[
                    styles.bitNumber,
                    active && styles.bitNumberActive,
                  ]}
                >
                  {active ? '1' : '0'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.binaryPanel}>
          <Text style={styles.panelLabel}>
            BINARY SIGNAL
          </Text>

          <Text style={styles.binaryText}>
            {binary}
          </Text>

          <Text style={styles.decimalText}>
            {value}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.decoder,
            decoded && styles.decoderActive,
            {
              opacity: decodePulse,
            },
          ]}
        >
          <Text style={styles.decoderSmall}>
            ASCII DECODER
          </Text>

          <Text
            style={[
              styles.decodedLetter,
              decoded && styles.decodedLetterActive,
            ]}
          >
            {decoded ? target.letter : '?'}
          </Text>

          <Text style={styles.decoderExplanation}>
            {decoded
              ? `${binary} → ${value} → ${target.letter}`
              : 'Build the requested pattern'}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.mission}>
        <Text style={styles.missionEyebrow}>
          CURRENT MISSION
        </Text>

        <Text style={styles.missionTitle}>
          Decode the letter {target.letter}
        </Text>

        <Text style={styles.missionBinary}>
          {target.binary}
        </Text>

        <Text style={styles.missionText}>
          Each position has a value. Turn on the positions
          needed to create the target number.
        </Text>
      </View>

      <View style={styles.examples}>
        <Text style={styles.examplesTitle}>
          TRY THESE
        </Text>

        <View style={styles.exampleRow}>
          {TARGETS.map((item, index) => (
            <Pressable
              key={item.letter}
              onPress={() => loadTarget(index)}
              style={[
                styles.exampleButton,
                index === targetIndex &&
                  styles.exampleButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.exampleLetter,
                  index === targetIndex &&
                    styles.exampleLetterActive,
                ]}
              >
                {item.letter}
              </Text>

              <Text style={styles.exampleValue}>
                {item.value}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.touchCount}>
          INTERACTIONS: {touches}
        </Text>

        <View style={styles.footerActions}>
          <Pressable
            onPress={resetBits}
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>
              RESET
            </Text>
          </Pressable>

          {decoded ? (
            <Pressable
              onPress={onComplete}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>
                ENTER THE CODE WORLD →
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.hint}>
              Switch the bits until the letter appears.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },

  header: {
    alignItems: 'center',
    marginBottom: 14,
  },

  eyebrow: {
    color: '#53E8FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 440,
  },

  machine: {
    borderRadius: 28,
    backgroundColor: '#06121B',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.22)',
    padding: 16,
  },

  machineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  machineLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  machineLight: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#53E8FF',
  },

  signalTrack: {
    height: 22,
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 8,
  },

  signalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(83,232,255,0.16)',
  },

  signalDot: {
    position: 'absolute',
    left: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#53E8FF',
  },

  bitGrid: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
  },

  bit: {
    flex: 1,
    minHeight: 104,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bitActive: {
    backgroundColor: 'rgba(83,232,255,0.1)',
    borderColor: 'rgba(83,232,255,0.5)',
  },

  weight: {
    color: 'rgba(255,255,255,0.34)',
    fontSize: 9,
    fontWeight: '900',
  },

  bitLamp: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginVertical: 9,
    backgroundColor: '#1B2B33',
    borderWidth: 1,
    borderColor: '#33434A',
  },

  bitLampActive: {
    backgroundColor: '#53E8FF',
    borderColor: '#53E8FF',
  },

  bitNumber: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 20,
    fontWeight: '900',
  },

  bitNumberActive: {
    color: '#53E8FF',
  },

  binaryPanel: {
    marginTop: 14,
    padding: 14,
    borderRadius: 17,
    alignItems: 'center',
    backgroundColor: '#02080D',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.12)',
  },

  panelLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  binaryText: {
    color: '#53E8FF',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 5,
  },

  decimalText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },

  decoder: {
    marginTop: 12,
    minHeight: 125,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  decoderActive: {
    backgroundColor: 'rgba(83,232,255,0.08)',
    borderColor: 'rgba(83,232,255,0.45)',
  },

  decoderSmall: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  decodedLetter: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 54,
    fontWeight: '900',
    lineHeight: 62,
  },

  decodedLetterActive: {
    color: '#53E8FF',
  },

  decoderExplanation: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '800',
  },

  mission: {
    alignItems: 'center',
    marginTop: 12,
  },

  missionEyebrow: {
    color: '#53E8FF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  missionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },

  missionBinary: {
    color: '#53E8FF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 4,
  },

  missionText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: 400,
    marginTop: 4,
  },

  examples: {
    marginTop: 13,
    alignItems: 'center',
  },

  examplesTitle: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  exampleRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 6,
  },

  exampleButton: {
    minWidth: 54,
    minHeight: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  exampleButtonActive: {
    borderColor: '#53E8FF',
    backgroundColor: 'rgba(83,232,255,0.08)',
  },

  exampleLetter: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '900',
  },

  exampleLetterActive: {
    color: '#53E8FF',
  },

  exampleValue: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },

  footer: {
    alignItems: 'center',
    marginTop: 11,
  },

  touchCount: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  footerActions: {
    alignItems: 'center',
    marginTop: 5,
  },

  resetButton: {
    minHeight: 38,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  continueButton: {
    marginTop: 7,
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    color: '#031018',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  hint: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 11,
    marginTop: 5,
  },
});
