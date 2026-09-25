import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  applyRoomPreset,
  getRoomCustomization,
  saveRoomCustomization,
} from './customization-store';

import {
  DEFAULT_CUSTOMIZATION,
  RoomCustomization,
  BackgroundStyle,
} from './customization-types';

type Props = {
  roomId: string;
  onClose?: () => void;
};

const PRESETS: {
  id: BackgroundStyle;
  name: string;
  colors: [string, string];
  symbol: string;
}[] = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    colors: ['#070B2A', '#32105E'],
    symbol: '✦',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#031B2E', '#075B78'],
    symbol: '≈',
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#031812', '#096048'],
    symbol: '❧',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#2A1020', '#8A3D42'],
    symbol: '☀',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: ['#05050D', '#25204A'],
    symbol: '☾',
  },
];

const ACCENTS = [
  '#BFA2FF',
  '#62E8FF',
  '#9EF2B5',
  '#FFD166',
  '#FFB7F0',
  '#FF8A65',
  '#FFFFFF',
];

const OBJECT_SETS = [
  {
    id: 'default',
    name: 'Classic',
    symbol: '✦',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    symbol: '✧',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    symbol: '≈',
  },
  {
    id: 'forest',
    name: 'Nature',
    symbol: '❧',
  },
  {
    id: 'sunset',
    name: 'Warm',
    symbol: '◌',
  },
  {
    id: 'midnight',
    name: 'Mystery',
    symbol: '☾',
  },
];

export default function RoomCustomizer({
  roomId,
  onClose,
}: Props) {
  const [customization, setCustomization] =
    useState<RoomCustomization>(DEFAULT_CUSTOMIZATION);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const saved = await getRoomCustomization(roomId);

      if (mounted) {
        setCustomization({
          ...DEFAULT_CUSTOMIZATION,
          ...saved,
        });
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [roomId]);

  async function selectPreset(presetId: BackgroundStyle) {
    setSaving(true);

    const updated = await applyRoomPreset(
      roomId,
      presetId,
    );

    setCustomization(updated);
    setSaving(false);
  }

  async function selectAccent(accent: string) {
    const updated = {
      ...customization,
      accent,
    };

    setCustomization(updated);
    await saveRoomCustomization(roomId, updated);
  }

  async function selectObjects(objectSet: string) {
    const updated = {
      ...customization,
      objectSet,
    };

    setCustomization(updated);
    await saveRoomCustomization(roomId, updated);
  }

  async function toggleMusic(value: boolean) {
    const updated = {
      ...customization,
      musicEnabled: value,
    };

    setCustomization(updated);
    await saveRoomCustomization(roomId, updated);
  }

  const previewObjects =
    OBJECT_SETS.find(
      (item) =>
        item.id === customization.objectSet,
    )?.symbol ?? '✦';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[
          customization.background,
          customization.secondaryBackground,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              ROOM CUSTOMIZATION
            </Text>

            <Text style={styles.title}>
              Make it yours
            </Text>
          </View>

          {onClose && (
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>
                ×
              </Text>
            </Pressable>
          )}
        </View>

        {/* LIVE PREVIEW */}

        <Text style={styles.sectionTitle}>
          LIVE PREVIEW
        </Text>

        <View
          style={[
            styles.preview,
            {
              borderColor: customization.accent,
            },
          ]}
        >
          <LinearGradient
            colors={[
              customization.background,
              customization.secondaryBackground,
            ]}
            style={styles.previewGradient}
          >
            <View
              style={[
                styles.previewOrb,
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
                  styles.previewSymbol,
                  {
                    color:
                      customization.accent,
                  },
                ]}
              >
                {previewObjects}
              </Text>
            </View>

            <Text style={styles.previewTitle}>
              YOUR ROOM
            </Text>

            <Text style={styles.previewSubtitle}>
              {customization.backgroundStyle.toUpperCase()}
              {'  •  '}
              {customization.objectSet.toUpperCase()}
            </Text>

            <View style={styles.previewStars}>
              <Text
                style={{
                  color: customization.accent,
                }}
              >
                ✦
              </Text>

              <Text style={styles.previewStar}>
                ·
              </Text>

              <Text
                style={{
                  color: customization.accent,
                }}
              >
                ·
              </Text>

              <Text style={styles.previewStar}>
                ✧
              </Text>

              <Text
                style={{
                  color: customization.accent,
                }}
              >
                ·
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* BACKGROUND */}

        <Text style={styles.sectionTitle}>
          BACKGROUND
        </Text>

        <Text style={styles.sectionDescription}>
          Choose the atmosphere of your room.
        </Text>

        <View style={styles.presetGrid}>
          {PRESETS.map((preset) => {
            const selected =
              customization.backgroundStyle ===
              preset.id;

            return (
              <Pressable
                key={preset.id}
                onPress={() =>
                  selectPreset(preset.id)
                }
                style={[
                  styles.preset,
                  selected && {
                    borderColor:
                      customization.accent,
                  },
                ]}
              >
                <LinearGradient
                  colors={preset.colors}
                  style={styles.presetGradient}
                >
                  <Text style={styles.presetSymbol}>
                    {preset.symbol}
                  </Text>

                  <Text style={styles.presetName}>
                    {preset.name}
                  </Text>

                  {selected && (
                    <View
                      style={[
                        styles.selectedMark,
                        {
                          backgroundColor:
                            customization.accent,
                        },
                      ]}
                    >
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        {/* ACCENT */}

        <Text style={styles.sectionTitle}>
          ROOM COLOR
        </Text>

        <Text style={styles.sectionDescription}>
          Choose the color of lights and interactive objects.
        </Text>

        <View style={styles.accentRow}>
          {ACCENTS.map((accent) => {
            const selected =
              customization.accent === accent;

            return (
              <Pressable
                key={accent}
                onPress={() =>
                  selectAccent(accent)
                }
                style={[
                  styles.accentButton,
                  selected && {
                    borderColor: '#FFFFFF',
                    transform: [{ scale: 1.08 }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.accentDot,
                    {
                      backgroundColor: accent,
                    },
                  ]}
                />

                {selected && (
                  <Text
                    style={[
                      styles.accentCheck,
                      {
                        color:
                          accent === '#FFFFFF'
                            ? '#111111'
                            : '#FFFFFF',
                      },
                    ]}
                  >
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* OBJECTS */}

        <Text style={styles.sectionTitle}>
          ROOM OBJECTS
        </Text>

        <Text style={styles.sectionDescription}>
          Change the mysterious objects around the room.
        </Text>

        <View style={styles.objectGrid}>
          {OBJECT_SETS.map((objectSet) => {
            const selected =
              customization.objectSet ===
              objectSet.id;

            return (
              <Pressable
                key={objectSet.id}
                onPress={() =>
                  selectObjects(objectSet.id)
                }
                style={[
                  styles.objectButton,
                  selected && {
                    borderColor:
                      customization.accent,
                    backgroundColor:
                      'rgba(255,255,255,0.10)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.objectSymbol,
                    {
                      color: selected
                        ? customization.accent
                        : '#FFFFFF',
                    },
                  ]}
                >
                  {objectSet.symbol}
                </Text>

                <Text style={styles.objectName}>
                  {objectSet.name}
                </Text>

                {selected && (
                  <Text
                    style={[
                      styles.objectCheck,
                      {
                        color:
                          customization.accent,
                      },
                    ]}
                  >
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* AMBIENCE */}

        <View style={styles.musicRow}>
          <View style={styles.musicText}>
            <Text style={styles.musicTitle}>
              Room ambience
            </Text>

            <Text style={styles.musicDescription}>
              Add sound atmosphere when available.
            </Text>
          </View>

          <Switch
            value={customization.musicEnabled}
            onValueChange={toggleMusic}
            trackColor={{
              false: 'rgba(255,255,255,0.18)',
              true: customization.accent,
            }}
          />
        </View>

        {saving && (
          <Text style={styles.saving}>
            Saving...
          </Text>
        )}

        <Text style={styles.footer}>
          Your room is saved on this device.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  eyebrow: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    marginTop: 4,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 10,
  },

  sectionDescription: {
    color: 'rgba(255,255,255,0.50)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 12,
  },

  preview: {
    height: 205,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 24,
  },

  previewGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewOrb: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewSymbol: {
    fontSize: 32,
  },

  previewTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 12,
  },

  previewSubtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 5,
  },

  previewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginTop: 14,
  },

  previewStar: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
  },

  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  preset: {
    width: '31%',
    minHeight: 105,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },

  presetGradient: {
    flex: 1,
    minHeight: 105,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  presetSymbol: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  presetName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 6,
  },

  selectedMark: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '900',
  },

  accentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  accentButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  accentDot: {
    width: 25,
    height: 25,
    borderRadius: 13,
  },

  accentCheck: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '900',
  },

  objectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 24,
  },

  objectButton: {
    width: '31%',
    minHeight: 72,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  objectSymbol: {
    fontSize: 22,
  },

  objectName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 5,
  },

  objectCheck: {
    position: 'absolute',
    right: 7,
    top: 6,
    fontSize: 13,
    fontWeight: '900',
  },

  musicRow: {
    minHeight: 76,
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  musicText: {
    flex: 1,
    paddingRight: 10,
  },

  musicTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  musicDescription: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  saving: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 15,
  },

  footer: {
    color: 'rgba(255,255,255,0.30)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 22,
  },
});
