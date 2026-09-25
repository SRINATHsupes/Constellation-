import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Piece = 'battery' | 'wire1' | 'wire2' | 'switch' | 'bulb';

export default function CircuitRepairGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [placed, setPlaced] = useState<Record<Piece, boolean>>({
    battery: true,
    wire1: true,
    wire2: false,
    switch: true,
    bulb: true,
  });

  const [switchOn, setSwitchOn] = useState(false);
  const [touches, setTouches] = useState(0);

  const currentFlow = placed.wire2 && switchOn;

  const flow = useMemo(() => new Animated.Value(0), []);
  const bulbGlow = useMemo(() => new Animated.Value(0.35), []);

  useEffect(() => {
    if (!currentFlow) {
      flow.stopAnimation();
      flow.setValue(0);

      Animated.timing(bulbGlow, {
        toValue: 0.35,
        duration: 250,
        useNativeDriver: true,
      }).start();

      return;
    }

    Animated.loop(
      Animated.timing(flow, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bulbGlow, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(bulbGlow, {
          toValue: 0.65,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      flow.stopAnimation();
      bulbGlow.stopAnimation();
    };
  }, [currentFlow, flow, bulbGlow]);

  function interact(piece: Piece) {
    setTouches((value) => value + 1);

    if (piece === 'wire2') {
      setPlaced((current) => ({
        ...current,
        wire2: true,
      }));
      return;
    }

    if (piece === 'switch') {
      setSwitchOn((current) => !current);
    }
  }

  const wireDash = flow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -90],
  });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CIRCUIT WORKBENCH</Text>

        <Text style={styles.title}>
          Repair the broken circuit
        </Text>

        <Text style={styles.subtitle}>
          One connection is missing. Complete the path, then close the switch.
        </Text>
      </View>

      <View style={styles.workbench}>
        <View style={styles.board}>
          <View style={styles.row}>
            <View style={styles.componentColumn}>
              <Pressable
                onPress={() => interact('battery')}
                style={styles.component}
              >
                <Text style={styles.componentEmoji}>🔋</Text>
                <Text style={styles.componentLabel}>BATTERY</Text>
                <Text style={styles.componentValue}>POWER</Text>
              </Pressable>
            </View>

            <View style={styles.wireArea}>
              <View style={styles.wireTrack}>
                <View style={styles.wireLine} />

                {currentFlow &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.currentDot,
                        {
                          transform: [
                            {
                              translateX: wireDash,
                            },
                          ],
                          left: 18 + index * 30,
                        },
                      ]}
                    />
                  ))}
              </View>

              <Text style={styles.wireLabel}>
                CURRENT PATH
              </Text>
            </View>

            <View style={styles.componentColumn}>
              <Animated.View
                style={[
                  styles.bulbShell,
                  {
                    opacity: bulbGlow,
                  },
                ]}
              >
                <Text style={styles.bulbEmoji}>
                  💡
                </Text>
              </Animated.View>

              <Text style={styles.componentLabel}>BULB</Text>

              <Text
                style={[
                  styles.componentValue,
                  currentFlow && styles.activeText,
                ]}
              >
                {currentFlow ? 'LIT' : 'OFF'}
              </Text>
            </View>
          </View>

          <View style={styles.middleRow}>
            <View style={styles.connectionPoint}>
              <View style={styles.node} />
              <Text style={styles.nodeText}>A</Text>
            </View>

            <Pressable
              onPress={() => interact('wire2')}
              style={[
                styles.missingWire,
                placed.wire2 && styles.connectedWire,
              ]}
            >
              <Text style={styles.wirePiece}>
                {placed.wire2 ? '━━━━━━━━' : '＋  WIRE'}
              </Text>

              <Text style={styles.wirePieceLabel}>
                {placed.wire2 ? 'CONNECTED' : 'TAP TO REPAIR'}
              </Text>
            </Pressable>

            <View style={styles.connectionPoint}>
              <View style={styles.node} />
              <Text style={styles.nodeText}>B</Text>
            </View>
          </View>

          <View style={styles.switchSection}>
            <Pressable
              onPress={() => interact('switch')}
              style={[
                styles.switch,
                switchOn && styles.switchOn,
              ]}
            >
              <View
                style={[
                  styles.switchLever,
                  switchOn && styles.switchLeverOn,
                ]}
              />

              <Text style={styles.switchLabel}>
                SWITCH
              </Text>

              <Text
                style={[
                  styles.switchState,
                  switchOn && styles.activeText,
                ]}
              >
                {switchOn ? '1  •  CLOSED' : '0  •  OPEN'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.statusBox}>
            <View
              style={[
                styles.statusDot,
                currentFlow && styles.statusDotActive,
              ]}
            />

            <View style={styles.statusTextArea}>
              <Text style={styles.statusTitle}>
                {currentFlow
                  ? 'CIRCUIT COMPLETE'
                  : placed.wire2
                    ? 'PATH READY — CLOSE THE SWITCH'
                    : 'BROKEN CONNECTION DETECTED'}
              </Text>

              <Text style={styles.statusDescription}>
                {currentFlow
                  ? 'Electric current can travel around the complete loop.'
                  : placed.wire2
                    ? 'The components are connected. Now let the current flow.'
                    : 'The battery cannot send current through an incomplete path.'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.lessonStrip}>
        <Text style={styles.lessonTitle}>
          WATCH THE IDEA
        </Text>

        <Text style={styles.lessonText}>
          A circuit needs a complete path. When the path is closed,
          current can travel through the components.
        </Text>
      </View>

      <View style={styles.controls}>
        <Text style={styles.touchCount}>
          INTERACTIONS: {touches}
        </Text>

        {currentFlow ? (
          <Pressable
            onPress={onComplete}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>
              CIRCUIT WORKS →
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.hint}>
            Tap the missing wire, then tap the switch.
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

  workbench: {
    borderRadius: 28,
    backgroundColor: 'rgba(2,10,22,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.18)',
    padding: 12,
  },

  board: {
    borderRadius: 22,
    backgroundColor: '#071522',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  componentColumn: {
    alignItems: 'center',
    minWidth: 72,
  },

  component: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  componentEmoji: {
    fontSize: 30,
  },

  componentLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 6,
  },

  componentValue: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },

  wireArea: {
    flex: 1,
    alignItems: 'center',
    minWidth: 80,
  },

  wireTrack: {
    width: '100%',
    height: 28,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  wireLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#234052',
  },

  currentDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#53E8FF',
  },

  wireLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 3,
  },

  bulbShell: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,220,80,0.16)',
  },

  bulbEmoji: {
    fontSize: 34,
  },

  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },

  connectionPoint: {
    alignItems: 'center',
  },

  node: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#152C3B',
    borderWidth: 2,
    borderColor: '#53E8FF',
  },

  nodeText: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 3,
  },

  missingWire: {
    minWidth: 150,
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.32)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(83,232,255,0.035)',
  },

  connectedWire: {
    borderStyle: 'solid',
    backgroundColor: 'rgba(83,232,255,0.1)',
    borderColor: '#53E8FF',
  },

  wirePiece: {
    color: '#53E8FF',
    fontSize: 18,
    fontWeight: '900',
  },

  wirePieceLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },

  switchSection: {
    alignItems: 'center',
    marginTop: 20,
  },

  switch: {
    width: 190,
    minHeight: 86,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  switchOn: {
    borderColor: '#53E8FF',
    backgroundColor: 'rgba(83,232,255,0.09)',
  },

  switchLever: {
    width: 64,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#51616B',
    transform: [{ rotate: '-28deg' }],
  },

  switchLeverOn: {
    backgroundColor: '#53E8FF',
    transform: [{ rotate: '28deg' }],
  },

  switchLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 8,
  },

  switchState: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3,
  },

  activeText: {
    color: '#53E8FF',
  },

  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#35434A',
  },

  statusDotActive: {
    backgroundColor: '#53E8FF',
  },

  statusTextArea: {
    flex: 1,
  },

  statusTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  statusDescription: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  lessonStrip: {
    marginTop: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(83,232,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(83,232,255,0.1)',
  },

  lessonTitle: {
    color: '#53E8FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  lessonText: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  controls: {
    alignItems: 'center',
    marginTop: 12,
  },

  touchCount: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
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
