import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const BITS = [8, 4, 2, 1];

export default function BinaryGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [bits, setBits] = useState([false, false, false, false]);
  const [touches, setTouches] = useState(0);

  const signal = useMemo(() => new Animated.Value(0), []);
  const displayPulse = useMemo(() => new Animated.Value(0.75), []);

  const value = bits.reduce(
    (total, active, index) =>
      total + (active ? BITS[index] : 0),
    0,
  );

  const binary = bits
    .map((bit) => (bit ? '1' : '0'))
    .join('');

  useEffect(() => {
    Animated.loop(
      Animated.timing(signal, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      signal.stopAnimation();
    };
  }, [signal]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(displayPulse, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(displayPulse, {
        toValue: 0.75,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [value, displayPulse]);

  function toggleBit(index: number) {
    setTouches((current) => current + 1);

    setBits((current) =>
      current.map((bit, bitIndex) =>
        bitIndex === index ? !bit : bit,
      ),
    );
  }

  function setNumber(target: number) {
    setBits(BITS.map((weight) => (target & weight) !== 0));
    setTouches((current) => current + 1);
  }

  const signalTravel = signal.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 210],
  });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>BINARY LABORATORY</Text>

        <Text style={styles.title}>
          Switches become numbers
        </Text>

        <Text style={styles.subtitle}>
          Turn switches on and off. Watch 0 and 1 build a number.
        </Text>
      </View>

      <View style={styles.lab}>
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

        <View style={styles.switchRow}>
          {BITS.map((weight, index) => {
            const active = bits[index];

            return (
              <Pressable
                key={weight}
                onPress={() => toggleBit(index)}
                style={[
                  styles.bitCard,
                  active && styles.bitCardActive,
                ]}
              >
                <Text style={styles.powerLabel}>
                  {weight}
                </Text>

                <View
                  style={[
                    styles.toggle,
                    active && styles.toggleActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleKnob,
                      active && styles.toggleKnobActive,
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.bitValue,
                    active && styles.bitValueActive,
                  ]}
                >
                  {active ? '1' : '0'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Animated.View
          style={[
            styles.display,
            {
              opacity: displayPulse,
            },
          ]}
        >
          <Text style={styles.displayCaption}>
            BINARY
          </Text>

          <Text style={styles.binaryValue}>
            {binary}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.decimalCaption}>
            DECIMAL
          </Text>

          <Text style={styles.decimalValue}>
            {value}
          </Text>
        </Animated.View>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>
            WATCH THE PATTERN
          </Text>

          <Text style={styles.explanationText}>
            Each switch has a value. OFF means 0.
            ON means 1. Together, the switches describe one number.
          </Text>
        </View>
      </View>

      <View style={styles.discovery}>
        <Text style={styles.discoveryTitle}>
          {value === 0
            ? 'ALL SWITCHES OFF'
            : `${binary} = ${value}`}
        </Text>

        <Text style={styles.discoveryText}>
          {value === 0
            ? 'Start turning switches on and watch the number appear.'
            : `The ON switches contribute ${value} to the total.`}
        </Text>
      </View>

      <View style={styles.quickNumbers}>
        <Text style={styles.quickTitle}>
          TRY A NUMBER
        </Text>

        <View style={styles.quickRow}>
          {[1, 3, 5, 10, 15].map((number) => (
            <Pressable
              key={number}
              onPress={() => setNumber(number)}
              style={styles.numberButton}
            >
              <Text style={styles.numberButtonText}>
                {number}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.touchCount}>
          INTERACTIONS: {touches}
        </Text>

        {touches >= 5 ? (
          <Pressable
            onPress={onComplete}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>
              I SEE THE PATTERN →
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.hint}>
            Explore different switch combinations.
          </Text>
        )}
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

  lab: {
    borderRadius: 28,
    backgroundColor: 'rgba(2,10,22,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.18)',
    padding: 16,
  },

  signalTrack: {
    height: 24,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },

  signalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(83,232,255,0.18)',
  },

  signalDot: {
    position: 'absolute',
    left: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#53E8FF',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  bitCard: {
    flex: 1,
    minWidth: 55,
    minHeight: 132,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bitCardActive: {
    backgroundColor: 'rgba(83,232,255,0.1)',
    borderColor: 'rgba(83,232,255,0.5)',
  },

  powerLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 12,
  },

  toggle: {
    width: 38,
    height: 66,
    borderRadius: 20,
    backgroundColor: '#172833',
    borderWidth: 1,
    borderColor: '#30434D',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },

  toggleActive: {
    backgroundColor: 'rgba(83,232,255,0.22)',
    borderColor: '#53E8FF',
    justifyContent: 'flex-start',
    paddingTop: 5,
  },

  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#52616A',
  },

  toggleKnobActive: {
    backgroundColor: '#53E8FF',
  },

  bitValue: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },

  bitValueActive: {
    color: '#53E8FF',
  },

  display: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#030A10',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.2)',
  },

  displayCaption: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  binaryValue: {
    color: '#53E8FF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 7,
    marginTop: 4,
  },

  divider: {
    width: 90,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 10,
  },

  decimalCaption: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  decimalValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },

  explanation: {
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(83,232,255,0.045)',
  },

  explanationTitle: {
    color: '#53E8FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  explanationText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  discovery: {
    marginTop: 12,
    alignItems: 'center',
  },

  discoveryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  discoveryText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  quickNumbers: {
    marginTop: 14,
    alignItems: 'center',
  },

  quickTitle: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 7,
  },

  numberButton: {
    minWidth: 44,
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  numberButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '900',
  },

  footer: {
    alignItems: 'center',
    marginTop: 12,
  },

  touchCount: {
    color: 'rgba(255,255,255,0.22)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  hint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    marginTop: 5,
  },

  continueButton: {
    marginTop: 6,
    minHeight: 46,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    color: '#031018',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
