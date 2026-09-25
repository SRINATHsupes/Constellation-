import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Material = {
  id: string;
  name: string;
  icon: string;
  property: string;
  uses: string;
  description: string;
};

const MATERIALS: Material[] = [
  {
    id: 'metal',
    name: 'METAL',
    icon: '⚙️',
    property: 'Strong + rigid',
    uses: 'Gears, tools, frames',
    description:
      'Metal can handle large forces, so it is useful for machines and structures.',
  },
  {
    id: 'wood',
    name: 'WOOD',
    icon: '🪵',
    property: 'Strong + workable',
    uses: 'Furniture, handles, structures',
    description:
      'Wood is relatively light and can be cut, shaped and joined.',
  },
  {
    id: 'plastic',
    name: 'PLASTIC',
    icon: '◈',
    property: 'Light + shapeable',
    uses: 'Cases, containers, parts',
    description:
      'Many plastics are light and can be formed into many different shapes.',
  },
  {
    id: 'glass',
    name: 'GLASS',
    icon: '◇',
    property: 'Hard + transparent',
    uses: 'Windows, lenses, screens',
    description:
      'Glass lets visible light pass through while providing a hard surface.',
  },
  {
    id: 'rubber',
    name: 'RUBBER',
    icon: '◉',
    property: 'Flexible + elastic',
    uses: 'Tyres, seals, grips',
    description:
      'Rubber can deform and return toward its original shape.',
  },
];

const OBJECTS = [
  {
    name: 'MACHINE GEAR',
    icon: '⚙️',
    answer: 'metal',
    clue: 'Needs strength and a rigid shape.',
  },
  {
    name: 'WINDOW',
    icon: '▣',
    answer: 'glass',
    clue: 'Needs to let light through.',
  },
  {
    name: 'TYRE',
    icon: '◉',
    answer: 'rubber',
    clue: 'Needs flexibility and grip.',
  },
  {
    name: 'CHAIR',
    icon: '▱',
    answer: 'wood',
    clue: 'Needs a strong material that can be shaped.',
  },
];

export default function MaterialsGame({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [selected, setSelected] = useState<Material>(
    MATERIALS[0],
  );
  const [objectIndex, setObjectIndex] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [matched, setMatched] = useState(false);

  const pulse = useMemo(
    () => new Animated.Value(0.7),
    [],
  );

  const scan = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const target = OBJECTS[objectIndex];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      pulse.stopAnimation();
    };
  }, [pulse]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      scan.stopAnimation();
    };
  }, [scan]);

  function chooseMaterial(material: Material) {
    setSelected(material);
    

    if (!discovered.includes(material.id)) {
      setDiscovered((current) => [
        ...current,
        material.id,
      ]);
    }

    if (material.id === target.answer) {
      setMatched(true);
    } else {
      setMatched(false);
    }
  }

  function nextObject() {
    if (objectIndex < OBJECTS.length - 1) {
      setObjectIndex((current) => current + 1);
      setMatched(false);
      
    } else {
      onComplete?.();
    }
  }

  const scanPosition = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 220],
  });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MATERIALS LAB
        </Text>

        <Text style={styles.title}>
          What should we build with?
        </Text>

        <Text style={styles.subtitle}>
          Touch a material. Watch its properties appear.
          Then use what you discovered.
        </Text>
      </View>

      <View style={styles.lab}>
        <View style={styles.scanner}>
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateX: scanPosition,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.materialSample,
              {
                opacity: pulse,
              },
            ]}
          >
            <Text style={styles.sampleIcon}>
              {selected.icon}
            </Text>
          </Animated.View>

          <View style={styles.scannerLabel}>
            <Text style={styles.scannerTitle}>
              MATERIAL SCANNER
            </Text>

            <Text style={styles.scannerStatus}>
              ANALYSING: {selected.name}
            </Text>
          </View>
        </View>

        <View style={styles.materialInfo}>
          <Text style={styles.materialName}>
            {selected.name}
          </Text>

          <Text style={styles.property}>
            {selected.property}
          </Text>

          <Text style={styles.description}>
            {selected.description}
          </Text>

          <View style={styles.useBox}>
            <Text style={styles.useLabel}>
              COMMON USES
            </Text>

            <Text style={styles.useText}>
              {selected.uses}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.materialRow}>
        {MATERIALS.map((material) => {
          const active =
            material.id === selected.id;

          const seen =
            discovered.includes(material.id);

          return (
            <Pressable
              key={material.id}
              onPress={() => chooseMaterial(material)}
              style={[
                styles.materialButton,
                active && styles.materialButtonActive,
              ]}
            >
              <Text style={styles.materialIcon}>
                {material.icon}
              </Text>

              <Text
                style={[
                  styles.materialButtonText,
                  active &&
                    styles.materialButtonTextActive,
                ]}
              >
                {material.name}
              </Text>

              {seen && (
                <View style={styles.discoveredDot} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buildChallenge}>
        <Text style={styles.challengeEyebrow}>
          BUILD CHALLENGE {objectIndex + 1}/
          {OBJECTS.length}
        </Text>

        <View style={styles.objectPreview}>
          <Text style={styles.objectIcon}>
            {target.icon}
          </Text>

          <View style={styles.objectInfo}>
            <Text style={styles.objectName}>
              {target.name}
            </Text>

            <Text style={styles.objectClue}>
              {target.clue}
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
            ? `✓ ${selected.name} fits this job`
            : 'Explore the materials and decide'}
        </Text>

        {matched && (
          <Pressable
            onPress={nextObject}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>
              {objectIndex < OBJECTS.length - 1
                ? 'NEXT OBJECT →'
                : 'FINISH MATERIALS LAB →'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.touchCount}>
          MATERIALS DISCOVERED: {discovered.length}/
          {MATERIALS.length}
        </Text>

        <Text style={styles.hint}>
          In manufacturing, the material changes what an object can do.
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
    maxWidth: 450,
  },

  lab: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 26,
    backgroundColor: '#07121B',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.2)',
    padding: 14,
  },

  scanner: {
    flex: 1,
    minHeight: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#03090D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,184,107,0.5)',
  },

  materialSample: {
    width: 92,
    height: 92,
    borderRadius: 22,
    backgroundColor: 'rgba(255,184,107,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,107,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sampleIcon: {
    fontSize: 45,
  },

  scannerLabel: {
    alignItems: 'center',
    marginTop: 12,
  },

  scannerTitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  scannerStatus: {
    color: '#FFB86B',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 4,
  },

  materialInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  materialName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  property: {
    color: '#FFB86B',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  description: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  useBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  useLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  useText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    marginTop: 4,
  },

  materialRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },

  materialButton: {
    flex: 1,
    minHeight: 76,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  materialButtonActive: {
    backgroundColor: 'rgba(255,184,107,0.09)',
    borderColor: 'rgba(255,184,107,0.55)',
  },

  materialIcon: {
    fontSize: 22,
  },

  materialButtonText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 5,
  },

  materialButtonTextActive: {
    color: '#FFB86B',
  },

  discoveredDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFB86B',
  },

  buildChallenge: {
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

  objectPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    gap: 12,
  },

  objectIcon: {
    width: 58,
    height: 58,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 31,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    overflow: 'hidden',
  },

  objectInfo: {
    flex: 1,
  },

  objectName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  objectClue: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  result: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 11,
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

  touchCount: {
    color: 'rgba(255,255,255,0.22)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  hint: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});
