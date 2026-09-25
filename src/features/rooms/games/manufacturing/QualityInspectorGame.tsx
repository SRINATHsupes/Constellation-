import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Inspection = {
  id: string;
  name: string;
  icon: string;
  description: string;
  tolerance: string;
  correct: 'pass' | 'reject';
};

const INSPECTIONS: Inspection[] = [
  {
    id: 'gear',
    name: 'GEAR TEETH',
    icon: '⚙',
    description:
      'Check whether every tooth is complete and evenly shaped.',
    tolerance: 'No missing teeth',
    correct: 'reject',
  },
  {
    id: 'shaft',
    name: 'SHAFT DIAMETER',
    icon: '◎',
    description:
      'Measure the shaft and compare it with the required size.',
    tolerance: '10.0 mm ± 0.2 mm',
    correct: 'pass',
  },
  {
    id: 'surface',
    name: 'SURFACE',
    icon: '▤',
    description:
      'Look for a deep crack that could weaken the component.',
    tolerance: 'No deep cracks',
    correct: 'reject',
  },
  {
    id: 'assembly',
    name: 'ASSEMBLY',
    icon: '⊕',
    description:
      'Check that the moving parts are connected correctly.',
    tolerance: 'All parts connected',
    correct: 'pass',
  },
];

const MEASUREMENTS = [
  '9.4 mm',
  '9.8 mm',
  '10.0 mm',
  '10.1 mm',
  '10.6 mm',
];

export default function QualityInspectorGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [inspectionIndex, setInspectionIndex] = useState(0);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<string | null>(null);
  const [, setDecision] = useState<
    'pass' | 'reject' | null
  >(null);
  const [result, setResult] = useState<
    'correct' | 'wrong' | null
  >(null);
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [inspections, setInspections] = useState(0);

  const scanPosition = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const productGlow = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const current = INSPECTIONS[inspectionIndex];

  useEffect(() => {
    if (!scanning) {
      scanPosition.stopAnimation();
      return;
    }

    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(scanPosition, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanPosition, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    scan.start();

    return () => {
      scan.stop();
    };
  }, [scanning, scanPosition]);

  useEffect(() => {
    if (!result) {
      productGlow.stopAnimation();
      productGlow.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(productGlow, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(productGlow, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [result, productGlow]);

  function startInspection() {
    setScanning(true);
    setInspections((value) => value + 1);
  }

  function selectMeasurement(value: string) {
    setSelectedMeasurement(value);
    setResult(null);
  }

  function submitMeasurement() {
    if (!selectedMeasurement) {
      return;
    }

    const numericValue = Number.parseFloat(
      selectedMeasurement,
    );

    const valid =
      numericValue >= 9.8 &&
      numericValue <= 10.2;

    setDecision(valid ? 'pass' : 'reject');
    setResult(
      valid ===
        (current.correct === 'pass')
        ? 'correct'
        : 'wrong',
    );
    setScanning(false);
  }

  function submitDecision(
    nextDecision: 'pass' | 'reject',
  ) {
    setDecision(nextDecision);

    const correct =
      nextDecision === current.correct;

    setResult(correct ? 'correct' : 'wrong');
    setScanning(false);
  }

  function nextInspection() {
    if (result !== 'correct') {
      return;
    }

    setCompleted((items) => [
      ...items,
      current.id,
    ]);

    if (inspectionIndex < INSPECTIONS.length - 1) {
      setInspectionIndex((value) => value + 1);
      setSelectedMeasurement(null);
      
      setResult(null);
      setScanning(false);
    } else {
      onComplete?.();
    }
  }

  const scanTranslate = scanPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-115, 115],
  });

  const glowOpacity = productGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.22],
  });

  const isMeasurement =
    current.id === 'shaft';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          QUALITY INSPECTION LAB
        </Text>

        <Text style={styles.title}>
          Inspect before it leaves the factory
        </Text>

        <Text style={styles.subtitle}>
          Look closely, measure carefully, and decide
          whether each component should pass inspection.
        </Text>
      </View>

      <View style={styles.inspector}>
        <View style={styles.productPanel}>
          <Text style={styles.panelLabel}>
            COMPONENT UNDER INSPECTION
          </Text>

          <View style={styles.productStage}>
            <Animated.View
              style={[
                styles.glow,
                {
                  opacity: glowOpacity,
                },
              ]}
            />

            <Text style={styles.productIcon}>
              {current.icon}
            </Text>

            {scanning && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateX:
                          scanTranslate,
                      },
                    ],
                  },
                ]}
              />
            )}
          </View>

          <Text style={styles.productName}>
            {current.name}
          </Text>

          <Text style={styles.productDescription}>
            {current.description}
          </Text>

          <View style={styles.tolerance}>
            <Text style={styles.toleranceLabel}>
              SPECIFICATION
            </Text>

            <Text style={styles.toleranceValue}>
              {current.tolerance}
            </Text>
          </View>
        </View>

        <View style={styles.controlPanel}>
          <Text style={styles.panelLabel}>
            INSPECTOR CONSOLE
          </Text>

          <View style={styles.status}>
            <View
              style={[
                styles.statusLight,
                scanning &&
                  styles.statusLightActive,
                result === 'correct' &&
                  styles.statusLightCorrect,
                result === 'wrong' &&
                  styles.statusLightWrong,
              ]}
            />

            <Text style={styles.statusText}>
              {scanning
                ? 'SCANNING COMPONENT...'
                : result === 'correct'
                  ? 'INSPECTION CORRECT'
                  : result === 'wrong'
                    ? 'CHECK THE COMPONENT AGAIN'
                    : 'READY TO INSPECT'}
            </Text>
          </View>

          {!isMeasurement && !result && (
            <>
              <Text style={styles.question}>
                {current.id === 'gear'
                  ? 'Are all gear teeth complete?'
                  : current.id === 'surface'
                    ? 'Does the surface contain a deep crack?'
                    : 'Are all parts connected correctly?'}
              </Text>

              <View style={styles.decisionRow}>
                <Pressable
                  onPress={() =>
                    submitDecision('pass')
                  }
                  style={[
                    styles.decisionButton,
                    styles.passButton,
                  ]}
                >
                  <Text style={styles.decisionIcon}>
                    ✓
                  </Text>

                  <Text style={styles.decisionText}>
                    PASS
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    submitDecision('reject')
                  }
                  style={[
                    styles.decisionButton,
                    styles.rejectButton,
                  ]}
                >
                  <Text style={styles.decisionIcon}>
                    ×
                  </Text>

                  <Text style={styles.decisionText}>
                    REJECT
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {isMeasurement && !result && (
            <>
              <Text style={styles.question}>
                Select the measured diameter.
              </Text>

              <View style={styles.measurementGrid}>
                {MEASUREMENTS.map((value) => (
                  <Pressable
                    key={value}
                    onPress={() =>
                      selectMeasurement(value)
                    }
                    style={[
                      styles.measurement,
                      selectedMeasurement === value &&
                        styles.measurementActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.measurementText,
                        selectedMeasurement === value &&
                          styles.measurementTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={submitMeasurement}
                disabled={!selectedMeasurement}
                style={[
                  styles.inspectButton,
                  !selectedMeasurement &&
                    styles.inspectButtonDisabled,
                ]}
              >
                <Text style={styles.inspectButtonText}>
                  CHECK MEASUREMENT →
                </Text>
              </Pressable>
            </>
          )}

          {result && (
            <View style={styles.resultBox}>
              <Text
                style={[
                  styles.resultTitle,
                  result === 'correct'
                    ? styles.correct
                    : styles.wrong,
                ]}
              >
                {result === 'correct'
                  ? '✓ CORRECT INSPECTION'
                  : '✕ NOT QUITE'}
              </Text>

              <Text style={styles.resultText}>
                {result === 'correct'
                  ? current.correct === 'pass'
                    ? 'The component meets the specification and can continue.'
                    : 'The defect means the component should be rejected.'
                  : current.correct === 'pass'
                    ? 'This component meets the specification. It can pass inspection.'
                    : 'A defect is present. This component should be rejected.'}
              </Text>

              {result === 'correct' && (
                <Pressable
                  onPress={nextInspection}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextText}>
                    {inspectionIndex <
                    INSPECTIONS.length - 1
                      ? 'NEXT COMPONENT →'
                      : 'FINISH QUALITY LAB →'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {!result && (
            <Pressable
              onPress={startInspection}
              style={styles.scanButton}
            >
              <Text style={styles.scanButtonText}>
                {scanning
                  ? 'INSPECTING...'
                  : 'START INSPECTION'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.progress}>
        {INSPECTIONS.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.progressNode,
              completed.includes(item.id) &&
                styles.progressNodeComplete,
              index === inspectionIndex &&
                styles.progressNodeCurrent,
            ]}
          >
            <Text
              style={[
                styles.progressIcon,
                completed.includes(item.id) &&
                  styles.progressIconComplete,
              ]}
            >
              {completed.includes(item.id)
                ? '✓'
                : item.icon}
            </Text>

            <Text style={styles.progressName}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          OBSERVE → MEASURE → COMPARE → DECIDE
        </Text>

        <Text style={styles.inspectionCount}>
          INSPECTIONS: {inspections}
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
    maxWidth: 470,
  },

  inspector: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 27,
    backgroundColor: '#07131B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    padding: 14,
  },

  productPanel: {
    flex: 1,
    minHeight: 350,
    borderRadius: 21,
    backgroundColor: '#03090D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 13,
    alignItems: 'center',
  },

  controlPanel: {
    flex: 1,
    minHeight: 350,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  panelLabel: {
    color: 'rgba(255,255,255,0.27)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  productStage: {
    width: 190,
    height: 190,
    marginTop: 20,
    borderRadius: 28,
    backgroundColor: '#02070A',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFB86B',
  },

  productIcon: {
    color: '#FFB86B',
    fontSize: 92,
    zIndex: 2,
  },

  scanLine: {
    position: 'absolute',
    width: 3,
    height: 180,
    backgroundColor: '#FFB86B',
    opacity: 0.65,
    zIndex: 3,
  },

  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 12,
  },

  productDescription: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    maxWidth: 240,
    marginTop: 5,
  },

  tolerance: {
    marginTop: 11,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255,184,107,0.05)',
    alignItems: 'center',
  },

  toleranceLabel: {
    color: 'rgba(255,255,255,0.23)',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 1,
  },

  toleranceValue: {
    color: '#FFB86B',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 15,
    padding: 9,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  statusLight: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  statusLightActive: {
    backgroundColor: '#FFB86B',
  },

  statusLightCorrect: {
    backgroundColor: '#9EF2B5',
  },

  statusLightWrong: {
    backgroundColor: '#FF8A8A',
  },

  statusText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  question: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
  },

  decisionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 13,
  },

  decisionButton: {
    flex: 1,
    minHeight: 70,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  passButton: {
    backgroundColor: 'rgba(158,242,181,0.06)',
    borderColor: 'rgba(158,242,181,0.22)',
  },

  rejectButton: {
    backgroundColor: 'rgba(255,138,138,0.06)',
    borderColor: 'rgba(255,138,138,0.22)',
  },

  decisionIcon: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },

  decisionText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 3,
  },

  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 13,
  },

  measurement: {
    minWidth: 66,
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  measurementActive: {
    backgroundColor: 'rgba(255,184,107,0.1)',
    borderColor: 'rgba(255,184,107,0.55)',
  },

  measurementText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '900',
  },

  measurementTextActive: {
    color: '#FFB86B',
  },

  inspectButton: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },

  inspectButtonDisabled: {
    opacity: 0.35,
  },

  inspectButtonText: {
    color: '#17100A',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  scanButton: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(255,184,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  scanButtonText: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  resultBox: {
    marginTop: 18,
    padding: 13,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },

  resultTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  correct: {
    color: '#9EF2B5',
  },

  wrong: {
    color: '#FF8A8A',
  },

  resultText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 6,
  },

  nextButton: {
    minHeight: 42,
    paddingHorizontal: 17,
    borderRadius: 13,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  nextText: {
    color: '#17100A',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
    marginTop: 10,
  },

  progressNode: {
    flex: 1,
    minHeight: 63,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressNodeComplete: {
    borderColor: 'rgba(158,242,181,0.3)',
    backgroundColor: 'rgba(158,242,181,0.04)',
  },

  progressNodeCurrent: {
    borderColor: 'rgba(255,184,107,0.4)',
  },

  progressIcon: {
    color: '#FFB86B',
    fontSize: 18,
  },

  progressIconComplete: {
    color: '#9EF2B5',
  },

  progressName: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 6,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
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

  inspectionCount: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
  },
});
