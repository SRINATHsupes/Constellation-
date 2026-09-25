import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Tool = {
  id: string;
  name: string;
  icon: string;
  motion: string;
  job: string;
  explanation: string;
};

const TOOLS: Tool[] = [
  {
    id: 'hammer',
    name: 'HAMMER',
    icon: '🔨',
    motion: 'HIT',
    job: 'Joining or shaping',
    explanation:
      'A hammer transfers force through a quick impact.',
  },
  {
    id: 'screwdriver',
    name: 'SCREWDRIVER',
    icon: '🪛',
    motion: 'ROTATE',
    job: 'Driving screws',
    explanation:
      'A screwdriver uses rotation to turn a screw.',
  },
  {
    id: 'wrench',
    name: 'WRENCH',
    icon: '🔧',
    motion: 'TURN',
    job: 'Turning fasteners',
    explanation:
      'A wrench applies turning force to a nut or bolt.',
  },
  {
    id: 'pliers',
    name: 'PLIERS',
    icon: '🗜️',
    motion: 'SQUEEZE',
    job: 'Grip and bend',
    explanation:
      'Pliers multiply your hand movement to grip an object.',
  },
];

const TASKS = [
  {
    name: 'DRIVE A SCREW',
    icon: '🔩',
    answer: 'screwdriver',
    clue: 'This job needs rotation.',
  },
  {
    name: 'TURN A BOLT',
    icon: '🔧',
    answer: 'wrench',
    clue: 'This job needs controlled turning force.',
  },
  {
    name: 'GRIP A SMALL PART',
    icon: '🗜️',
    answer: 'pliers',
    clue: 'This job needs a strong grip.',
  },
  {
    name: 'DELIVER A QUICK IMPACT',
    icon: '⬇️',
    answer: 'hammer',
    clue: 'This job needs a short hit.',
  },
];

export default function ToolsGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [selected, setSelected] = useState<Tool>(
    TOOLS[0],
  );
  const [taskIndex, setTaskIndex] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [matched, setMatched] = useState(false);
  const [touches, setTouches] = useState(0);

  const movement = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const pulse = useMemo(
    () => new Animated.Value(0.75),
    [],
  );

  const task = TASKS[taskIndex];

  useEffect(() => {
    movement.setValue(0);

    const animation =
      selected.motion === 'ROTATE' ||
      selected.motion === 'TURN'
        ? Animated.loop(
            Animated.timing(movement, {
              toValue: 1,
              duration: 1100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          )
        : Animated.loop(
            Animated.sequence([
              Animated.timing(movement, {
                toValue: 1,
                duration: 350,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(movement, {
                toValue: 0,
                duration: 350,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
          );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [selected, movement]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.75,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      pulse.stopAnimation();
    };
  }, [pulse]);

  function chooseTool(tool: Tool) {
    setSelected(tool);
    setTouches((current) => current + 1);

    if (!discovered.includes(tool.id)) {
      setDiscovered((current) => [
        ...current,
        tool.id,
      ]);
    }

    setMatched(tool.id === task.answer);
  }

  function nextTask() {
    if (taskIndex < TASKS.length - 1) {
      setTaskIndex((current) => current + 1);
      setMatched(false);
      setTouches((current) => current + 1);
    } else {
      onComplete?.();
    }
  }

  const rotation = movement.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const toolMotion =
    selected.motion === 'HIT'
      ? movement.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['-18deg', '18deg', '-18deg'],
        })
      : selected.motion === 'SQUEEZE'
        ? movement.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '-12deg', '0deg'],
          })
        : rotation;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          TOOLS WORKSHOP
        </Text>

        <Text style={styles.title}>
          Every tool creates a movement
        </Text>

        <Text style={styles.subtitle}>
          Touch a tool and watch what it does.
          Then use that movement for a real manufacturing job.
        </Text>
      </View>

      <View style={styles.workbench}>
        <View style={styles.toolAnimation}>
          <Animated.View
            style={[
              styles.toolDisplay,
              {
                opacity: pulse,
                transform: [
                  {
                    rotate: toolMotion,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.toolEmoji}>
              {selected.icon}
            </Text>
          </Animated.View>

          <Text style={styles.animationLabel}>
            {selected.motion}
          </Text>

          <View style={styles.motionTrack}>
            <View style={styles.motionLine} />

            <View style={styles.motionArrow}>
              <Text style={styles.arrowText}>
                →
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.toolInfo}>
          <Text style={styles.toolName}>
            {selected.name}
          </Text>

          <Text style={styles.toolJob}>
            {selected.job}
          </Text>

          <Text style={styles.explanation}>
            {selected.explanation}
          </Text>

          <View style={styles.observation}>
            <Text style={styles.observationLabel}>
              OBSERVATION
            </Text>

            <Text style={styles.observationText}>
              {selected.name} transfers your action into
              {selected.motion.toLowerCase()}.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.toolRow}>
        {TOOLS.map((tool) => {
          const active =
            selected.id === tool.id;

          const seen =
            discovered.includes(tool.id);

          return (
            <Pressable
              key={tool.id}
              onPress={() => chooseTool(tool)}
              style={[
                styles.toolButton,
                active && styles.toolButtonActive,
              ]}
            >
              <Text style={styles.toolButtonIcon}>
                {tool.icon}
              </Text>

              <Text
                style={[
                  styles.toolButtonText,
                  active &&
                    styles.toolButtonTextActive,
                ]}
              >
                {tool.name}
              </Text>

              {seen && (
                <View style={styles.seenDot} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.challenge}>
        <Text style={styles.challengeEyebrow}>
          WORKSHOP TASK {taskIndex + 1}/{TASKS.length}
        </Text>

        <View style={styles.taskRow}>
          <View style={styles.taskIconBox}>
            <Text style={styles.taskIcon}>
              {task.icon}
            </Text>
          </View>

          <View style={styles.taskInfo}>
            <Text style={styles.taskName}>
              {task.name}
            </Text>

            <Text style={styles.taskClue}>
              {task.clue}
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
            ? `✓ ${selected.name} can do this job`
            : 'Explore the tools and observe their movement'}
        </Text>

        {matched && (
          <Pressable
            onPress={nextTask}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>
              {taskIndex < TASKS.length - 1
                ? 'NEXT WORKSHOP TASK →'
                : 'FINISH TOOLS WORKSHOP →'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.discovery}>
          TOOLS DISCOVERED: {discovered.length}/{TOOLS.length}
        </Text>

        <Text style={styles.hint}>
          Manufacturing starts with understanding what a tool can do.
        </Text>

        <Text style={styles.touches}>
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

  workbench: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 27,
    backgroundColor: '#07131B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    padding: 14,
  },

  toolAnimation: {
    flex: 1,
    minHeight: 205,
    borderRadius: 21,
    backgroundColor: '#030A0E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  toolDisplay: {
    width: 105,
    height: 105,
    borderRadius: 25,
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolEmoji: {
    fontSize: 48,
  },

  animationLabel: {
    color: '#FFB86B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 10,
  },

  motionTrack: {
    width: '75%',
    height: 25,
    justifyContent: 'center',
    marginTop: 3,
  },

  motionLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,184,107,0.22)',
  },

  motionArrow: {
    position: 'absolute',
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: 'rgba(255,184,107,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: '#FFB86B',
    fontSize: 15,
    fontWeight: '900',
  },

  toolInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  toolName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  toolJob: {
    color: '#FFB86B',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  explanation: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 11,
  },

  observation: {
    marginTop: 13,
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  observationLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  observationText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  toolRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 10,
  },

  toolButton: {
    flex: 1,
    minHeight: 76,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolButtonActive: {
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderColor: 'rgba(255,184,107,0.55)',
  },

  toolButtonIcon: {
    fontSize: 23,
  },

  toolButtonText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 5,
  },

  toolButtonTextActive: {
    color: '#FFB86B',
  },

  seenDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFB86B',
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
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  taskIcon: {
    fontSize: 29,
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

  discovery: {
    color: 'rgba(255,184,107,0.7)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  hint: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },

  touches: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
  },
});
