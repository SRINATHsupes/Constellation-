import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { SvgUri } from 'react-native-svg';
import type { LessonContent, VisualType } from './lesson-content';

function ConceptAnimation({
  type,
}: {
  type?: VisualType;
}) {
  const movement = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(movement, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(movement, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [movement]);

  const waveScale = movement.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.15],
  });

  const slide = movement.interpolate({
    inputRange: [0, 1],
    outputRange: [-35, 35],
  });

  const rotate = movement.interpolate({
    inputRange: [0, 1],
    outputRange: ['-12deg', '12deg'],
  });

  if (type === 'vibration') {
    return (
      <View style={styles.animationArea}>
        <Animated.View
          style={[
            styles.vibrationSource,
            { transform: [{ scaleX: waveScale }] },
          ]}
        />
        <View style={styles.waveRow}>
          <Text style={styles.wave}>〰〰〰〰〰</Text>
        </View>
        <Text style={styles.animationCaption}>
          vibration → sound
        </Text>
      </View>
    );
  }

  if (type === 'frequency') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.frequencyRow}>
          <Animated.View
            style={[
              styles.waveBar,
              { height: 38, transform: [{ scaleY: waveScale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.waveBar,
              { height: 65, transform: [{ scaleY: waveScale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.waveBar,
              { height: 92, transform: [{ scaleY: waveScale }] },
            ]}
          />
        </View>

        <View style={styles.frequencyLabels}>
          <Text style={styles.smallLabel}>LOW</Text>
          <Text style={styles.smallLabel}>MEDIUM</Text>
          <Text style={styles.smallLabel}>HIGH</Text>
        </View>
      </View>
    );
  }

  if (type === 'rhythm') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.rhythmRow}>
          {[0, 1, 2, 3].map((item) => (
            <Animated.View
              key={item}
              style={[
                styles.beat,
                {
                  transform: [
                    {
                      scale:
                        item === 1 || item === 3
                          ? waveScale
                          : 1,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.beatText}>
                {item === 1 ? '—' : '•'}
              </Text>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.animationCaption}>
          sound + silence + pattern
        </Text>
      </View>
    );
  }

  if (type === 'melody') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.melodyPath}>
          {[25, 55, 35, 80, 50].map((height, index) => (
            <Animated.View
              key={index}
              style={[
                styles.note,
                {
                  bottom: height,
                  transform: [{ translateY: slide }],
                },
              ]}
            >
              <Text style={styles.noteText}>●</Text>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.animationCaption}>
          pitch → sequence → melody
        </Text>
      </View>
    );
  }

  if (type === 'circuit') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.circuitBoard}>
          <View style={styles.circuitTopRow}>
            <View style={styles.circuitBattery}>
              <Text style={styles.circuitBatteryText}>+</Text>
              <View style={styles.batteryPlate} />
              <View style={styles.batteryPlateSmall} />
              <Text style={styles.circuitBatteryText}>−</Text>
            </View>

            <Text style={styles.circuitWire}>━━━━</Text>

            <View style={styles.circuitSwitch}>
              <View style={styles.switchBase} />
              <Animated.View
                style={[
                  styles.switchArm,
                  {
                    transform: [
                      {
                        rotate: movement.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['-28deg', '8deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>

            <Text style={styles.circuitWire}>━━━━</Text>
          </View>

          <View style={styles.circuitBulbRow}>
            <View style={styles.circuitWireVertical} />

            <Animated.View
              style={[
                styles.circuitBulb,
                {
                  transform: [{ scale: waveScale }],
                  opacity: movement.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.45, 1],
                  }),
                },
              ]}
            >
              <Text style={styles.circuitBulbText}>💡</Text>
            </Animated.View>

            <View style={styles.circuitWireVertical} />
          </View>

          <View style={styles.circuitReturnWire}>
            <Text style={styles.circuitWire}>━━━━━━━━━━━━</Text>
          </View>
        </View>

        <Text style={styles.animationCaption}>
          open → close → complete path → light
        </Text>
      </View>
    );
  }

  if (type === 'binary' || type === 'code') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.binaryRow}>
          {[0, 1, 1, 0, 1].map((value, index) => (
            <Animated.View
              key={index}
              style={[
                styles.binaryBit,
                index % 2 === 0 && {
                  transform: [{ scale: waveScale }],
                },
              ]}
            >
              <Text style={styles.binaryText}>
                {value}
              </Text>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.animationCaption}>
          {type === 'code'
            ? 'bits → information'
            : 'two states → binary'}
        </Text>
      </View>
    );
  }

  if (
    type === 'numbers' ||
    type === 'base' ||
    type === 'mental' ||
    type === 'crosswise' ||
    type === 'patterns'
  ) {
    return (
      <View style={styles.animationArea}>
        <View style={styles.numberRow}>
          <Animated.View
            style={[
              styles.numberCard,
              { transform: [{ translateY: slide }] },
            ]}
          >
            <Text style={styles.numberText}>98</Text>
          </Animated.View>

          <Text style={styles.numberOperator}>
            {type === 'crosswise' ? '×' : '↔'}
          </Text>

          <Animated.View
            style={[
              styles.numberCard,
              { transform: [{ translateY: slide }] },
            ]}
          >
            <Text style={styles.numberText}>
              {type === 'base' ? '100' : '97'}
            </Text>
          </Animated.View>
        </View>

        <Text style={styles.animationCaption}>
          {type === 'crosswise'
            ? 'break → connect → calculate'
            : type === 'patterns'
              ? 'numbers reveal relationships'
              : 'see the relationship'}
        </Text>
      </View>
    );
  }

  if (type === 'shopping') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.shoppingRow}>
          <View style={styles.priceCard}>
            <Text style={styles.price}>₹80</Text>
          </View>

          <Text style={styles.plus}>+</Text>

          <View style={styles.priceCard}>
            <Text style={styles.price}>₹20</Text>
          </View>

          <Text style={styles.plus}>=</Text>

          <View style={styles.totalCard}>
            <Text style={styles.price}>₹100</Text>
          </View>
        </View>

        <Text style={styles.animationCaption}>
          mental maths in everyday life
        </Text>
      </View>
    );
  }

  if (
    type === 'drawing' ||
    type === 'paper' ||
    type === 'model'
  ) {
    return (
      <View style={styles.animationArea}>
        <Animated.View
          style={[
            styles.artShape,
            {
              transform: [
                { scale: waveScale },
                { rotate },
              ],
            },
          ]}
        >
          <Text style={styles.artShapeText}>
            {type === 'drawing'
              ? '○ △ □'
              : type === 'paper'
                ? '▱'
                : '◇'}
          </Text>
        </Animated.View>

        <Text style={styles.animationCaption}>
          {type === 'drawing'
            ? 'shape → form → drawing'
            : type === 'paper'
              ? 'flat → folded → structure'
              : 'template → model'}
        </Text>
      </View>
    );
  }

  if (type === 'food') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.foodRow}>
          <Text style={styles.foodIcon}>🥦</Text>
          <Text style={styles.foodIcon}>🥚</Text>
          <Text style={styles.foodIcon}>🌾</Text>
          <Text style={styles.foodIcon}>🍎</Text>
        </View>

        <Text style={styles.animationCaption}>
          different foods provide different nutrients
        </Text>
      </View>
    );
  }

  if (type === 'humanity') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.peopleRow}>
          <Text style={styles.person}>●</Text>
          <Text style={styles.connection}>↔</Text>
          <Text style={styles.person}>●</Text>
          <Text style={styles.connection}>↔</Text>
          <Text style={styles.person}>●</Text>
        </View>

        <Text style={styles.animationCaption}>
          people connect through communication and cooperation
        </Text>
      </View>
    );
  }

  if (type === 'nature') {
    return (
      <View style={styles.animationArea}>
        <View style={styles.natureRow}>
          <Text style={styles.natureIcon}>☀</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.natureIcon}>🌿</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.natureIcon}>🐛</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.natureIcon}>🐦</Text>
        </View>

        <Text style={styles.animationCaption}>
          living things are connected
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.animationArea}>
      <Text style={styles.animationCaption}>
        discover the idea
      </Text>
    </View>
  );
}

export default function VisualLesson({
  content,
}: {
  content: LessonContent;
}) {
  const player = useAudioPlayer(
    content.sound ??
      require('../../../assets/audio/music/middle.wav'),
  );

  const playSound = () => {
    if (!content.showSound || !content.sound) return;

    player.seekTo(0);
    player.play();
  };

  const imageSource = content.image;

  const manufacturingVisuals = [
    'gear',
    'gear-direction',
    'gear-size',
    'gear-train',
    'machine',
    'gear-drawing',
  ];

  const electronicsVisuals = [
    'water',
    'pipes',
    'logic',
    'circuit',
    'binary',
    'code',
  ];

  const physicsVisuals = [
    'motion',
    'force',
    'friction',
    'gravity',
    'energy',
    'momentum',
    'machines',
  ];

  const isManufacturingLesson =
    content.visualType &&
    manufacturingVisuals.includes(content.visualType);

  const isElectronicsLesson =
    content.visualType &&
    electronicsVisuals.includes(content.visualType);

  const isPhysicsLesson =
    content.visualType &&
    physicsVisuals.includes(content.visualType);

  const isImageBackedLesson =
    Boolean(isManufacturingLesson || isElectronicsLesson || isPhysicsLesson);

  return (
    <View style={styles.container}>
      {content.showImage && imageSource && (
        <View
          style={[
            styles.imageFrame,
            isManufacturingLesson && styles.manufacturingImageFrame,
            isElectronicsLesson && styles.electronicsImageFrame,
            isPhysicsLesson && styles.physicsImageFrame,
          ]}
        >
          <View style={styles.imageInner}>
            {typeof imageSource === 'string' ? (
              <SvgUri
                uri={imageSource}
                width="100%"
                height="100%"
              />
            ) : (
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      )}

      {(!content.showImage || isImageBackedLesson) && (
        <ConceptAnimation type={content.visualType} />
      )}

      {content.showText && content.description && (
        <View style={styles.textArea}>
          <Text style={styles.title}>
            {content.title}
          </Text>

          <Text style={styles.description}>
            {content.description}
          </Text>
        </View>
      )}

      {content.showSound && content.sound && (
        <Pressable
          onPress={playSound}
          style={({ pressed }) => [
            styles.soundButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.soundIcon}>▶</Text>
          <Text style={styles.soundText}>
            HEAR IT
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    padding: 12,
    borderRadius: 28,
    backgroundColor: 'rgba(9, 13, 34, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },

  imageFrame: {
    width: '100%',
    height: 270,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 14,
  },

  imageInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  manufacturingImageFrame: {
    height: 250,
    borderColor: 'rgba(255,209,102,0.24)',
    backgroundColor: 'rgba(255,209,102,0.035)',
  },

  electronicsImageFrame: {
    height: 250,
    borderColor: 'rgba(127,231,255,0.24)',
    backgroundColor: 'rgba(127,231,255,0.035)',
  },

  physicsImageFrame: {
    height: 250,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  animationArea: {
    minHeight: 220,
    height: 220,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },

  drawingWorkbench: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingHorizontal: 20,
  },

  drawingGearLarge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawingGearSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.42)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawingGearText: {
    fontSize: 34,
  },

  drawingConnection: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawingArrow: {
    width: 48,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawingArrowText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  drawingLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 5,
  },

  drawingLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  circuitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circuitNode: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circuitText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  circuitLine: {
    color: '#7FE7FF',
    fontSize: 18,
  },

  light: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  lightText: {
    fontSize: 32,
  },

  vibrationSource: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,209,102,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 70,
  },

  wave: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#FFD166',
    backgroundColor: 'rgba(255,209,102,0.08)',
  },

  animationCaption: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.58)',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.4,
  },

  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    minHeight: 100,
  },

  waveBar: {
    width: 18,
    borderRadius: 9,
    backgroundColor: '#7FE7FF',
  },

  frequencyLabels: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  smallLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  rhythmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 70,
  },

  beat: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,209,102,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  beatText: {
    color: '#FFD166',
    fontSize: 16,
    fontWeight: '900',
  },

  melodyPath: {
    width: '80%',
    height: 80,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgba(201,183,255,0.35)',
    transform: [{ rotate: '-8deg' }],
    justifyContent: 'center',
  },

  note: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(201,183,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(201,183,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noteText: {
    color: '#C9B7FF',
    fontSize: 20,
    fontWeight: '900',
  },

  arrow: {
    color: '#FFD166',
    fontSize: 30,
    fontWeight: '900',
    marginHorizontal: 6,
  },

  circuitBoard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  circuitTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circuitBattery: {
    width: 48,
    height: 68,
    borderRadius: 12,
    backgroundColor: 'rgba(255,209,102,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(255,209,102,0.55)',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  circuitBatteryText: {
    color: '#FFD166',
    fontSize: 15,
    fontWeight: '900',
  },

  batteryPlate: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD166',
  },

  batteryPlateSmall: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFD166',
  },

  circuitWire: {
    color: '#7FE7FF',
    fontSize: 13,
    fontWeight: '900',
  },

  circuitSwitch: {
    width: 54,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  switchBase: {
    position: 'absolute',
    bottom: 8,
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  switchArm: {
    position: 'absolute',
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    bottom: 10,
    left: 11,
    transformOrigin: 'left center',
  },

  circuitBulbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },

  circuitWireVertical: {
    width: 4,
    height: 28,
    backgroundColor: '#7FE7FF',
    marginHorizontal: 18,
  },

  circuitBulb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,209,102,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(255,209,102,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circuitBulbText: {
    fontSize: 34,
  },

  circuitReturnWire: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  binaryRow: {
    flexDirection: 'row',
    gap: 10,
  },

  binaryBit: {
    width: 42,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(127,231,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(127,231,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  binaryText: {
    color: '#7FE7FF',
    fontSize: 22,
    fontWeight: '900',
  },

  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  numberCard: {
    minWidth: 78,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,209,102,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.35)',
    alignItems: 'center',
  },

  numberText: {
    color: '#FFD166',
    fontSize: 25,
    fontWeight: '900',
  },

  numberOperator: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },

  shoppingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  priceCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  totalCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(127,231,255,0.14)',
  },

  price: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  plus: {
    color: '#FFD166',
    fontSize: 20,
    fontWeight: '900',
  },

  artShape: {
    width: 130,
    height: 100,
    borderRadius: 22,
    backgroundColor: 'rgba(201,183,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,183,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  artShapeText: {
    color: '#C9B7FF',
    fontSize: 30,
    fontWeight: '900',
  },

  foodRow: {
    flexDirection: 'row',
    gap: 16,
  },

  foodIcon: {
    fontSize: 40,
  },

  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  person: {
    color: '#7FE7FF',
    fontSize: 48,
  },

  connection: {
    color: '#FFD166',
    fontSize: 26,
  },

  natureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  natureIcon: {
    fontSize: 32,
  },

  defaultSymbol: {
    color: '#FFD166',
    fontSize: 64,
  },

  textArea: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 14,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
  },

  description: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 520,
  },

  soundButton: {
    marginTop: 14,
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: '#FFD166',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  pressed: {
    opacity: 0.7,
  },

  soundIcon: {
    color: '#151515',
    fontSize: 13,
    fontWeight: '900',
  },

  soundText: {
    color: '#151515',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
