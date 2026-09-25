import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Stage = {
  id: string;
  name: string;
  icon: string;
  action: string;
  explanation: string;
};

const STAGES: Stage[] = [
  {
    id: 'material',
    name: 'MATERIAL',
    icon: '▣',
    action: 'Choose the correct material',
    explanation:
      'A product begins with a suitable raw material.',
  },
  {
    id: 'shape',
    name: 'SHAPE',
    icon: '⚙',
    action: 'Machine the material',
    explanation:
      'Machines change raw material into useful shapes.',
  },
  {
    id: 'assemble',
    name: 'ASSEMBLE',
    icon: '⊕',
    action: 'Join the parts',
    explanation:
      'Separate parts are combined into a working product.',
  },
  {
    id: 'inspect',
    name: 'INSPECT',
    icon: '⌕',
    action: 'Check the product',
    explanation:
      'Inspection finds problems before a product reaches people.',
  },
];

const PRODUCTS = [
  {
    id: 'gear',
    name: 'METAL GEAR',
    icon: '⚙',
    requiredStages: [
      'material',
      'shape',
      'assemble',
      'inspect',
    ],
  },
  {
    id: 'wheel',
    name: 'MACHINE WHEEL',
    icon: '◉',
    requiredStages: [
      'material',
      'shape',
      'assemble',
      'inspect',
    ],
  },
];

export default function ProductionLineGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [productIndex, setProductIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<string[]>(
    [],
  );
  const [selectedStage, setSelectedStage] =
    useState<Stage>(STAGES[0]);
  const [running, setRunning] = useState(false);
  const [itemsMade, setItemsMade] = useState(0);

  const conveyor = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const machinePulse = useMemo(
    () => new Animated.Value(0),
    [],
  );

  useEffect(() => {
    if (!running) {
      conveyor.stopAnimation();
      machinePulse.stopAnimation();
      return;
    }

    const conveyorAnimation = Animated.loop(
      Animated.timing(conveyor, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(machinePulse, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(machinePulse, {
          toValue: 0,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    conveyorAnimation.start();
    pulseAnimation.start();

    return () => {
      conveyorAnimation.stop();
      pulseAnimation.stop();
    };
  }, [running, conveyor, machinePulse]);

  const product = PRODUCTS[productIndex];

  function activateStage(stage: Stage) {
    setSelectedStage(stage);
    setRunning(true);

    if (!completedStages.includes(stage.id)) {
      setCompletedStages((current) => [
        ...current,
        stage.id,
      ]);
    }
  }

  function resetLine() {
    setCompletedStages([]);
    setSelectedStage(STAGES[0]);
    setRunning(false);
  }

  function finishProduct() {
    if (productIndex < PRODUCTS.length - 1) {
      setProductIndex((current) => current + 1);
      setCompletedStages([]);
      setSelectedStage(STAGES[0]);
      setRunning(false);
      setItemsMade((current) => current + 1);
    } else {
      setItemsMade((current) => current + 1);
      onComplete?.();
    }
  }

  const beltOffset = conveyor.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 42],
  });

  const machineScale = machinePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const allComplete =
    completedStages.length === STAGES.length;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MINI FACTORY
        </Text>

        <Text style={styles.title}>
          Build {product.name}
        </Text>

        <Text style={styles.subtitle}>
          Run each station in order and watch a raw
          material become a finished product.
        </Text>
      </View>

      <View style={styles.factory}>
        <View style={styles.factoryTop}>
          <View>
            <Text style={styles.factoryLabel}>
              PRODUCTION LINE
            </Text>

            <Text style={styles.factoryProduct}>
              {product.icon} {product.name}
            </Text>
          </View>

          <View style={styles.progressBox}>
            <Text style={styles.progressNumber}>
              {completedStages.length}/{STAGES.length}
            </Text>

            <Text style={styles.progressLabel}>
              STATIONS
            </Text>
          </View>
        </View>

        <View style={styles.conveyorArea}>
          <View style={styles.conveyorTrack}>
            <Animated.View
              style={[
                styles.beltMarks,
                {
                  transform: [
                    {
                      translateX: beltOffset,
                    },
                  ],
                },
              ]}
            >
              {Array.from({ length: 14 }).map(
                (_, index) => (
                  <View
                    key={index}
                    style={styles.beltMark}
                  />
                ),
              )}
            </Animated.View>
          </View>

          <View style={styles.stationRow}>
            {STAGES.map((stage, index) => {
              const complete =
                completedStages.includes(stage.id);

              const selected =
                selectedStage.id === stage.id;

              return (
                <React.Fragment key={stage.id}>
                  <Pressable
                    onPress={() =>
                      activateStage(stage)
                    }
                    style={[
                      styles.station,
                      selected &&
                        styles.stationSelected,
                      complete &&
                        styles.stationComplete,
                    ]}
                  >
                    <Animated.Text
                      style={[
                        styles.stationIcon,
                        {
                          transform: [
                            {
                              scale:
                                selected
                                  ? machineScale
                                  : 1,
                            },
                          ],
                        },
                      ]}
                    >
                      {complete
                        ? '✓'
                        : stage.icon}
                    </Animated.Text>

                    <Text
                      style={[
                        styles.stationName,
                        complete &&
                          styles.stationNameComplete,
                      ]}
                    >
                      {stage.name}
                    </Text>

                    <Text style={styles.stationNumber}>
                      {index + 1}
                    </Text>
                  </Pressable>

                  {index < STAGES.length - 1 && (
                    <Text
                      style={[
                        styles.stationArrow,
                        completedStages.includes(
                          STAGES[index].id,
                        ) &&
                          styles.stationArrowActive,
                      ]}
                    >
                      →
                    </Text>
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <View style={styles.detail}>
          <View style={styles.detailIconBox}>
            <Text style={styles.detailIcon}>
              {selectedStage.icon}
            </Text>
          </View>

          <View style={styles.detailContent}>
            <Text style={styles.detailEyebrow}>
              STATION {STAGES.indexOf(selectedStage) + 1}
            </Text>

            <Text style={styles.detailTitle}>
              {selectedStage.name}
            </Text>

            <Text style={styles.detailAction}>
              {selectedStage.action}
            </Text>

            <Text style={styles.detailExplanation}>
              {selectedStage.explanation}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.factoryControls}>
        <Pressable
          onPress={() => activateStage(STAGES[0])}
          style={styles.runButton}
        >
          <Text style={styles.runButtonText}>
            {running
              ? 'LINE RUNNING'
              : 'START PRODUCTION LINE →'}
          </Text>
        </Pressable>

        <Pressable
          onPress={resetLine}
          style={styles.resetButton}
        >
          <Text style={styles.resetText}>
            RESET
          </Text>
        </Pressable>
      </View>

      <View style={styles.inspection}>
        <Text style={styles.inspectionEyebrow}>
          FACTORY STATUS
        </Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              allComplete &&
                styles.statusDotComplete,
            ]}
          />

          <Text style={styles.statusText}>
            {allComplete
              ? 'Production complete — product ready for inspection.'
              : `${completedStages.length} of ${STAGES.length} stations complete.`}
          </Text>
        </View>

        {allComplete && (
          <Pressable
            onPress={finishProduct}
            style={styles.finishButton}
          >
            <Text style={styles.finishText}>
              {productIndex < PRODUCTS.length - 1
                ? 'BUILD NEXT PRODUCT →'
                : 'FINISH PRODUCTION LAB →'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          MATERIAL → MACHINE → ASSEMBLE → INSPECT
        </Text>

        <Text style={styles.itemsText}>
          PRODUCTS COMPLETED: {itemsMade}
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

  factory: {
    borderRadius: 27,
    backgroundColor: '#07131B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    padding: 14,
  },

  factoryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  factoryLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  factoryProduct: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },

  progressBox: {
    minWidth: 65,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,184,107,0.07)',
    alignItems: 'center',
  },

  progressNumber: {
    color: '#FFB86B',
    fontSize: 15,
    fontWeight: '900',
  },

  progressLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  conveyorArea: {
    marginTop: 18,
    minHeight: 155,
    justifyContent: 'center',
  },

  conveyorTrack: {
    position: 'absolute',
    left: 15,
    right: 15,
    top: 91,
    height: 16,
    borderRadius: 9,
    backgroundColor: '#02070A',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.18)',
    overflow: 'hidden',
  },

  beltMarks: {
    flexDirection: 'row',
    gap: 17,
    alignItems: 'center',
    height: '100%',
  },

  beltMark: {
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: 'rgba(255,184,107,0.25)',
  },

  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  station: {
    width: 68,
    minHeight: 95,
    borderRadius: 16,
    backgroundColor: '#03090D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },

  stationSelected: {
    borderColor: 'rgba(255,184,107,0.6)',
    backgroundColor: 'rgba(255,184,107,0.08)',
  },

  stationComplete: {
    borderColor: 'rgba(255,184,107,0.42)',
  },

  stationIcon: {
    color: '#FFB86B',
    fontSize: 25,
  },

  stationName: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 6,
    textAlign: 'center',
  },

  stationNameComplete: {
    color: '#FFB86B',
  },

  stationNumber: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 4,
  },

  stationArrow: {
    color: 'rgba(255,255,255,0.16)',
    fontSize: 18,
    fontWeight: '900',
  },

  stationArrowActive: {
    color: 'rgba(255,184,107,0.7)',
  },

  detail: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 14,
    padding: 12,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },

  detailIconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: 'rgba(255,184,107,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailIcon: {
    color: '#FFB86B',
    fontSize: 25,
  },

  detailContent: {
    flex: 1,
  },

  detailEyebrow: {
    color: '#FFB86B',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  detailTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },

  detailAction: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
  },

  detailExplanation: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  factoryControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },

  runButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  runButtonText: {
    color: '#17100A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  resetButton: {
    minHeight: 44,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    fontWeight: '900',
  },

  inspection: {
    marginTop: 11,
    padding: 13,
    borderRadius: 18,
    backgroundColor: 'rgba(255,184,107,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.12)',
  },

  inspectionEyebrow: {
    color: '#FFB86B',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 7,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  statusDotComplete: {
    backgroundColor: '#FFB86B',
  },

  statusText: {
    flex: 1,
    color: 'rgba(255,255,255,0.48)',
    fontSize: 10,
    lineHeight: 15,
  },

  finishButton: {
    alignSelf: 'center',
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 13,
    backgroundColor: '#FFB86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  finishText: {
    color: '#17100A',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
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

  itemsText: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
  },
});
