import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mode = 'plants' | 'foodweb' | 'ecosystem' | 'restore';

type Props = {
  mode: Mode;
  onComplete: () => void;
};

const COLORS = {
  green: '#9EF2B5',
  yellow: '#FDE68A',
  blue: '#7DD3FC',
  pink: '#F0ABFC',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.58)',
  panel: 'rgba(255,255,255,0.055)',
  border: 'rgba(255,255,255,0.13)',
};

export default function NatureChallengeGame({
  mode,
  onComplete,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  const data = useMemo(() => {
    if (mode === 'plants') {
      return {
        title: 'HELP THE PLANT GROW',
        instruction:
          'Give the plant the conditions it needs for healthy growth.',
        options: [
          ['sun', '☀', 'LIGHT'],
          ['water', '💧', 'WATER'],
          ['stone', '◆', 'STONE'],
          ['soil', '●', 'SOIL'],
        ],
        required: ['sun', 'water', 'soil'],
        caption: 'light + water + soil → growth',
      };
    }

    if (mode === 'foodweb') {
      return {
        title: 'REBUILD THE FOOD WEB',
        instruction:
          'Connect the organisms so food relationships can continue.',
        options: [
          ['plant', '🌿', 'PLANT'],
          ['caterpillar', '🐛', 'CATERPILLAR'],
          ['bird', '🐦', 'BIRD'],
          ['rock', '◆', 'ROCK'],
        ],
        required: ['plant', 'caterpillar', 'bird'],
        caption: 'plant → insect → bird',
      };
    }

    if (mode === 'ecosystem') {
      return {
        title: 'BALANCE THE ECOSYSTEM',
        instruction:
          'Choose the conditions that allow the ecosystem to keep functioning.',
        options: [
          ['water', '💧', 'WATER'],
          ['plants', '🌿', 'PLANTS'],
          ['animals', '🐾', 'ANIMALS'],
          ['pollution', '☁', 'POLLUTION'],
        ],
        required: ['water', 'plants', 'animals'],
        caption: 'many parts → one connected system',
      };
    }

    return {
      title: 'RESTORE THE HABITAT',
      instruction:
        'Choose actions that help the damaged habitat recover.',
      options: [
        ['clean', '♻', 'REMOVE WASTE'],
        ['native', '🌱', 'PROTECT PLANTS'],
        ['water', '💧', 'PROTECT WATER'],
        ['damage', '✕', 'ADD MORE WASTE'],
      ],
      required: ['clean', 'native', 'water'],
      caption: 'protect → recover → observe',
    };
  }, [mode]);

  const toggle = (id: string) => {
    if (complete) return;

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const check = () => {
    const correct =
      selected.length === data.required.length &&
      data.required.every((item) => selected.includes(item));

    if (correct) {
      setComplete(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>

      <Text style={styles.instruction}>
        {data.instruction}
      </Text>

      <View style={styles.scene}>
        {mode === 'plants' && (
          <>
            <Text style={styles.sceneIcon}>🌱</Text>
            <Text style={styles.sceneCaption}>
              {selected.includes('sun') &&
              selected.includes('water') &&
              selected.includes('soil')
                ? 'THE PLANT IS GROWING'
                : 'WHAT DOES IT NEED?'}
            </Text>
          </>
        )}

        {mode === 'foodweb' && (
          <>
            <View style={styles.webRow}>
              <Text style={styles.sceneIcon}>🌿</Text>
              <Text style={styles.link}>→</Text>
              <Text style={styles.sceneIcon}>🐛</Text>
              <Text style={styles.link}>→</Text>
              <Text style={styles.sceneIcon}>🐦</Text>
            </View>
            <Text style={styles.sceneCaption}>
              {selected.length >= 3
                ? 'THE FOOD WEB IS CONNECTED'
                : 'CONNECT THE LIVING THINGS'}
            </Text>
          </>
        )}

        {mode === 'ecosystem' && (
          <>
            <View style={styles.webRow}>
              <Text style={styles.sceneIcon}>💧</Text>
              <Text style={styles.sceneIcon}>🌿</Text>
              <Text style={styles.sceneIcon}>🐾</Text>
            </View>
            <Text style={styles.sceneCaption}>
              {selected.length >= 3
                ? 'THE SYSTEM CAN FUNCTION'
                : 'FIND THE IMPORTANT PARTS'}
            </Text>
          </>
        )}

        {mode === 'restore' && (
          <>
            <Text style={styles.sceneIcon}>
              {selected.includes('clean') &&
              selected.includes('native') &&
              selected.includes('water')
                ? '🌿'
                : '🏚'}
            </Text>

            <Text style={styles.sceneCaption}>
              {selected.length >= 3
                ? 'HABITAT RECOVERY STARTED'
                : 'THE HABITAT NEEDS HELP'}
            </Text>
          </>
        )}
      </View>

      <View style={styles.options}>
        {data.options.map(([id, icon, label]) => {
          const active = selected.includes(id);

          return (
            <Pressable
              key={id}
              onPress={() => toggle(id)}
              style={[
                styles.option,
                active && styles.optionActive,
              ]}
            >
              <Text style={styles.optionIcon}>{icon}</Text>
              <Text style={styles.optionLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {!complete ? (
        <Pressable
          onPress={check}
          style={styles.checkButton}
        >
          <Text style={styles.checkText}>
            OBSERVE THE RESULT →
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={onComplete}
          style={styles.completeButton}
        >
          <Text style={styles.completeText}>
            CONTINUE →
          </Text>
        </Pressable>
      )}

      <Text style={styles.caption}>
        {data.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },

  instruction: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 330,
  },

  scene: {
    width: '100%',
    minHeight: 150,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sceneIcon: {
    fontSize: 52,
  },

  sceneCaption: {
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  webRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  link: {
    color: COLORS.green,
    fontSize: 24,
    fontWeight: '900',
  },

  options: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },

  option: {
    width: '46%',
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  optionActive: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(158,242,181,0.12)',
  },

  optionIcon: {
    fontSize: 23,
  },

  optionLabel: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  checkButton: {
    marginTop: 16,
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: 'rgba(158,242,181,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(158,242,181,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  completeButton: {
    marginTop: 16,
    minHeight: 48,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: 'rgba(253,230,138,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(253,230,138,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  completeText: {
    color: COLORS.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  caption: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
});
