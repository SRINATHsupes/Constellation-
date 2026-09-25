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

export default function WaterLogicGame({ onComplete }: Props) {
  const [open, setOpen] = useState(true);
  const [experiments, setExperiments] = useState(0);

  const [waterMove] = useState(() => new Animated.Value(0));
  const [valveMove] = useState(() => new Animated.Value(1));
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (open) {
      waterMove.setValue(0);

      const waterAnimation = Animated.loop(
        Animated.timing(waterMove, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      );

      waterAnimation.start();
      pulseAnimation.start();

      return () => {
        waterAnimation.stop();
        pulseAnimation.stop();
      };
    }

    waterMove.stopAnimation();
    pulse.stopAnimation();
  }, [open, pulse, waterMove]);

  function toggleValve() {
    const next = !open;

    setOpen(next);
    setExperiments((value) => value + 1);

    Animated.spring(valveMove, {
      toValue: next ? 1 : 0,
      friction: 7,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }

  const waterTranslate = waterMove.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 90],
  });

  const waterScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  const valveRotation = valveMove.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        WATCH • TOUCH • DISCOVER
      </Text>

      <Text style={styles.title}>
        Water Logic
      </Text>

      <Text style={styles.description}>
        Electricity can be imagined like water moving
        through pipes. A valve controls the path.
      </Text>

      <View style={styles.lab}>
        <View style={styles.pipeArea}>
          <View style={styles.pipe} />

          {open && (
            <Animated.View
              style={[
                styles.water,
                {
                  transform: [
                    { translateX: waterTranslate },
                    { scale: waterScale },
                  ],
                },
              ]}
            >
              <Text style={styles.drop}>💧</Text>
              <Text style={styles.drop}>💧</Text>
              <Text style={styles.drop}>💧</Text>
            </Animated.View>
          )}

          <View style={styles.source}>
            <Text style={styles.sourceText}>
              💧
            </Text>
          </View>

          <View style={styles.output}>
            <Text style={styles.outputText}>
              {open ? '💧' : '○'}
            </Text>
          </View>

          <Pressable
            onPress={toggleValve}
            style={styles.valve}
            accessibilityRole="button"
            accessibilityLabel={
              open
                ? 'Close the valve'
                : 'Open the valve'
            }
          >
            <View style={styles.valveCircle}>
              <Animated.View
                style={[
                  styles.handle,
                  {
                    transform: [
                      { rotate: valveRotation },
                    ],
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.valveLabel,
                open && styles.openLabel,
              ]}
            >
              {open ? 'OPEN' : 'CLOSED'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusBox}>
            <Text style={styles.statusCaption}>
              VALVE
            </Text>

            <Text style={styles.statusValue}>
              {open ? '1' : '0'}
            </Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusCaption}>
              FLOW
            </Text>

            <Text style={styles.statusValue}>
              {open ? 'MOVING' : 'STOPPED'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationTitle}>
          {open
            ? 'The path is open.'
            : 'The path is blocked.'}
        </Text>

        <Text style={styles.explanationText}>
          {open
            ? 'Water can travel from the source to the output. This is our 1.'
            : 'The valve blocks the path. Water cannot reach the output. This is our 0.'}
        </Text>
      </View>

      <Pressable
        onPress={toggleValve}
        style={styles.action}
      >
        <Text style={styles.actionText}>
          {open
            ? 'CLOSE THE VALVE'
            : 'OPEN THE VALVE'}
        </Text>
      </Pressable>

      {experiments >= 2 && (
        <Pressable
          onPress={onComplete}
          style={styles.next}
        >
          <Text style={styles.nextText}>
            DISCOVER 0 AND 1 →
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },

  eyebrow: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
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
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 18,
  },

  lab: {
    borderRadius: 26,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.18)',
  },

  pipeArea: {
    height: 250,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  pipe: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(83,232,255,0.10)',
    borderWidth: 2,
    borderColor: 'rgba(83,232,255,0.35)',
  },

  water: {
    position: 'absolute',
    left: '38%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  drop: {
    fontSize: 21,
  },

  source: {
    position: 'absolute',
    left: 2,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(83,232,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(83,232,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sourceText: {
    fontSize: 27,
  },

  output: {
    position: 'absolute',
    right: 2,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  outputText: {
    fontSize: 27,
  },

  valve: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },

  valveCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#071321',
    borderWidth: 3,
    borderColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  handle: {
    width: 8,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  valveLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 8,
  },

  openLabel: {
    color: '#53E8FF',
  },

  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  statusBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.20)',
    alignItems: 'center',
  },

  statusCaption: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  statusValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },

  explanation: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  explanationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  explanationText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },

  action: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#53E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  actionText: {
    color: '#031018',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  next: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.45)',
    backgroundColor: 'rgba(83,232,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  nextText: {
    color: '#53E8FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});
