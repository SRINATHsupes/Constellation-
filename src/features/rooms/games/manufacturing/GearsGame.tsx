import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Gear = {
  id: string;
  teeth: number;
  size: number;
  label: string;
};

const GEARS: Gear[] = [
  {
    id: 'small',
    teeth: 8,
    size: 58,
    label: 'SMALL',
  },
  {
    id: 'medium',
    teeth: 16,
    size: 82,
    label: 'MEDIUM',
  },
  {
    id: 'large',
    teeth: 24,
    size: 108,
    label: 'LARGE',
  },
];

type GearMode =
  | 'meet'
  | 'direction'
  | 'size'
  | 'train';

type Props = {
  mode?: GearMode;
  onComplete?: () => void;
};

const MODE_INFO: Record<
  GearMode,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
  }
> = {
  meet: {
    eyebrow: 'GEAR DISCOVERY',
    title: 'Meet the Gear',
    subtitle:
      'Turn the input gear and watch the connected gear respond.',
  },
  direction: {
    eyebrow: 'DIRECTION LAB',
    title: 'Which Way Does It Turn?',
    subtitle:
      'Touching gears rotate in opposite directions.',
  },
  size: {
    eyebrow: 'SPEED LAB',
    title: 'Small or Large?',
    subtitle:
      'Change the gear sizes and compare how quickly they turn.',
  },
  train: {
    eyebrow: 'GEAR TRAIN LAB',
    title: 'Follow the Motion',
    subtitle:
      'Build a chain of gears and follow the motion from input to output.',
  },
};

const TASKS: Record<
  Exclude<GearMode, 'meet'>,
  Array<{
    title: string;
    clue: string;
    driver: string;
    driven: string;
  }>
> = {
  direction: [
    {
      title: 'REVERSE THE OUTPUT',
      clue:
        'Choose two touching gears. Their rotations must point in opposite directions.',
      driver: 'medium',
      driven: 'large',
    },
    {
      title: 'TRY ANOTHER PAIR',
      clue:
        'Change the gear sizes without changing the direction relationship.',
      driver: 'small',
      driven: 'medium',
    },
  ],

  size: [
    {
      title: 'MAKE THE OUTPUT FASTER',
      clue:
        'Use a larger driving gear and a smaller output gear.',
      driver: 'large',
      driven: 'small',
    },
    {
      title: 'MAKE THE OUTPUT SLOWER',
      clue:
        'Use a smaller driving gear and a larger output gear.',
      driver: 'small',
      driven: 'large',
    },
  ],

  train: [
    {
      title: 'START THE GEAR TRAIN',
      clue:
        'Choose a driver and output gear to begin following motion through the system.',
      driver: 'medium',
      driven: 'small',
    },
    {
      title: 'CHANGE THE TRAIN',
      clue:
        'Try a different pair and observe how the speed relationship changes.',
      driver: 'large',
      driven: 'medium',
    },
  ],
};

export default function GearsGame({
  mode = 'meet',
  onComplete,
}: Props) {
  const info = MODE_INFO[mode];

  const [driver, setDriver] = useState<Gear>(GEARS[1]);
  const [driven, setDriven] = useState<Gear>(GEARS[2]);
  const [running, setRunning] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const [interactions, setInteractions] = useState(0);

  const driverRotation = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const drivenRotation = useMemo(
    () => new Animated.Value(0),
    [],
  );

  useEffect(() => {
    if (!running) {
      driverRotation.stopAnimation();
      drivenRotation.stopAnimation();
      return;
    }

    driverRotation.setValue(0);
    drivenRotation.setValue(0);

    const driverAnimation = Animated.loop(
      Animated.timing(driverRotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const drivenAnimation = Animated.loop(
      Animated.timing(drivenRotation, {
        toValue: 1,
        duration: Math.max(
          650,
          1100 * (driven.teeth / driver.teeth),
        ),
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    driverAnimation.start();
    drivenAnimation.start();

    return () => {
      driverAnimation.stop();
      drivenAnimation.stop();
    };
  }, [
    running,
    driver,
    driven,
    driverRotation,
    drivenRotation,
  ]);

  function selectDriver(gear: Gear) {
    setDriver(gear);
    setRunning(true);
    setMatched(false);
    setInteractions((value) => value + 1);
  }

  function selectDriven(gear: Gear) {
    setDriven(gear);
    setRunning(true);
    setMatched(false);
    setInteractions((value) => value + 1);
  }

  function startObservation() {
    setRunning((value) => !value);
    setInteractions((value) => value + 1);
  }

  function checkCombination() {
    if (mode === 'meet') {
      setRunning(true);
      setMatched(true);
      setInteractions((value) => value + 1);
      return;
    }

    const task = TASKS[mode][taskIndex];

    const correct =
      driver.id === task.driver &&
      driven.id === task.driven;

    setMatched(correct);
    setRunning(correct);

    if (correct) {
      setInteractions((value) => value + 1);
    }
  }

  function nextTask() {
    if (mode === 'meet') {
      onComplete?.();
      return;
    }

    const tasks = TASKS[mode];

    if (taskIndex < tasks.length - 1) {
      setTaskIndex((value) => value + 1);
      setMatched(false);
      setRunning(false);
    } else {
      onComplete?.();
    }
  }

  const drivenSpin = drivenRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const driverAngle = driverRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const speedRatio = (
    driver.teeth / driven.teeth
  ).toFixed(2);

  const currentTask =
    mode === 'meet'
      ? null
      : TASKS[mode][taskIndex];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          {info.eyebrow}
        </Text>

        <Text style={styles.title}>
          {info.title}
        </Text>

        <Text style={styles.subtitle}>
          {info.subtitle}
        </Text>
      </View>

      <View style={styles.workbench}>
        <View style={styles.machineArea}>
          <View style={styles.inputLabel}>
            <Text style={styles.inputIcon}>⚡</Text>
            <Text style={styles.inputText}>
              INPUT
            </Text>
          </View>

          <View style={styles.gearSystem}>
            <View style={styles.gearColumn}>
              <Text style={styles.gearRole}>
                DRIVER
              </Text>

              <Animated.View
                style={[
                  styles.gear,
                  {
                    width: driver.size,
                    height: driver.size,
                    borderRadius: driver.size / 2,
                    transform: [
                      { rotate: driverAngle },
                    ],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gearSymbol,
                    {
                      fontSize:
                        driver.size * 0.42,
                    },
                  ]}
                >
                  ⚙
                </Text>

                <View style={styles.gearCenter} />
              </Animated.View>

              <Text style={styles.gearInfo}>
                {driver.teeth} TEETH
              </Text>
            </View>

            <View style={styles.contact}>
              <View style={styles.contactLine} />
              <Text style={styles.contactText}>
                TOUCH
              </Text>
              <View style={styles.contactLine} />
            </View>

            <View style={styles.gearColumn}>
              <Text style={styles.gearRole}>
                OUTPUT
              </Text>

              <Animated.View
                style={[
                  styles.gear,
                  {
                    width: driven.size,
                    height: driven.size,
                    borderRadius: driven.size / 2,
                    transform: [
                      { rotate: drivenSpin },
                    ],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gearSymbol,
                    {
                      fontSize:
                        driven.size * 0.42,
                    },
                  ]}
                >
                  ⚙
                </Text>

                <View style={styles.gearCenter} />
              </Animated.View>

              <Text style={styles.gearInfo}>
                {driven.teeth} TEETH
              </Text>
            </View>
          </View>

          <View style={styles.readout}>
            <View style={styles.readoutItem}>
              <Text style={styles.readoutLabel}>
                RATIO
              </Text>

              <Text style={styles.readoutValue}>
                {speedRatio}×
              </Text>
            </View>

            <View style={styles.readoutDivider} />

            <View style={styles.readoutItem}>
              <Text style={styles.readoutLabel}>
                DIRECTION
              </Text>

              <Text style={styles.readoutValue}>
                OPPOSITE
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.explanation}>
          <Text style={styles.explanationEyebrow}>
            WATCH THE MECHANISM
          </Text>

          <Text style={styles.explanationTitle}>
            {mode === 'meet'
              ? 'Motion travels through the teeth.'
              : mode === 'direction'
                ? 'Touching gears turn opposite ways.'
                : mode === 'size'
                  ? 'Gear size changes the speed.'
                  : 'Several gears can pass motion along.'}
          </Text>

          <Text style={styles.explanationText}>
            {mode === 'meet'
              ? 'Turn the driver and observe how its teeth push the output gear.'
              : mode === 'direction'
                ? 'When one gear pushes the other, the contact point forces the second gear to rotate the opposite way.'
                : mode === 'size'
                  ? 'A smaller gear can rotate faster while a larger gear rotates more slowly.'
                  : 'A gear train connects several rotating wheels so movement can travel from one part to another.'}
          </Text>

          <View style={styles.rule}>
            <Text style={styles.ruleIcon}>
              ⚙
            </Text>

            <Text style={styles.ruleText}>
              {mode === 'direction'
                ? 'TOUCH → OPPOSITE'
                : mode === 'size'
                  ? 'SMALL → FASTER\nLARGE → SLOWER'
                  : mode === 'train'
                    ? 'INPUT → GEAR → GEAR → OUTPUT'
                    : 'INPUT → TEETH → OUTPUT'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.selectorRow}>
        <View style={styles.selector}>
          <Text style={styles.selectorTitle}>
            DRIVER GEAR
          </Text>

          <View style={styles.options}>
            {GEARS.map((gear) => (
              <Pressable
                key={`driver-${gear.id}`}
                onPress={() => selectDriver(gear)}
                style={[
                  styles.option,
                  driver.id === gear.id &&
                    styles.optionActive,
                ]}
              >
                <Text style={styles.optionIcon}>
                  ⚙
                </Text>

                <Text
                  style={[
                    styles.optionText,
                    driver.id === gear.id &&
                      styles.optionTextActive,
                  ]}
                >
                  {gear.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.selector}>
          <Text style={styles.selectorTitle}>
            OUTPUT GEAR
          </Text>

          <View style={styles.options}>
            {GEARS.map((gear) => (
              <Pressable
                key={`driven-${gear.id}`}
                onPress={() => selectDriven(gear)}
                style={[
                  styles.option,
                  driven.id === gear.id &&
                    styles.optionActive,
                ]}
              >
                <Text style={styles.optionIcon}>
                  ⚙
                </Text>

                <Text
                  style={[
                    styles.optionText,
                    driven.id === gear.id &&
                      styles.optionTextActive,
                  ]}
                >
                  {gear.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {mode === 'meet' ? (
        <View style={styles.challenge}>
          <Text style={styles.challengeEyebrow}>
            OBSERVATION TASK
          </Text>

          <Text style={styles.challengeTitle}>
            Start the mechanism and watch both gears.
          </Text>

          <Text style={styles.challengeClue}>
            Change the gear sizes, start them again, and notice what changes.
          </Text>

          <Pressable
            onPress={startObservation}
            style={styles.testButton}
          >
            <Text style={styles.testButtonText}>
              {running
                ? 'PAUSE THE GEARS'
                : 'START THE GEARS →'}
            </Text>
          </Pressable>

          {matched && (
            <View style={styles.successArea}>
              <Text style={styles.successText}>
                ✓ YOU OBSERVED THE MECHANISM
              </Text>

              <Text style={styles.successDetail}>
                Teeth transfer motion from the driver to the output.
              </Text>

              <Pressable
                onPress={nextTask}
                style={styles.continueButton}
              >
                <Text style={styles.continueText}>
                  FINISH GEAR DISCOVERY →
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.challenge}>
          <Text style={styles.challengeEyebrow}>
            GEAR TASK {taskIndex + 1}/{TASKS[mode].length}
          </Text>

          <Text style={styles.challengeTitle}>
            {currentTask?.title}
          </Text>

          <Text style={styles.challengeClue}>
            {currentTask?.clue}
          </Text>

          {!matched && (
            <Pressable
              onPress={checkCombination}
              style={styles.testButton}
            >
              <Text style={styles.testButtonText}>
                TEST THE GEAR SYSTEM →
              </Text>
            </Pressable>
          )}

          {matched && (
            <View style={styles.successArea}>
              <Text style={styles.successText}>
                ✓ MECHANISM WORKS
              </Text>

              <Text style={styles.successDetail}>
                {driver.label} driver → {driven.label} output
              </Text>

              <Pressable
                onPress={nextTask}
                style={styles.continueButton}
              >
                <Text style={styles.continueText}>
                  {taskIndex < TASKS[mode].length - 1
                    ? 'NEXT GEAR TASK →'
                    : 'FINISH GEAR LAB →'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          TEETH → SPEED → DIRECTION → MOTION
        </Text>

        <Text style={styles.interactions}>
          INTERACTIONS: {interactions}
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

  workbench: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 27,
    backgroundColor: '#07131B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    padding: 14,
  },

  machineArea: {
    flex: 1,
    minHeight: 300,
    borderRadius: 21,
    backgroundColor: '#03090D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  inputLabel: {
    position: 'absolute',
    top: 14,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  inputIcon: {
    fontSize: 15,
  },

  inputText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  gearSystem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  gearColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  gearRole: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  gear: {
    backgroundColor: 'rgba(255,184,107,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255,184,107,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gearSymbol: {
    color: '#FFB86B',
  },

  gearCenter: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#03090D',
    borderWidth: 2,
    borderColor: '#FFB86B',
  },

  gearInfo: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 6,
  },

  contact: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactLine: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(255,184,107,0.35)',
  },

  contactText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 6,
    fontWeight: '900',
    marginVertical: 5,
  },

  readout: {
    position: 'absolute',
    bottom: 12,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
  },

  readoutItem: {
    alignItems: 'center',
  },

  readoutLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 1,
  },

  readoutValue: {
    color: '#FFB86B',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },

  readoutDivider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  explanation: {
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

  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 18,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,184,107,0.06)',
  },

  ruleIcon: {
    fontSize: 23,
    color: '#FFB86B',
  },

  ruleText: {
    color: '#FFB86B',
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 15,
  },

  selectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  selector: {
    flex: 1,
  },

  selectorTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  options: {
    flexDirection: 'row',
    gap: 6,
  },

  option: {
    flex: 1,
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionActive: {
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderColor: 'rgba(255,184,107,0.55)',
  },

  optionIcon: {
    fontSize: 18,
    color: '#FFB86B',
  },

  optionText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 3,
  },

  optionTextActive: {
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

  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 7,
  },

  challengeClue: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  testButton: {
    alignSelf: 'center',
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },

  testButtonText: {
    color: '#17100A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  successArea: {
    alignItems: 'center',
    marginTop: 10,
  },

  successText: {
    color: '#FFB86B',
    fontSize: 11,
    fontWeight: '900',
  },

  successDetail: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },

  continueButton: {
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

  interactions: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
  },
});
