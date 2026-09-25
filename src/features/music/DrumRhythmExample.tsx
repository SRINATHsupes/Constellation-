import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

const BEATS = ['•', '—', '•', '•'];

export default function DrumRhythmExample() {
  const drum = useAudioPlayer(
    require('@/assets/audio/music/click.wav'),
  );

  const [pattern, setPattern] = useState(BEATS);
  const [playing, setPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);

  const playDrum = () => {
    drum.seekTo(0);
    drum.play();
  };

  const changeBeat = (index: number) => {
    setPattern((current) =>
      current.map((beat, i) =>
        i === index
          ? beat === '•'
            ? '—'
            : '•'
          : beat,
      ),
    );
  };

  const playRhythm = async () => {
    if (playing) return;

    setPlaying(true);

    for (let i = 0; i < pattern.length; i++) {
      setActiveBeat(i);

      drum.seekTo(0);
      drum.play();

      await new Promise((resolve) =>
        setTimeout(
          resolve,
          pattern[i] === '—' ? 700 : 300,
        ),
      );
    }

    setActiveBeat(-1);
    setPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>MUSIC · RHYTHM</Text>

      <Text style={styles.title}>Play the Drum</Text>

      <Pressable
        onPress={playDrum}
        style={({ pressed }) => [
          styles.drum,
          pressed && styles.drumPressed,
        ]}
      >
        <Text style={styles.drumEmoji}>🥁</Text>
        <Text style={styles.drumText}>TAP</Text>
      </Pressable>

      <Text style={styles.instruction}>
        Listen to the beat, then make your own rhythm.
      </Text>

      <Text style={styles.sectionTitle}>
        CREATE A RHYTHM
      </Text>

      <View style={styles.pattern}>
        {pattern.map((beat, index) => (
          <Pressable
            key={index}
            onPress={() => changeBeat(index)}
            style={[
              styles.beat,
              activeBeat === index && styles.activeBeat,
            ]}
          >
            <Text style={styles.beatText}>{beat}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={playRhythm}
        disabled={playing}
        style={[
          styles.playButton,
          playing && styles.playButtonDisabled,
        ]}
      >
        <Text style={styles.playText}>
          {playing ? 'PLAYING…' : '▶ PLAY RHYTHM'}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        • short beat   — long beat
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },

  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.65,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 24,
  },

  drum: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A287A',
    borderWidth: 2,
    borderColor: '#FFB7F0',
  },

  drumPressed: {
    transform: [{ scale: 0.94 }],
  },

  drumEmoji: {
    fontSize: 72,
  },

  drumText: {
    marginTop: 4,
    fontWeight: '700',
  },

  instruction: {
    textAlign: 'center',
    marginTop: 22,
    opacity: 0.75,
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  pattern: {
    flexDirection: 'row',
    gap: 10,
  },

  beat: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241235',
    borderWidth: 1,
    borderColor: '#7D5A91',
  },

  activeBeat: {
    backgroundColor: '#8D4FA8',
    transform: [{ scale: 1.08 }],
  },

  beatText: {
    fontSize: 28,
    fontWeight: '700',
  },

  playButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#FFB7F0',
  },

  playButtonDisabled: {
    opacity: 0.6,
  },

  playText: {
    fontWeight: '800',
    color: '#241235',
  },

  hint: {
    marginTop: 16,
    opacity: 0.6,
  },
});
