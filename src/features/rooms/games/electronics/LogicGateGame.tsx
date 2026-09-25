import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Gate = 'AND' | 'OR' | 'NOT';

type Props = {
  onComplete?: () => void;
};

export default function LogicGateGame({ onComplete }: Props) {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [gate, setGate] = useState<Gate>('AND');
  const [experiments, setExperiments] = useState(0);

  const [signalA] = useState(() => new Animated.Value(0));
  const [signalB] = useState(() => new Animated.Value(0));
  const [outputPulse] = useState(() => new Animated.Value(0));

  const output =
    gate === 'AND'
      ? a && b
      : gate === 'OR'
        ? a || b
        : !a;

  useEffect(() => {
    Animated.timing(signalA, {
      toValue: a ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(signalB, {
      toValue: b ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (output) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(outputPulse, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(outputPulse, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();

      return () => animation.stop();
    }

    outputPulse.stopAnimation();

    Animated.timing(outputPulse, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [
    a,
    b,
    output,
    signalA,
    signalB,
    outputPulse,
  ]);

  function toggleA() {
    setA((value) => !value);
    setExperiments((value) => value + 1);
  }

  function toggleB() {
    setB((value) => !value);
    setExperiments((value) => value + 1);
  }

  function changeGate() {
    setGate((value) => {
      if (value === 'AND') return 'OR';
      if (value === 'OR') return 'NOT';
      return 'AND';
    });

    setExperiments((value) => value + 1);
  }

  const signalOpacityA = signalA.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 1],
  });

  const signalOpacityB = signalB.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 1],
  });

  const outputScale = outputPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.18],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        ELECTRONICS • LEVEL 3
      </Text>

      <Text style={styles.title}>
        Logic Gate Laboratory
      </Text>

      <Text style={styles.description}>
        The valves have become switches. Now discover
        how switches can control a digital machine.
      </Text>

      <View style={styles.lab}>
        <Text style={styles.labLabel}>
          DIGITAL CIRCUIT
        </Text>

        <View style={styles.circuit}>
          <Pressable
            onPress={toggleA}
            style={[
              styles.switch,
              a && styles.switchOn,
            ]}
          >
            <View
              style={[
                styles.switchDot,
                a && styles.switchDotOn,
              ]}
            />

            <Text style={styles.switchLetter}>
              A
            </Text>

            <Text style={styles.switchValue}>
              {a ? '1' : '0'}
            </Text>
          </Pressable>

          <Animated.View
            style={[
              styles.signal,
              {
                opacity: signalOpacityA,
              },
            ]}
          />

          <Pressable
            onPress={toggleB}
            style={[
              styles.switch,
              b && styles.switchOn,
            ]}
          >
            <View
              style={[
                styles.switchDot,
                b && styles.switchDotOn,
              ]}
            />

            <Text style={styles.switchLetter}>
              B
            </Text>

            <Text style={styles.switchValue}>
              {b ? '1' : '0'}
            </Text>
          </Pressable>

          <Animated.View
            style={[
              styles.signal,
              {
                opacity: signalOpacityB,
              },
            ]}
          />

          <Pressable
            onPress={changeGate}
            style={styles.gate}
          >
            <View style={styles.gateShape}>
              <Text style={styles.gateText}>
                {gate}
              </Text>
            </View>

            <Text style={styles.gateHint}>
              TAP TO CHANGE
            </Text>
          </Pressable>

          <View style={styles.signalAfterGate} />

          <Animated.View
            style={[
              styles.outputLamp,
              {
                transform: [
                  { scale: outputScale },
                ],
              },
              output && styles.outputOn,
            ]}
          >
            <Text style={styles.lampText}>
              {output ? '●' : '○'}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.readoutRow}>
          <View style={styles.readout}>
            <Text style={styles.readoutLabel}>
              INPUT A
            </Text>

            <Text style={styles.readoutValue}>
              {a ? '1' : '0'}
            </Text>
          </View>

          <View style={styles.readout}>
            <Text style={styles.readoutLabel}>
              INPUT B
            </Text>

            <Text style={styles.readoutValue}>
              {b ? '1' : '0'}
            </Text>
          </View>

          <View style={styles.readout}>
            <Text style={styles.readoutLabel}>
              OUTPUT
            </Text>

            <Text style={styles.readoutValue}>
              {output ? '1' : '0'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.discovery}>
        <Text style={styles.discoverySmall}>
          WATCH THE MACHINE
        </Text>

        <Text style={styles.discoveryTitle}>
          {gate === 'AND'
            ? output
              ? 'Both inputs are ON → output ON'
              : 'Both inputs are not ON → output OFF'
            : gate === 'OR'
              ? output
                ? 'At least one input is ON → output ON'
                : 'Both inputs are OFF → output OFF'
              : a
                ? 'Input A is ON → NOT turns output OFF'
                : 'Input A is OFF → NOT turns output ON'}
        </Text>

        <Text style={styles.discoveryText}>
          {gate === 'AND'
            ? 'AND needs both signals.'
            : gate === 'OR'
              ? 'OR needs at least one signal.'
              : 'NOT reverses the signal.'}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={toggleA}
          style={styles.controlButton}
        >
          <Text style={styles.controlText}>
            SWITCH A
          </Text>
        </Pressable>

        <Pressable
          onPress={toggleB}
          style={styles.controlButton}
        >
          <Text style={styles.controlText}>
            SWITCH B
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={changeGate}
        style={styles.gateButton}
      >
        <Text style={styles.gateButtonText}>
          CHANGE GATE · {gate}
        </Text>
      </Pressable>

      {experiments >= 7 && (
        <Pressable
          onPress={onComplete}
          style={styles.nextButton}
        >
          <Text style={styles.nextText}>
            BUILD THE REAL CIRCUIT →
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },

  eyebrow: {
    color: 'rgba(83,232,255,0.72)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 16,
  },

  lab: {
    borderRadius: 27,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.22)',
  },

  labLabel: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  circuit: {
    minHeight: 270,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  switch: {
    width: 52,
    height: 100,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  switchOn: {
    borderColor: '#53E8FF',
    backgroundColor: 'rgba(83,232,255,0.12)',
  },

  switchDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 9,
  },

  switchDotOn: {
    backgroundColor: '#53E8FF',
  },

  switchLetter: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  switchValue: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },

  signal: {
    width: 25,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#53E8FF',
  },

  gate: {
    width: 86,
    alignItems: 'center',
  },

  gateShape: {
    width: 82,
    height: 82,
    borderRadius: 23,
    backgroundColor: '#081321',
    borderWidth: 2,
    borderColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gateText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  gateHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 5,
    letterSpacing: 0.5,
  },

  signalAfterGate: {
    width: 25,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#53E8FF',
    opacity: 0.65,
  },

  outputLamp: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  outputOn: {
    borderColor: '#53E8FF',
    backgroundColor: 'rgba(83,232,255,0.16)',
  },

  lampText: {
    color: '#53E8FF',
    fontSize: 31,
  },

  readoutRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },

  readout: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },

  readoutLabel: {
    color: 'rgba(255,255,255,0.34)',
    fontSize: 7,
    fontWeight: '900',
  },

  readoutValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  discovery: {
    marginTop: 14,
    padding: 16,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  discoverySmall: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  discoveryTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '900',
    marginTop: 6,
  },

  discoveryText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    marginTop: 5,
  },

  controls: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 14,
  },

  controlButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(83,232,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlText: {
    color: '#53E8FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  gateButton: {
    minHeight: 50,
    marginTop: 9,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gateButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  nextButton: {
    minHeight: 53,
    marginTop: 10,
    borderRadius: 17,
    backgroundColor: 'rgba(83,232,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextText: {
    color: '#53E8FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
});
