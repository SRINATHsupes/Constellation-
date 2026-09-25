import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  onComplete?: () => void;
};

export default function ComplexPipesGame({ onComplete }: Props) {
  const [valveA, setValveA] = useState(false);
  const [valveB, setValveB] = useState(false);
  const [experiments, setExperiments] = useState(0);
  const [mode, setMode] = useState<'AND' | 'OR'>('AND');

  const [flowA] = useState(() => new Animated.Value(0));
  const [flowB] = useState(() => new Animated.Value(0));
  const [outputPulse] = useState(() => new Animated.Value(0));

  const andFlow = valveA && valveB;
  const orFlow = valveA || valveB;

  const outputFlow = mode === 'AND' ? andFlow : orFlow;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    if (valveA) {
      const animation = Animated.loop(
        Animated.timing(flowA, {
          toValue: 1,
          duration: 850,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      animation.start();
      animations.push(animation);
    } else {
      flowA.stopAnimation();
      flowA.setValue(0);
    }

    if (valveB) {
      const animation = Animated.loop(
        Animated.timing(flowB, {
          toValue: 1,
          duration: 850,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      animation.start();
      animations.push(animation);
    } else {
      flowB.stopAnimation();
      flowB.setValue(0);
    }

    if (outputFlow) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(outputPulse, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(outputPulse, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();
      animations.push(animation);
    } else {
      outputPulse.stopAnimation();
      outputPulse.setValue(0);
    }

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, [
    valveA,
    valveB,
    outputFlow,
    flowA,
    flowB,
    outputPulse,
  ]);

  function toggleA() {
    setValveA((value) => !value);
    setExperiments((value) => value + 1);
  }

  function toggleB() {
    setValveB((value) => !value);
    setExperiments((value) => value + 1);
  }

  function changeMode() {
    setMode((value) => (value === 'AND' ? 'OR' : 'AND'));
    setExperiments((value) => value + 1);
  }

  const translateA = flowA.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 45],
  });

  const translateB = flowB.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 45],
  });

  const outputScale = outputPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.2],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        ELECTRONICS • LEVEL 2
      </Text>

      <Text style={styles.title}>
        The Two-Valve Machine
      </Text>

      <Text style={styles.description}>
        Now one valve isn&apos;t enough to describe the whole
        system. Experiment with both paths.
      </Text>

      <View style={styles.lab}>
        <Text style={styles.systemLabel}>
          LIVE PIPE NETWORK
        </Text>

        <View style={styles.network}>
          <View style={styles.source}>
            <Text style={styles.sourceText}>💧</Text>
          </View>

          <View style={styles.inputLine} />

          <View style={styles.split}>
            <View style={styles.branchA} />
            <View style={styles.branchB} />
          </View>

          <Pressable
            onPress={toggleA}
            style={[styles.valveA, valveA && styles.activeValve]}
          >
            <View style={styles.valveCircle}>
              <View
                style={[
                  styles.handle,
                  {
                    transform: [
                      {
                        rotate: valveA
                          ? '45deg'
                          : '-45deg',
                      },
                    ],
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.valveText,
                valveA && styles.activeText,
              ]}
            >
              A {valveA ? 'OPEN' : 'CLOSED'}
            </Text>
          </Pressable>

          <Pressable
            onPress={toggleB}
            style={[styles.valveB, valveB && styles.activeValve]}
          >
            <View style={styles.valveCircle}>
              <View
                style={[
                  styles.handle,
                  {
                    transform: [
                      {
                        rotate: valveB
                          ? '45deg'
                          : '-45deg',
                      },
                    ],
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.valveText,
                valveB && styles.activeText,
              ]}
            >
              B {valveB ? 'OPEN' : 'CLOSED'}
            </Text>
          </Pressable>

          {valveA && (
            <Animated.View
              style={[
                styles.waterA,
                {
                  transform: [
                    { translateX: translateA },
                  ],
                },
              ]}
            >
              <Text>💧</Text>
              <Text>💧</Text>
            </Animated.View>
          )}

          {valveB && (
            <Animated.View
              style={[
                styles.waterB,
                {
                  transform: [
                    { translateX: translateB },
                  ],
                },
              ]}
            >
              <Text>💧</Text>
              <Text>💧</Text>
            </Animated.View>
          )}

          <View style={styles.merge}>
            <View style={styles.mergeLine} />
          </View>

          <Animated.View
            style={[
              styles.output,
              {
                transform: [
                  { scale: outputScale },
                ],
              },
            ]}
          >
            <Text style={styles.outputText}>
              {outputFlow ? '💧' : '○'}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.readoutRow}>
          <View style={styles.readout}>
            <Text style={styles.readoutLabel}>
              A
            </Text>
            <Text style={styles.readoutValue}>
              {valveA ? '1' : '0'}
            </Text>
          </View>

          <View style={styles.readout}>
            <Text style={styles.readoutLabel}>
              B
            </Text>
            <Text style={styles.readoutValue}>
              {valveB ? '1' : '0'}
            </Text>
          </View>

          <View style={styles.readout}>
            <Text style={styles.readoutLabel}>
              OUT
            </Text>
            <Text style={styles.readoutValue}>
              {outputFlow ? '1' : '0'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.discovery}>
        <Text style={styles.discoveryLabel}>
          CURRENT SYSTEM
        </Text>

        <Text style={styles.discoveryTitle}>
          {outputFlow
            ? 'Water reached the output.'
            : 'Water did not reach the output.'}
        </Text>

        <Text style={styles.discoveryText}>
          {mode === 'AND'
            ? 'In AND mode, both paths must be open before the output can flow.'
            : 'In OR mode, either path can be open for the output to flow.'}
        </Text>
      </View>

      <Pressable
        onPress={toggleA}
        style={styles.action}
      >
        <Text style={styles.actionText}>
          TOGGLE VALVE A
        </Text>
      </Pressable>

      <Pressable
        onPress={toggleB}
        style={styles.secondaryAction}
      >
        <Text style={styles.secondaryText}>
          TOGGLE VALVE B
        </Text>
      </Pressable>

      {experiments >= 4 && (
        <Pressable
          onPress={changeMode}
          style={styles.modeButton}
        >
          <Text style={styles.modeText}>
            SWITCH TO {mode === 'AND' ? 'OR' : 'AND'} MODE
          </Text>
        </Pressable>
      )}

      {experiments >= 6 && (
        <Pressable
          onPress={onComplete}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>
            I DISCOVERED THE PATTERN →
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
  },

  eyebrow: {
    color: 'rgba(83,232,255,0.7)',
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
    borderRadius: 26,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.2)',
  },

  systemLabel: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  network: {
    height: 330,
    position: 'relative',
    marginTop: 8,
    overflow: 'hidden',
  },

  source: {
    position: 'absolute',
    left: 0,
    top: 134,
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(83,232,255,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(83,232,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sourceText: {
    fontSize: 25,
  },

  inputLine: {
    position: 'absolute',
    left: 50,
    top: 157,
    width: 70,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(83,232,255,0.22)',
  },

  split: {
    position: 'absolute',
    left: 105,
    top: 85,
    width: 125,
    height: 160,
  },

  branchA: {
    position: 'absolute',
    left: 0,
    top: 15,
    width: 110,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(83,232,255,0.2)',
  },

  branchB: {
    position: 'absolute',
    left: 0,
    bottom: 15,
    width: 110,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(83,232,255,0.2)',
  },

  valveA: {
    position: 'absolute',
    left: 165,
    top: 55,
    alignItems: 'center',
  },

  valveB: {
    position: 'absolute',
    left: 165,
    bottom: 55,
    alignItems: 'center',
  },

  activeValve: {
    transform: [{ scale: 1.04 }],
  },

  valveCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#071321',
    borderWidth: 2,
    borderColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  handle: {
    width: 7,
    height: 38,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  valveText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 5,
  },

  activeText: {
    color: '#53E8FF',
  },

  waterA: {
    position: 'absolute',
    left: 245,
    top: 73,
    flexDirection: 'row',
    gap: 10,
  },

  waterB: {
    position: 'absolute',
    left: 245,
    bottom: 73,
    flexDirection: 'row',
    gap: 10,
  },

  merge: {
    position: 'absolute',
    right: 90,
    top: 85,
    width: 60,
    height: 160,
  },

  mergeLine: {
    position: 'absolute',
    left: 0,
    top: 74,
    width: 60,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(83,232,255,0.22)',
  },

  output: {
    position: 'absolute',
    right: 0,
    top: 134,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  outputText: {
    fontSize: 27,
  },

  readoutRow: {
    flexDirection: 'row',
    gap: 8,
  },

  readout: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 13,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  readoutLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 8,
    fontWeight: '900',
  },

  readoutValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },

  discovery: {
    marginTop: 14,
    padding: 16,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  discoveryLabel: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  discoveryTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 6,
  },

  discoveryText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  action: {
    minHeight: 50,
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    color: '#031018',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  secondaryAction: {
    minHeight: 50,
    marginTop: 9,
    borderRadius: 16,
    backgroundColor: 'rgba(83,232,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryText: {
    color: '#53E8FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  modeButton: {
    minHeight: 50,
    marginTop: 9,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  continueButton: {
    minHeight: 52,
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(83,232,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    color: '#53E8FF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
});
