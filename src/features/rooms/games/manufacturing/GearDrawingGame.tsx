import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type GearChoice = {
  id: string;
  label: string;
  size: number;
};

const GEARS: GearChoice[] = [
  {
    id: 'small',
    label: 'SMALL',
    size: 52,
  },
  {
    id: 'medium',
    label: 'MEDIUM',
    size: 72,
  },
  {
    id: 'large',
    label: 'LARGE',
    size: 92,
  },
];

const TARGETS = [
  {
    driver: 'large',
    output: 'small',
    clue: 'Copy the drawing: LARGE → SMALL',
  },
  {
    driver: 'small',
    output: 'large',
    clue: 'Copy the drawing: SMALL → LARGE',
  },
  {
    driver: 'medium',
    output: 'small',
    clue: 'Copy the drawing: MEDIUM → SMALL',
  },
];

export default function GearDrawingGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [driver, setDriver] = useState('medium');
  const [output, setOutput] = useState('medium');
  const [matched, setMatched] = useState(false);

  const target = TARGETS[targetIndex];

  function checkDrawing() {
    const correct =
      driver === target.driver &&
      output === target.output;

    setMatched(correct);
  }

  function nextDrawing() {
    if (targetIndex < TARGETS.length - 1) {
      setTargetIndex((value) => value + 1);
      setMatched(false);
      setDriver('medium');
      setOutput('medium');
    } else {
      onComplete?.();
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          ENGINEERING DRAWING LAB
        </Text>

        <Text style={styles.title}>
          Draw the Gear System
        </Text>

        <Text style={styles.subtitle}>
          Recreate the gear arrangement you observed.
        </Text>
      </View>

      <View style={styles.board}>
        <Text style={styles.boardLabel}>
          OBSERVE THE DESIGN
        </Text>

        <View style={styles.targetDrawing}>
          <View
            style={[
              styles.targetGear,
              {
                width:
                  target.driver === 'small'
                    ? 52
                    : target.driver === 'medium'
                      ? 72
                      : 92,
                height:
                  target.driver === 'small'
                    ? 52
                    : target.driver === 'medium'
                      ? 72
                      : 92,
                borderRadius:
                  target.driver === 'small'
                    ? 26
                    : target.driver === 'medium'
                      ? 36
                      : 46,
              },
            ]}
          >
            <Text style={styles.gearText}>⚙</Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View
            style={[
              styles.targetGear,
              {
                width:
                  target.output === 'small'
                    ? 52
                    : target.output === 'medium'
                      ? 72
                      : 92,
                height:
                  target.output === 'small'
                    ? 52
                    : target.output === 'medium'
                      ? 36
                      : 46,
                borderRadius:
                  target.output === 'small'
                    ? 26
                    : target.output === 'medium'
                      ? 36
                      : 46,
              },
            ]}
          >
            <Text style={styles.gearText}>⚙</Text>
          </View>
        </View>

        <Text style={styles.targetClue}>
          {target.clue}
        </Text>
      </View>

      <View style={styles.selectorRow}>
        <View style={styles.selector}>
          <Text style={styles.selectorTitle}>
            DRAW DRIVER
          </Text>

          <View style={styles.options}>
            {GEARS.map((gear) => (
              <Pressable
                key={`driver-${gear.id}`}
                onPress={() => {
                  setDriver(gear.id);
                  setMatched(false);
                }}
                style={[
                  styles.option,
                  driver === gear.id &&
                    styles.optionActive,
                ]}
              >
                <Text style={styles.optionGear}>
                  ⚙
                </Text>

                <Text style={styles.optionText}>
                  {gear.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.selector}>
          <Text style={styles.selectorTitle}>
            DRAW OUTPUT
          </Text>

          <View style={styles.options}>
            {GEARS.map((gear) => (
              <Pressable
                key={`output-${gear.id}`}
                onPress={() => {
                  setOutput(gear.id);
                  setMatched(false);
                }}
                style={[
                  styles.option,
                  output === gear.id &&
                    styles.optionActive,
                ]}
              >
                <Text style={styles.optionGear}>
                  ⚙
                </Text>

                <Text style={styles.optionText}>
                  {gear.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.challenge}>
        {!matched ? (
          <>
            <Text style={styles.challengeText}>
              Build your drawing, then compare it with the observed design.
            </Text>

            <Pressable
              onPress={checkDrawing}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                CHECK MY DRAWING →
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.success}>
              ✓ DESIGN MATCHED
            </Text>

            <Text style={styles.detail}>
              You translated an observed mechanism into a simple engineering design.
            </Text>

            <Pressable
              onPress={nextDrawing}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {targetIndex < TARGETS.length - 1
                  ? 'NEXT DESIGN →'
                  : 'FINISH DRAWING LAB →'}
              </Text>
            </Pressable>
          </>
        )}
      </View>

      <Text style={styles.footer}>
        OBSERVE → DRAW → COMPARE → IMPROVE
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
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
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
    textAlign: 'center',
    marginTop: 6,
  },

  board: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#07131B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    alignItems: 'center',
  },

  boardLabel: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  targetDrawing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    minHeight: 125,
    marginTop: 10,
  },

  targetGear: {
    backgroundColor: 'rgba(255,184,107,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255,184,107,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gearText: {
    color: '#FFB86B',
    fontSize: 30,
  },

  arrow: {
    color: '#FFB86B',
    fontSize: 24,
    fontWeight: '900',
  },

  targetClue: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },

  selectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  selector: {
    flex: 1,
  },

  selectorTitle: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  options: {
    flexDirection: 'row',
    gap: 5,
  },

  option: {
    flex: 1,
    minHeight: 60,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionActive: {
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderColor: '#FFB86B',
  },

  optionGear: {
    color: '#FFB86B',
    fontSize: 20,
  },

  optionText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 3,
  },

  challenge: {
    marginTop: 12,
    padding: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255,184,107,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.12)',
    alignItems: 'center',
  },

  challengeText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  button: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },

  buttonText: {
    color: '#17100A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  success: {
    color: '#FFB86B',
    fontSize: 11,
    fontWeight: '900',
  },

  detail: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 5,
  },

  footer: {
    color: 'rgba(255,184,107,0.55)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
  },
});
