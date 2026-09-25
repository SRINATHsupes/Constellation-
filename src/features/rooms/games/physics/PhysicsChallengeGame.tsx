import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mode =
  | 'motion'
  | 'force'
  | 'friction'
  | 'gravity'
  | 'energy'
  | 'momentum'
  | 'machines';

type Props = {
  mode: Mode;
  onComplete: () => void;
};

const MODE_INFO: Record<
  Mode,
  {
    title: string;
    subtitle: string;
  }
> = {
  motion: {
    title: 'MOVE THE OBJECT',
    subtitle: 'Change its position and observe the motion.',
  },
  force: {
    title: 'PUSH WITH FORCE',
    subtitle: 'Different pushes create different changes in motion.',
  },
  friction: {
    title: 'CROSS THE SURFACES',
    subtitle: 'Some surfaces resist motion more than others.',
  },
  gravity: {
    title: 'FOLLOW GRAVITY',
    subtitle: 'Objects fall toward Earth because of gravity.',
  },
  energy: {
    title: 'TRANSFER THE ENERGY',
    subtitle: 'Stored energy can become movement.',
  },
  momentum: {
    title: 'COLLISION LAB',
    subtitle: 'Moving objects carry momentum into collisions.',
  },
  machines: {
    title: 'USE A SIMPLE MACHINE',
    subtitle: 'Use force in a useful way.',
  },
};

const SURFACES = [
  {
    id: 'ice',
    label: 'ICE',
    resistance: 1,
    icon: '▱',
  },
  {
    id: 'wood',
    label: 'WOOD',
    resistance: 2,
    icon: '▰',
  },
  {
    id: 'rubber',
    label: 'RUBBER',
    resistance: 3,
    icon: '▰',
  },
];

const MACHINE_OPTIONS = [
  {
    id: 'lever',
    label: 'LEVER',
    icon: '⚖',
    task: 'LIFT',
  },
  {
    id: 'wheel',
    label: 'WHEEL',
    icon: '◉',
    task: 'MOVE',
  },
  {
    id: 'ramp',
    label: 'RAMP',
    icon: '◢',
    task: 'RAISE',
  },
];

export default function PhysicsChallengeGame({
  mode,
  onComplete,
}: Props) {
  const [actionCount, setActionCount] = useState(0);
  const [strength, setStrength] = useState(1);
  const [surfaceIndex, setSurfaceIndex] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [collision, setCollision] = useState(false);
  const [machine, setMachine] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const motionX = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const fallY = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const energyY = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const collisionX = useMemo(
    () => new Animated.Value(0),
    [],
  );

  useEffect(() => {
    setActionCount(0);
    setStrength(1);
    setSurfaceIndex(0);
    setEnergy(0);
    setSpeed(0);
    setCollision(false);
    setMachine(null);
    setComplete(false);

    motionX.setValue(0);
    fallY.setValue(0);
    energyY.setValue(0);
    collisionX.setValue(0);
  }, [mode, motionX, fallY, energyY, collisionX]);

  function finish() {
    if (complete) return;

    setComplete(true);

    setTimeout(() => {
      onComplete();
    }, 650);
  }

  function doMotion() {
    const next = actionCount + 1;
    setActionCount(next);

    Animated.timing(motionX, {
      toValue: Math.min(next * 45, 180),
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (next >= 3) finish();
  }

  function doForce() {
    const next = strength + 1;
    setStrength(next);

    Animated.timing(motionX, {
      toValue: Math.min(next * 35, 180),
      duration: 450,
      useNativeDriver: true,
    }).start();

    if (next >= 4) finish();
  }

  function doFriction() {
    const next = surfaceIndex + 1;

    if (next >= SURFACES.length) {
      finish();
      return;
    }

    setSurfaceIndex(next);

    Animated.timing(motionX, {
      toValue: Math.max(25, 150 - SURFACES[next].resistance * 35),
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  function doGravity() {
    fallY.setValue(0);

    Animated.timing(fallY, {
      toValue: 130,
      duration: 650,
      useNativeDriver: true,
    }).start(() => {
      finish();
    });
  }

  function doEnergy() {
    const next = Math.min(energy + 1, 3);
    setEnergy(next);

    Animated.timing(energyY, {
      toValue: -next * 32,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (next >= 3) finish();
  }

  function doMomentum() {
    if (collision) {
      finish();
      return;
    }

    setSpeed(3);

    Animated.timing(collisionX, {
      toValue: 105,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setCollision(true);

      Animated.timing(collisionX, {
        toValue: 45,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  }

  function chooseMachine(id: string) {
    setMachine(id);

    if (id === 'lever' || id === 'wheel' || id === 'ramp') {
      setTimeout(finish, 450);
    }
  }

  const info = MODE_INFO[mode];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PHYSICS LAB</Text>
        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.subtitle}>{info.subtitle}</Text>
      </View>

      {mode === 'motion' && (
        <View style={styles.lab}>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.ball,
                {
                  transform: [{ translateX: motionX }],
                },
              ]}
            />
          </View>

          <Text style={styles.observation}>
            POSITION CHANGES → MOTION
          </Text>

          <Pressable style={styles.primaryButton} onPress={doMotion}>
            <Text style={styles.primaryText}>MOVE IT</Text>
          </Pressable>

          <Text style={styles.counter}>
            MOVEMENTS OBSERVED: {Math.min(actionCount, 3)} / 3
          </Text>
        </View>
      )}

      {mode === 'force' && (
        <View style={styles.lab}>
          <View style={styles.forceTrack}>
            <Animated.View
              style={[
                styles.forceObject,
                {
                  transform: [{ translateX: motionX }],
                },
              ]}
            />
          </View>

          <View style={styles.forceMeter}>
            <Text style={styles.meterLabel}>PUSH</Text>
            <View style={styles.meterBars}>
              {[1, 2, 3, 4].map((value) => (
                <View
                  key={value}
                  style={[
                    styles.meterBar,
                    value <= strength && styles.meterBarActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={doForce}>
            <Text style={styles.primaryText}>PUSH HARDER</Text>
          </Pressable>
        </View>
      )}

      {mode === 'friction' && (
        <View style={styles.lab}>
          <View style={styles.surfaceScene}>
            <Animated.View
              style={[
                styles.frictionBall,
                {
                  transform: [{ translateX: motionX }],
                },
              ]}
            />
          </View>

          <View style={styles.surfaceRow}>
            {SURFACES.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => setSurfaceIndex(index)}
                style={[
                  styles.surfaceButton,
                  index === surfaceIndex && styles.surfaceButtonActive,
                ]}
              >
                <Text style={styles.surfaceIcon}>{item.icon}</Text>
                <Text style={styles.surfaceLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.observation}>
            {SURFACES[surfaceIndex].label} • RESISTANCE {SURFACES[surfaceIndex].resistance}
          </Text>

          <Pressable style={styles.primaryButton} onPress={doFriction}>
            <Text style={styles.primaryText}>
              TRY NEXT SURFACE
            </Text>
          </Pressable>
        </View>
      )}

      {mode === 'gravity' && (
        <View style={styles.lab}>
          <View style={styles.gravityScene}>
            <Text style={styles.gravityEarth}>EARTH</Text>

            <Animated.View
              style={[
                styles.gravityObject,
                {
                  transform: [{ translateY: fallY }],
                },
              ]}
            >
              ●
            </Animated.View>

            <View style={styles.gravityGround} />
          </View>

          <Text style={styles.observation}>
            DOWNWARD MOTION → GRAVITY
          </Text>

          <Pressable style={styles.primaryButton} onPress={doGravity}>
            <Text style={styles.primaryText}>DROP OBJECT</Text>
          </Pressable>
        </View>
      )}

      {mode === 'energy' && (
        <View style={styles.lab}>
          <View style={styles.energyScene}>
            <View style={styles.energySpring}>
              <Text style={styles.energySpringText}>
                ↕
              </Text>
              <Text style={styles.energyLabel}>
                STORED
              </Text>
            </View>

            <Animated.View
              style={[
                styles.energyBall,
                {
                  transform: [{ translateY: energyY }],
                },
              ]}
            >
              ●
            </Animated.View>
          </View>

          <Text style={styles.observation}>
            STORED ENERGY → MOVEMENT
          </Text>

          <Pressable style={styles.primaryButton} onPress={doEnergy}>
            <Text style={styles.primaryText}>RELEASE ENERGY</Text>
          </Pressable>

          <Text style={styles.counter}>
            ENERGY TRANSFERS: {energy} / 3
          </Text>
        </View>
      )}

      {mode === 'momentum' && (
        <View style={styles.lab}>
          <View style={styles.collisionScene}>
            <Animated.View
              style={[
                styles.collisionBall,
                styles.collisionBlue,
                {
                  transform: [{ translateX: collisionX }],
                },
              ]}
            >
              ●
            </Animated.View>

            <View style={styles.collisionBallStatic}>
              ●
            </View>
          </View>

          <View style={styles.speedRow}>
            <Text style={styles.speedLabel}>
              SPEED: {speed}
            </Text>
            <Text style={styles.speedLabel}>
              {collision ? 'COLLISION!' : 'MOVING'}
            </Text>
          </View>

          <Text style={styles.observation}>
            MOTION CARRIES MOMENTUM
          </Text>

          <Pressable style={styles.primaryButton} onPress={doMomentum}>
            <Text style={styles.primaryText}>
              {collision ? 'COMPLETE' : 'LAUNCH BALL'}
            </Text>
          </Pressable>
        </View>
      )}

      {mode === 'machines' && (
        <View style={styles.lab}>
          <Text style={styles.machineQuestion}>
            CHOOSE A MACHINE FOR THE TASK
          </Text>

          <View style={styles.machineRow}>
            {MACHINE_OPTIONS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => chooseMachine(item.id)}
                style={[
                  styles.machineButton,
                  machine === item.id && styles.machineButtonActive,
                ]}
              >
                <Text style={styles.machineIcon}>{item.icon}</Text>
                <Text style={styles.machineLabel}>
                  {item.label}
                </Text>
                <Text style={styles.machineTask}>
                  {item.task}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.observation}>
            FORCE → MACHINE → USEFUL WORK
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          OBSERVE • INTERACT • DISCOVER
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },

  header: {
    alignItems: 'center',
    marginBottom: 16,
  },

  eyebrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 6,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
    textAlign: 'center',
  },

  subtitle: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 310,
  },

  lab: {
    alignItems: 'center',
    width: '100%',
  },

  track: {
    width: '88%',
    height: 100,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    justifyContent: 'center',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },

  ball: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD166',
  },

  observation: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 14,
  },

  primaryButton: {
    minWidth: 190,
    minHeight: 46,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
  },

  primaryText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  counter: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 9,
  },

  forceTrack: {
    width: '88%',
    height: 100,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    justifyContent: 'center',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },

  forceObject: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FF8FAB',
  },

  forceMeter: {
    alignItems: 'center',
    marginTop: 14,
  },

  meterLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  meterBars: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },

  meterBar: {
    width: 30,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  meterBarActive: {
    backgroundColor: '#FF8FAB',
  },

  surfaceScene: {
    width: '88%',
    height: 100,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    justifyContent: 'center',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },

  frictionBall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7DD3FC',
  },

  surfaceRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 13,
  },

  surfaceButton: {
    minWidth: 76,
    minHeight: 58,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  surfaceButtonActive: {
    borderColor: '#7DD3FC',
    backgroundColor: 'rgba(125,211,252,0.12)',
  },

  surfaceIcon: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  surfaceLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 3,
  },

  gravityScene: {
    width: '88%',
    height: 190,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  gravityEarth: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 12,
  },

  gravityObject: {
    color: '#C4B5FD',
    fontSize: 40,
    fontWeight: '900',
    marginTop: 18,
  },

  gravityGround: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(196,181,253,0.45)',
  },

  energyScene: {
    width: '88%',
    height: 170,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  energySpring: {
    alignItems: 'center',
  },

  energySpringText: {
    color: '#FDE68A',
    fontSize: 42,
    fontWeight: '900',
  },

  energyLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  energyBall: {
    color: '#FDE68A',
    fontSize: 38,
    fontWeight: '900',
    marginTop: 10,
  },

  collisionScene: {
    width: '88%',
    height: 120,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  collisionBall: {
    position: 'absolute',
    left: 25,
    color: '#7DD3FC',
    fontSize: 38,
    fontWeight: '900',
  },

  collisionBlue: {
    zIndex: 2,
  },

  collisionBallStatic: {
    position: 'absolute',
    right: 30,
    color: '#FCA5A5',
    fontSize: 38,
    fontWeight: '900',
  },

  speedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '82%',
    marginTop: 12,
  },

  speedLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  machineQuestion: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },

  machineRow: {
    flexDirection: 'row',
    gap: 8,
    width: '94%',
  },

  machineButton: {
    flex: 1,
    minHeight: 105,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  machineButtonActive: {
    borderColor: '#F0ABFC',
    backgroundColor: 'rgba(240,171,252,0.12)',
  },

  machineIcon: {
    color: '#F0ABFC',
    fontSize: 28,
  },

  machineLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 5,
  },

  machineTask: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 3,
  },

  footer: {
    alignItems: 'center',
    marginTop: 18,
  },

  footerText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
