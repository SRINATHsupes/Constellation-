import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getRoomConfig } from './room-config';
import RoomCustomizer from './customization/RoomCustomizer';

import {
  getRoomCustomization,
} from './customization/customization-store';
import {
  DEFAULT_CUSTOMIZATION,
  RoomCustomization,
} from './customization/customization-types';

type EscapeRoomProps = {
  subject: string;
  branch?: string;
  levelTitle: string;
  levelNumber: number;
  challenge: string;
  onComplete: () => void;
  onBack: () => void;
};

function getRoomSymbol(
  escapeType: string,
  objectSet: string,
) {
  if (objectSet === 'cosmic') return '✧';
  if (objectSet === 'ocean') return '≈';
  if (objectSet === 'forest') return '❧';
  if (objectSet === 'sunset') return '◌';
  if (objectSet === 'midnight') return '☾';

  switch (escapeType) {
    case 'vedic-locks':
      return '∿';
    case 'electronics-circuit':
      return '⚡';
    case 'physics-station':
      return '◌';
    case 'manufacturing-factory':
      return '⚙';
    case 'arts-drawing':
      return '✎';
    case 'arts-diy':
      return '🛠';
    case 'arts-models':
      return '◇';
    case 'music-sound':
      return '♫';
    case 'nutrition-kitchen':
      return '◒';
    case 'humanity-community':
      return '♡';
    case 'nature-ecosystem':
      return '❧';
    default:
      return '✦';
  }
}

function getRoomObjects(objectSet: string) {
  switch (objectSet) {
    case 'cosmic':
      return ['✦', '✧', '◌', '✶'];

    case 'ocean':
      return ['≈', '◦', '◉', '≈'];

    case 'forest':
      return ['❧', '✿', '☘', '❧'];

    case 'sunset':
      return ['☀', '◌', '✦', '◉'];

    case 'midnight':
      return ['☾', '✦', '◇', '✧'];

    default:
      return ['✦', '◇', '◌', '✧'];
  }
}

export function EscapeRoom({
  subject,
  branch,
  levelTitle,
  levelNumber,
  challenge,
  onComplete,
  onBack,
}: EscapeRoomProps) {
  const room = getRoomConfig(subject, branch);

  const [customization, setCustomization] =
    useState<RoomCustomization>(
      DEFAULT_CUSTOMIZATION,
    );

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCustomization() {
      const saved = await getRoomCustomization(room.id);

      if (mounted) {
        setCustomization(saved);
      }
    }

    loadCustomization();

    return () => {
      mounted = false;
    };
  }, [room.id]);

  const objects = getRoomObjects(
    customization.objectSet,
  );

  function finishRoom() {
    setCompleted(true);
  }

  return (
    <LinearGradient
      colors={[
        customization.background,
        customization.secondaryBackground,
      ]}
      style={styles.root}
    >
      {showCustomizer ? (
        <RoomCustomizer
          roomId={room.id}
          onClose={() => setShowCustomizer(false)}
        />
      ) : (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← SPACE
            </Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setShowCustomizer(true)}
              style={[
                styles.customizeButton,
                {
                  borderColor:
                    `${customization.accent}55`,
                },
              ]}
            >
              <Text
                style={[
                  styles.customizeText,
                  {
                    color: customization.accent,
                  },
                ]}
              >
                CUSTOMIZE ✦
              </Text>
            </Pressable>

            <View
              style={[
                styles.roomBadge,
                {
                  borderColor:
                    `${customization.accent}55`,
                },
              ]}
            >
              <Text
                style={[
                  styles.roomBadgeText,
                  {
                    color: customization.accent,
                  },
                ]}
              >
                ESCAPE ROOM
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.roomName}>
            {room.name}
          </Text>

          <Text style={styles.level}>
            LEVEL {levelNumber}
          </Text>

          <Text style={styles.title}>
            {levelTitle}
          </Text>

          <Text style={styles.description}>
            Use what you learned to escape this room.
          </Text>
        </View>

        <View
          style={[
            styles.room,
            {
              borderColor:
                `${customization.accent}45`,
            },
          ]}
        >
          <View style={styles.objects}>
            {objects.map((object, index) => (
              <Text
                key={`${object}-${index}`}
                style={[
                  styles.object,
                  {
                    color: customization.accent,
                    opacity:
                      0.35 + index * 0.12,
                  },
                ]}
              >
                {object}
              </Text>
            ))}
          </View>

          <View
            style={[
              styles.core,
              {
                borderColor:
                  customization.accent,
                shadowColor:
                  customization.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.coreSymbol,
                {
                  color:
                    customization.accent,
                },
              ]}
            >
              {getRoomSymbol(
                room.escapeType,
                customization.objectSet,
              )}
            </Text>

            <Text style={styles.coreLabel}>
              {completed
                ? 'ESCAPED'
                : 'ROOM CORE'}
            </Text>
          </View>

          {!started && !completed && (
            <View style={styles.intro}>
              <Text style={styles.introTitle}>
                Something is waiting inside.
              </Text>

              <Text style={styles.challenge}>
                {challenge}
              </Text>

              <Pressable
                onPress={() => setStarted(true)}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor:
                      customization.accent,
                  },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  ENTER ROOM →
                </Text>
              </Pressable>
            </View>
          )}

          {started && !completed && (
            <View style={styles.challengeArea}>
              <Text style={styles.sectionLabel}>
                YOUR MISSION
              </Text>

              <Text style={styles.challengeLarge}>
                {challenge}
              </Text>

              <View style={styles.lockRow}>
                {[1, 2, 3].map((lock) => (
                  <View
                    key={lock}
                    style={[
                      styles.lock,
                      {
                        borderColor:
                          lock === 1
                            ? customization.accent
                            : `${customization.accent}44`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.lockNumber,
                        {
                          color:
                            lock === 1
                              ? customization.accent
                              : 'rgba(255,255,255,0.5)',
                        },
                      ]}
                    >
                      0{lock}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.hint}>
                Solve the challenge using what you
                learned in this level.
              </Text>

              <Pressable
                onPress={finishRoom}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor:
                      customization.accent,
                  },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  SOLVE ROOM →
                </Text>
              </Pressable>
            </View>
          )}

          {completed && (
            <View style={styles.success}>
              <Text
                style={[
                  styles.successStar,
                  {
                    color:
                      customization.accent,
                  },
                ]}
              >
                ✦
              </Text>

              <Text style={styles.successTitle}>
                ROOM ESCAPED
              </Text>

              <Text style={styles.successText}>
                You used the idea instead of simply
                answering a question.
              </Text>

              <Pressable
                onPress={onComplete}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor:
                      customization.accent,
                  },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  CONTINUE →
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.customizationNote}>
          <Text
            style={[
              styles.customizationIcon,
              {
                color:
                  customization.accent,
              },
            ]}
          >
            ✦
          </Text>

          <Text style={styles.customizationText}>
            This room reflects your chosen atmosphere
            and objects.
          </Text>
        </View>
      </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 50,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  backButton: {
    minHeight: 44,
    justifyContent: 'center',
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  headerActions: {
    alignItems: 'flex-end',
    gap: 7,
  },

  customizeButton: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  customizeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  roomBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  roomBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  header: {
    marginBottom: 22,
  },

  roomName: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  level: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 5,
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  room: {
    minHeight: 530,
    borderWidth: 1,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.30)',
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  objects: {
    position: 'absolute',
    top: 20,
    left: 22,
    right: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  object: {
    fontSize: 22,
    fontWeight: '400',
  },

  core: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1.5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  coreSymbol: {
    fontSize: 42,
    fontWeight: '300',
  },

  coreLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginTop: 5,
  },

  intro: {
    marginTop: 35,
  },

  introTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },

  challenge: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 25,
  },

  challengeArea: {
    marginTop: 35,
  },

  sectionLabel: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
  },

  challengeLarge: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 31,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },

  lockRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 30,
    marginBottom: 18,
  },

  lock: {
    width: 58,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  lockNumber: {
    fontSize: 13,
    fontWeight: '900',
  },

  hint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 22,
  },

  primaryButton: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  primaryButtonText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  success: {
    alignItems: 'center',
    marginTop: 35,
  },

  successStar: {
    fontSize: 58,
    marginBottom: 12,
  },

  successTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },

  successText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },

  customizationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    paddingHorizontal: 15,
  },

  customizationIcon: {
    fontSize: 15,
    marginRight: 7,
  },

  customizationText: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 10,
    textAlign: 'center',
  },
});
