import React, { useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mode =
  | 'meet'
  | 'direction'
  | 'size'
  | 'train'
  | 'draw';

type GearChoice = {
  id: string;
  label: string;
  teeth: number;
  icon: string;
};

const GEARS: GearChoice[] = [
  { id: 'small', label: 'SMALL', teeth: 8, icon: '⚙' },
  { id: 'medium', label: 'MEDIUM', teeth: 16, icon: '⚙' },
  { id: 'large', label: 'LARGE', teeth: 24, icon: '⚙' },
];

const MODE_INFO: Record<
  Mode,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
  }
> = {
  meet: {
    eyebrow: 'GEAR LAB • DISCOVERY',
    title: 'Make two gears move',
    subtitle:
      'Connect two gears and discover how teeth transfer motion.',
  },
  direction: {
    eyebrow: 'GEAR LAB • DIRECTION',
    title: 'Follow the rotation',
    subtitle:
      'Touching gears turn in opposite directions.',
  },
  size: {
    eyebrow: 'GEAR LAB • SIZE',
    title: 'Change the speed',
    subtitle:
      'Gear size changes how quickly the output rotates.',
  },
  train: {
    eyebrow: 'GEAR LAB • GEAR TRAIN',
    title: 'Pass the motion through',
    subtitle:
      'Build a chain where motion travels from one gear to the next.',
  },
  draw: {
    eyebrow: 'GEAR LAB • DESIGN',
    title: 'Design the gear system',
    subtitle:
      'Choose the arrangement that matches the mechanism you observed.',
  },
};

export default function ManufacturingChallengeGame({
  mode,
  onComplete,
}: {
  mode: Mode;
  onComplete?: () => void;
}) {
  const info = MODE_INFO[mode];

  const [driver, setDriver] = useState<GearChoice>(GEARS[1]);
  const [output, setOutput] = useState<GearChoice>(GEARS[0]);
  const [middle, setMiddle] = useState<GearChoice>(GEARS[1]);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const rotation = useMemo(
    () => new Animated.Value(0),
    [],
  );

  function startMotion() {
    setRunning(true);
    setAttempts((value) => value + 1);

    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }

  function checkMeet() {
    const correct =
      driver.id !== output.id &&
      Math.abs(driver.teeth - output.teeth) > 0;

    if (correct) {
      setComplete(true);
      setRunning(true);
    } else {
      setAttempts((value) => value + 1);
    }
  }

  function checkDirection() {
    if (driver.id !== output.id) {
      setComplete(true);
      setRunning(true);
    } else {
      setAttempts((value) => value + 1);
    }
  }

  function checkSize() {
    const correct =
      driver.id === 'large' &&
      output.id === 'small';

    if (correct) {
      setComplete(true);
      setRunning(true);
    } else {
      setAttempts((value) => value + 1);
    }
  }

  function checkTrain() {
    const correct =
      driver.id !== middle.id &&
      middle.id !== output.id &&
      driver.id !== output.id;

    if (correct) {
      setComplete(true);
      setRunning(true);
    } else {
      setAttempts((value) => value + 1);
    }
  }

  function checkDesign(id: string) {
    setSelectedDesign(id);
    setAttempts((value) => value + 1);

    if (id === 'large-small-medium') {
      setComplete(true);
    }
  }

  function check() {
    if (mode === 'meet') {
      checkMeet();
    } else if (mode === 'direction') {
      checkDirection();
    } else if (mode === 'size') {
      checkSize();
    } else if (mode === 'train') {
      checkTrain();
    }
  }

  const driverSpin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const outputSpin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  function Gear({
    gear,
    reverse,
    active,
  }: {
    gear: GearChoice;
    reverse?: boolean;
    active?: boolean;
  }) {
    return (
      <Animated.View
        style={[
          styles.gear,
          {
            width: gear.teeth * 3.3,
            height: gear.teeth * 3.3,
            borderRadius: gear.teeth * 1.65,
            transform: [
              {
                rotate: reverse ? outputSpin : driverSpin,
              },
            ],
          },
          active && styles.gearActive,
        ]}
      >
        <Text
          style={[
            styles.gearIcon,
            { fontSize: gear.teeth * 1.15 },
          ]}
        >
          {gear.icon}
        </Text>
        <View style={styles.gearCenter} />
      </Animated.View>
    );
  }

  if (mode === 'draw') {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{info.eyebrow}</Text>
          <Text style={styles.title}>{info.title}</Text>
          <Text style={styles.subtitle}>{info.subtitle}</Text>
        </View>

        <View style={styles.designPanel}>
          <Text style={styles.panelLabel}>OBSERVED MECHANISM</Text>

          <Text style={styles.panelText}>
            Choose the gear arrangement that matches:
          </Text>

          <Text style={styles.designHint}>
            LARGE → SMALL → MEDIUM
          </Text>

          <View style={styles.designOptions}>
            {[
              {
                id: 'large-small-medium',
                label: 'LARGE → SMALL → MEDIUM',
                icons: '⚙  ⚙  ⚙',
              },
              {
                id: 'small-large-medium',
                label: 'SMALL → LARGE → MEDIUM',
                icons: '⚙  ⚙  ⚙',
              },
              {
                id: 'medium-medium-large',
                label: 'MEDIUM → MEDIUM → LARGE',
                icons: '⚙  ⚙  ⚙',
              },
            ].map((design) => (
              <Pressable
                key={design.id}
                onPress={() => checkDesign(design.id)}
                style={[
                  styles.designButton,
                  selectedDesign === design.id &&
                    styles.designButtonActive,
                ]}
              >
                <Text style={styles.designIcons}>
                  {design.icons}
                </Text>

                <Text style={styles.designText}>
                  {design.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {complete && (
            <View style={styles.success}>
              <Text style={styles.successTitle}>
                ✓ DESIGN MATCHED
              </Text>

              <Text style={styles.successText}>
                You translated an observed mechanism into a simple
                engineering design.
              </Text>

              <Pressable
                onPress={() => onComplete?.()}
                style={styles.finishButton}
              >
                <Text style={styles.finishText}>
                  FINISH DESIGN →
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          OBSERVE → REPRESENT → DESIGN
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{info.eyebrow}</Text>

        <Text style={styles.title}>{info.title}</Text>

        <Text style={styles.subtitle}>{info.subtitle}</Text>
      </View>

      <View style={styles.machinePanel}>
        <View style={styles.gearRow}>
          <View style={styles.gearColumn}>
            <Text style={styles.role}>DRIVER</Text>

            <Gear
              gear={driver}
              active={running}
            />

            <Text style={styles.gearLabel}>
              {driver.label}
            </Text>
          </View>

          {mode === 'train' ? (
            <>
              <Text style={styles.arrow}>→</Text>

              <View style={styles.gearColumn}>
                <Text style={styles.role}>MIDDLE</Text>

                <Gear
                  gear={middle}
                  reverse
                  active={running}
                />

                <Text style={styles.gearLabel}>
                  {middle.label}
                </Text>
              </View>

              <Text style={styles.arrow}>→</Text>
            </>
          ) : (
            <Text style={styles.arrow}>↔</Text>
          )}

          <View style={styles.gearColumn}>
            <Text style={styles.role}>OUTPUT</Text>

            <Gear
              gear={output}
              reverse
              active={running}
            />

            <Text style={styles.gearLabel}>
              {output.label}
            </Text>
          </View>
        </View>

        <View style={styles.observation}>
          <Text style={styles.observationTitle}>
            WATCH WHAT HAPPENS
          </Text>

          <Text style={styles.observationText}>
            {mode === 'meet'
              ? 'The teeth push against each other and transfer rotation.'
              : mode === 'direction'
                ? 'The touching gears rotate in opposite directions.'
                : mode === 'size'
                  ? 'The large driver makes the smaller output rotate faster.'
                  : 'Each gear passes the motion to the next gear.'}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Text style={styles.controlTitle}>
          {mode === 'train'
            ? 'BUILD THE GEAR TRAIN'
            : 'CHANGE THE GEARS'}
        </Text>

        <View style={styles.choiceRow}>
          {GEARS.map((gear) => (
            <Pressable
              key={`driver-${gear.id}`}
              onPress={() => {
                setDriver(gear);
                setComplete(false);
              }}
              style={[
                styles.choice,
                driver.id === gear.id &&
                  styles.choiceActive,
              ]}
            >
              <Text style={styles.choiceIcon}>⚙</Text>
              <Text style={styles.choiceText}>
                {gear.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {mode === 'train' && (
          <>
            <Text style={styles.smallControlTitle}>
              MIDDLE GEAR
            </Text>

            <View style={styles.choiceRow}>
              {GEARS.map((gear) => (
                <Pressable
                  key={`middle-${gear.id}`}
                  onPress={() => {
                    setMiddle(gear);
                    setComplete(false);
                  }}
                  style={[
                    styles.choice,
                    middle.id === gear.id &&
                      styles.choiceActive,
                  ]}
                >
                  <Text style={styles.choiceIcon}>⚙</Text>
                  <Text style={styles.choiceText}>
                    {gear.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.smallControlTitle}>
          OUTPUT GEAR
        </Text>

        <View style={styles.choiceRow}>
          {GEARS.map((gear) => (
            <Pressable
              key={`output-${gear.id}`}
              onPress={() => {
                setOutput(gear);
                setComplete(false);
              }}
              style={[
                styles.choice,
                output.id === gear.id &&
                  styles.choiceActive,
              ]}
            >
              <Text style={styles.choiceIcon}>⚙</Text>
              <Text style={styles.choiceText}>
                {gear.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {!complete && (
        <Pressable
          onPress={
            mode === 'meet'
              ? startMotion
              : check
          }
          style={styles.action}
        >
          <Text style={styles.actionText}>
            {mode === 'meet'
              ? 'START THE GEAR SYSTEM →'
              : mode === 'direction'
                ? 'CHECK THE DIRECTION →'
                : mode === 'size'
                  ? 'CHECK THE SPEED →'
                  : 'RUN THE GEAR TRAIN →'}
          </Text>
        </Pressable>
      )}

      {complete && (
        <View style={styles.success}>
          <Text style={styles.successTitle}>
            ✓ MECHANISM WORKS
          </Text>

          <Text style={styles.successText}>
            {mode === 'direction'
              ? 'You observed how connected gears reverse rotation.'
              : mode === 'size'
                ? 'You used gear size to change rotational speed.'
                : mode === 'train'
                  ? 'You passed motion through a complete gear train.'
                  : 'You made a working gear connection.'}
          </Text>

          <Pressable
            onPress={() => onComplete?.()}
            style={styles.finishButton}
          >
            <Text style={styles.finishText}>
              CONTINUE →
            </Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.footer}>
        TEETH → CONTACT → MOTION → UNDERSTANDING
      </Text>

      <Text style={styles.attempts}>
        INTERACTIONS: {attempts}
      </Text>
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
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 470,
    marginTop: 6,
  },

  machinePanel: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#061119',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.18)',
  },

  gearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 190,
  },

  gearColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  role: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 7,
  },

  gear: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderWidth: 2,
    borderColor: 'rgba(255,184,107,0.5)',
  },

  gearActive: {
    borderColor: '#FFB86B',
    backgroundColor: 'rgba(255,184,107,0.15)',
  },

  gearIcon: {
    color: '#FFB86B',
  },

  gearCenter: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#061119',
    borderWidth: 2,
    borderColor: '#FFB86B',
  },

  gearLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 7,
  },

  arrow: {
    color: '#FFB86B',
    fontSize: 22,
    fontWeight: '900',
  },

  observation: {
    marginTop: 12,
    padding: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  observationTitle: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  observationText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  controls: {
    marginTop: 12,
  },

  controlTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },

  smallControlTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 7,
  },

  choice: {
    flex: 1,
    minHeight: 58,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  choiceActive: {
    borderColor: '#FFB86B',
    backgroundColor: 'rgba(255,184,107,0.1)',
  },

  choiceIcon: {
    color: '#FFB86B',
    fontSize: 18,
  },

  choiceText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 3,
  },

  action: {
    minHeight: 46,
    borderRadius: 14,
    marginTop: 13,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    color: '#17100A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  success: {
    marginTop: 13,
    padding: 14,
    borderRadius: 17,
    backgroundColor: 'rgba(255,184,107,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.25)',
    alignItems: 'center',
  },

  successTitle: {
    color: '#FFB86B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  successText: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
  },

  finishButton: {
    minHeight: 43,
    paddingHorizontal: 20,
    borderRadius: 13,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  finishText: {
    color: '#17100A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  designPanel: {
    borderRadius: 24,
    padding: 17,
    backgroundColor: '#061119',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.18)',
  },

  panelLabel: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  panelText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 9,
  },

  designHint: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 18,
  },

  designOptions: {
    gap: 8,
  },

  designButton: {
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    paddingHorizontal: 13,
    justifyContent: 'center',
  },

  designButtonActive: {
    borderColor: '#FFB86B',
    backgroundColor: 'rgba(255,184,107,0.1)',
  },

  designIcons: {
    color: '#FFB86B',
    fontSize: 16,
  },

  designText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3,
  },

  footer: {
    color: 'rgba(255,184,107,0.5)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 11,
  },

  attempts: {
    color: 'rgba(255,255,255,0.17)',
    fontSize: 7,
    textAlign: 'center',
    marginTop: 4,
  },
});
