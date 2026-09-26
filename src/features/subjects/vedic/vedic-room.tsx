import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const DOORS = [
  {
    id: 1,
    title: 'THE NUMBER GATE',
    subtitle: 'Numbers close to 100',
    unlocked: true,
  },
  {
    id: 2,
    title: 'THE HUNDRED DOOR',
    subtitle: 'Cross subtraction',
    unlocked: false,
  },
  {
    id: 3,
    title: 'THE FINAL CHAMBER',
    subtitle: 'Master the pattern',
    unlocked: false,
  },
];

export default function VedicRoom() {
  const router = useRouter();
  const [selectedDoor, setSelectedDoor] = useState(1);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  function enterDoor(doorNumber: number) {
    if (doorNumber !== 1) {
      setSelectedDoor(doorNumber);
      return;
    }

    router.push('/play/vedic-escape?level=1');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#090714', '#171026', '#24152c']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View>
            <Text style={styles.eyebrow}>VEDIC MATHS</Text>
            <Text style={styles.title}>THE NUMBER TEMPLE</Text>
          </View>

          <View style={styles.starBadge}>
            <Text style={styles.star}>★</Text>
          </View>
        </View>

        <View style={styles.room}>
          <View style={styles.sky}>
            <Text style={styles.constellation}>✦   ·   ✧   ·   ✦</Text>
            <Text style={styles.templeMark}>𑁍</Text>
          </View>

          <View style={styles.temple}>
            <View style={styles.roofOuter}>
              <View style={styles.roofInner} />
            </View>

            <View style={styles.columns}>
              <View style={styles.column} />
              <View style={styles.centerDoor}>
                <Animated.View
                  style={[
                    styles.doorGlow,
                    { transform: [{ scale: pulse }] },
                  ]}
                />

                <Text style={styles.doorNumber}>1</Text>
                <Text style={styles.doorLabel}>NUMBER GATE</Text>

                <Pressable
                  onPress={() => enterDoor(1)}
                  style={styles.enterButton}
                >
                  <Text style={styles.enterText}>ENTER</Text>
                </Pressable>
              </View>
              <View style={styles.column} />
            </View>

            <View style={styles.base} />
          </View>

          <View style={styles.floor}>
            <Text style={styles.floorSymbol}>◇</Text>
            <Text style={styles.floorSymbol}>◆</Text>
            <Text style={styles.floorSymbol}>◇</Text>
          </View>
        </View>

        <View style={styles.bottomPanel}>
          <Text style={styles.sectionTitle}>TEMPLE LEVELS</Text>

          <View style={styles.levelRow}>
            {DOORS.map((door) => {
              const selected = selectedDoor === door.id;

              return (
                <Pressable
                  key={door.id}
                  onPress={() => enterDoor(door.id)}
                  style={[
                    styles.levelCard,
                    selected && styles.selectedCard,
                    !door.unlocked && styles.lockedCard,
                  ]}
                >
                  <View
                    style={[
                      styles.levelCircle,
                      !door.unlocked && styles.lockedCircle,
                    ]}
                  >
                    <Text style={styles.levelIcon}>
                      {door.unlocked ? door.id : '🔒'}
                    </Text>
                  </View>

                  <Text style={styles.levelTitle}>{door.title}</Text>

                  <Text style={styles.levelSubtitle}>
                    {door.unlocked ? door.subtitle : 'Locked'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.instruction}>
            Enter the temple and solve the lock to open the next chamber.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#090714',
  },

  container: {
    flex: 1,
  },

  header: {
    minHeight: 76,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  backText: {
    color: '#fff',
    fontSize: 34,
    lineHeight: 38,
  },

  eyebrow: {
    color: '#b8a5ff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },

  starBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,215,100,0.10)',
  },

  star: {
    color: '#ffd76a',
    fontSize: 22,
  },

  room: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 4,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: '#100d1c',
  },

  sky: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },

  constellation: {
    position: 'absolute',
    top: 28,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 17,
    letterSpacing: 8,
  },

  templeMark: {
    color: '#d9b7ff',
    fontSize: 38,
    opacity: 0.75,
  },

  temple: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },

  roofOuter: {
    width: 220,
    height: 74,
    backgroundColor: '#39214d',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopLeftRadius: 110,
    borderTopRightRadius: 110,
    borderWidth: 1,
    borderColor: '#68447c',
  },

  roofInner: {
    width: 155,
    height: 52,
    backgroundColor: '#241633',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderWidth: 1,
    borderColor: '#5d3a72',
  },

  columns: {
    width: 250,
    height: 205,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#25162f',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#5a3b68',
  },

  column: {
    width: 38,
    marginHorizontal: 13,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#3d2850',
    borderWidth: 1,
    borderColor: '#745287',
  },

  centerDoor: {
    width: 125,
    marginTop: 15,
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
    backgroundColor: '#0d0915',
    borderWidth: 1,
    borderColor: '#8b62a5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  doorGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(195,150,255,0.08)',
  },

  doorNumber: {
    color: '#ffd76a',
    fontSize: 38,
    fontWeight: '900',
  },

  doorLabel: {
    color: '#d8cbe0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 3,
  },

  enterButton: {
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#b998ff',
  },

  enterText: {
    color: '#160d20',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  base: {
    width: 275,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#392244',
  },

  floor: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 34,
  },

  floorSymbol: {
    color: '#805e91',
    fontSize: 22,
  },

  bottomPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },

  sectionTitle: {
    color: '#a99ab2',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 9,
  },

  levelRow: {
    flexDirection: 'row',
    gap: 8,
  },

  levelCard: {
    flex: 1,
    minHeight: 94,
    padding: 9,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  selectedCard: {
    borderColor: '#9d78c5',
    backgroundColor: 'rgba(157,120,197,0.12)',
  },

  lockedCard: {
    opacity: 0.48,
  },

  levelCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e6bb2',
    marginBottom: 6,
  },

  lockedCircle: {
    backgroundColor: '#4b4350',
  },

  levelIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },

  levelTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 13,
  },

  levelSubtitle: {
    color: '#a99eae',
    fontSize: 9,
    marginTop: 3,
    lineHeight: 12,
  },

  instruction: {
    color: '#887d8f',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 9,
  },
});
