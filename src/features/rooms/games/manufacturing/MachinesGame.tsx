import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Machine = {
  id: string;
  name: string;
  icon: string;
  mechanism: string;
  output: string;
  explanation: string;
};

const MACHINES: Machine[] = [
  {
    id: 'motor',
    name: 'MOTOR',
    icon: '⚙',
    mechanism: 'ROTATION',
    output: 'Turns a shaft',
    explanation:
      'A motor converts electrical energy into rotational motion.',
  },
  {
    id: 'belt',
    name: 'BELT DRIVE',
    icon: '⭕',
    mechanism: 'TRANSFER',
    output: 'Moves rotation',
    explanation:
      'A belt transfers rotation from one wheel to another.',
  },
  {
    id: 'lever',
    name: 'LEVER',
    icon: '╱',
    mechanism: 'PIVOT',
    output: 'Multiplies movement',
    explanation:
      'A lever rotates around a pivot to move or lift a load.',
  },
  {
    id: 'wheel',
    name: 'WHEEL',
    icon: '◉',
    mechanism: 'ROLLING',
    output: 'Moves a load',
    explanation:
      'A wheel changes sliding motion into easier rolling motion.',
  },
];

const TASKS = [
  {
    name: 'MAKE A SHAFT TURN',
    icon: '↻',
    answer: 'motor',
    clue: 'You need a source of rotational motion.',
  },
  {
    name: 'TRANSFER ROTATION',
    icon: '⇄',
    answer: 'belt',
    clue: 'The motion needs to travel between wheels.',
  },
  {
    name: 'LIFT A LOAD',
    icon: '↑',
    answer: 'lever',
    clue: 'Use a pivot to move the load.',
  },
  {
    name: 'MOVE A HEAVY OBJECT',
    icon: '◉',
    answer: 'wheel',
    clue: 'Rolling can make movement easier.',
  },
];

export default function MachinesGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [selected, setSelected] = useState<Machine>(
    MACHINES[0],
  );
  const [taskIndex, setTaskIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [matched, setMatched] = useState(false);
  const [touches, setTouches] = useState(0);

  const rotation = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const movement = useMemo(
    () => new Animated.Value(0),
    [],
  );

  useEffect(() => {
    rotation.setValue(0);

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration:
          selected.id === 'motor'
            ? 900
            : selected.id === 'wheel'
              ? 1400
              : 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    if (active) {
      animation.start();
    }

    return () => {
      animation.stop();
    };
  }, [active, selected, rotation]);

  useEffect(() => {
    if (!active) {
      movement.stopAnimation();
      movement.setValue(0);
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(movement, {
          toValue: 1,
          duration: 550,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(movement, {
          toValue: 0,
          duration: 550,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      movement.stopAnimation();
    };
  }, [active, movement]);

  function activateMachine() {
    setActive(true);
    setTouches((current) => current + 1);
  }

  function chooseMachine(machine: Machine) {
    setSelected(machine);
    setActive(true);
    setTouches((current) => current + 1);

    setMatched(machine.id === TASKS[taskIndex].answer);
  }

  function nextTask() {
    if (taskIndex < TASKS.length - 1) {
      setTaskIndex((current) => current + 1);
      setMatched(false);
      setActive(false);
      setTouches((current) => current + 1);
    } else {
      onComplete?.();
    }
  }

  const gearRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const leverRotation = movement.interpolate({
    inputRange: [0, 1],
    outputRange: ['-24deg', '24deg'],
  });

  const wheelRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const machineTransform =
    selected.id === 'lever'
      ? [{ rotate: leverRotation }]
      : selected.id === 'wheel'
        ? [{ rotate: wheelRotation }]
        : [{ rotate: gearRotation }];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MACHINES LAB
        </Text>

        <Text style={styles.title}>
          How does a machine create movement?
        </Text>

        <Text style={styles.subtitle}>
          Activate a mechanism. Watch its movement.
          Then connect that movement to a manufacturing job.
        </Text>
      </View>

      <View style={styles.machineLab}>
        <View style={styles.machineDisplay}>
          <View style={styles.energyLine}>
            <View style={styles.energySource}>
              <Text style={styles.energyIcon}>⚡</Text>
              <Text style={styles.energyLabel}>
                ENERGY
              </Text>
            </View>

            <View style={styles.energyPath}>
              <Animated.View
                style={[
                  styles.energyPulse,
                  {
                    transform: [
                      {
                        translateX: movement.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 120],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>

          <Pressable
            onPress={activateMachine}
            style={[
              styles.machineCore,
              active && styles.machineCoreActive,
            ]}
          >
            <Animated.Text
              style={[
                styles.machineIcon,
                {
                  transform: machineTransform,
                },
              ]}
            >
              {selected.icon}
            </Animated.Text>
          </Pressable>

          <Text style={styles.machineName}>
            {selected.name}
          </Text>

          <Text style={styles.mechanism}>
            {selected.mechanism}
          </Text>

          <View style={styles.outputBox}>
            <Text style={styles.outputLabel}>
              OUTPUT
            </Text>

            <Text style={styles.outputText}>
              {selected.output}
            </Text>
          </View>

          <Text style={styles.tapHint}>
            {active
              ? 'MECHANISM ACTIVE'
              : 'TAP THE MACHINE TO START'}
          </Text>
        </View>

        <View style={styles.explanationPanel}>
          <Text style={styles.explanationEyebrow}>
            OBSERVE
          </Text>

          <Text style={styles.explanationTitle}>
            {selected.name}
          </Text>

          <Text style={styles.explanationText}>
            {selected.explanation}
          </Text>

          <View style={styles.chain}>
            <View style={styles.chainNode}>
              <Text style={styles.chainIcon}>⚡</Text>
              <Text style={styles.chainText}>
                ENERGY
              </Text>
            </View>

            <Text style={styles.chainArrow}>
              →
            </Text>

            <View style={styles.chainNode}>
              <Text style={styles.chainIcon}>
                {selected.icon}
              </Text>
              <Text style={styles.chainText}>
                MECHANISM
              </Text>
            </View>

            <Text style={styles.chainArrow}>
              →
            </Text>

            <View style={styles.chainNode}>
              <Text style={styles.chainIcon}>
                ↻
              </Text>
              <Text style={styles.chainText}>
                MOTION
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.machineRow}>
        {MACHINES.map((machine) => {
          const isSelected =
            selected.id === machine.id;

          return (
            <Pressable
              key={machine.id}
              onPress={() => chooseMachine(machine)}
              style={[
                styles.machineButton,
                isSelected &&
                  styles.machineButtonActive,
              ]}
            >
              <Text style={styles.machineButtonIcon}>
                {machine.icon}
              </Text>

              <Text
                style={[
                  styles.machineButtonText,
                  isSelected &&
                    styles.machineButtonTextActive,
                ]}
              >
                {machine.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.challenge}>
        <Text style={styles.challengeEyebrow}>
          FACTORY TASK {taskIndex + 1}/{TASKS.length}
        </Text>

        <View style={styles.taskRow}>
          <View style={styles.taskIconBox}>
            <Text style={styles.taskIcon}>
              {TASKS[taskIndex].icon}
            </Text>
          </View>

          <View style={styles.taskInfo}>
            <Text style={styles.taskName}>
              {TASKS[taskIndex].name}
            </Text>

            <Text style={styles.taskClue}>
              {TASKS[taskIndex].clue}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.result,
            matched && styles.resultActive,
          ]}
        >
          {matched
            ? `✓ ${selected.name} matches the job`
            : 'Explore the machines and observe their mechanisms'}
        </Text>

        {matched && (
          <Pressable
            onPress={nextTask}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>
              {taskIndex < TASKS.length - 1
                ? 'NEXT FACTORY TASK →'
                : 'FINISH MACHINES LAB →'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ENERGY → MECHANISM → MOTION → USE
        </Text>

        <Text style={styles.touchCount}>
          INTERACTIONS: {touches}
        </Text>
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
    color: '#FFB86B',
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
    maxWidth: 460,
  },

  machineLab: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 27,
    backgroundColor: '#07131B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    padding: 14,
  },

  machineDisplay: {
    flex: 1,
    minHeight: 270,
    borderRadius: 21,
    backgroundColor: '#03090D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  energyLine: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  energySource: {
    alignItems: 'center',
  },

  energyIcon: {
    fontSize: 19,
  },

  energyLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 6,
    fontWeight: '900',
    marginTop: 2,
  },

  energyPath: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255,184,107,0.12)',
    overflow: 'hidden',
  },

  energyPulse: {
    width: 14,
    height: 3,
    backgroundColor: '#FFB86B',
  },

  machineCore: {
    width: 125,
    height: 125,
    borderRadius: 30,
    backgroundColor: 'rgba(255,184,107,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  machineCoreActive: {
    backgroundColor: 'rgba(255,184,107,0.12)',
    borderColor: '#FFB86B',
  },

  machineIcon: {
    fontSize: 62,
  },

  machineName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 10,
  },

  mechanism: {
    color: '#FFB86B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 3,
  },

  outputBox: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
  },

  outputLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  outputText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },

  tapHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 10,
  },

  explanationPanel: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  explanationEyebrow: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  explanationTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },

  explanationText: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },

  chain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 5,
  },

  chainNode: {
    width: 64,
    minHeight: 65,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chainIcon: {
    fontSize: 21,
  },

  chainText: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginTop: 4,
  },

  chainArrow: {
    color: '#FFB86B',
    fontSize: 15,
    fontWeight: '900',
  },

  machineRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 10,
  },

  machineButton: {
    flex: 1,
    minHeight: 72,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  machineButtonActive: {
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderColor: 'rgba(255,184,107,0.55)',
  },

  machineButtonIcon: {
    fontSize: 22,
  },

  machineButtonText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 5,
  },

  machineButtonTextActive: {
    color: '#FFB86B',
  },

  challenge: {
    marginTop: 12,
    borderRadius: 21,
    backgroundColor: 'rgba(255,184,107,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.12)',
    padding: 14,
  },

  challengeEyebrow: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginTop: 9,
  },

  taskIconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  taskIcon: {
    color: '#FFB86B',
    fontSize: 27,
    fontWeight: '900',
  },

  taskInfo: {
    flex: 1,
  },

  taskName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  taskClue: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    marginTop: 3,
  },

  result: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },

  resultActive: {
    color: '#FFB86B',
  },

  continueButton: {
    alignSelf: 'center',
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  continueText: {
    color: '#17100A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  footer: {
    alignItems: 'center',
    marginTop: 10,
  },

  footerText: {
    color: 'rgba(255,184,107,0.55)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  touchCount: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
  },
});
