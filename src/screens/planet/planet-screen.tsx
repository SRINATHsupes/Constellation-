/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function PlanetScreen() {
  const router = useRouter();

  const [spacePromptVisible, setSpacePromptVisible] =
    useState(false);

  const enterSpace = () => {
    setSpacePromptVisible(false);
    router.push('/(main)/world');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Your normal Home screen content goes here */}

      <View style={styles.spaceButtonContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explore space"
          onPress={() => setSpacePromptVisible(true)}
          style={({ pressed }) => [
            styles.spaceButton,
            pressed && styles.spaceButtonPressed,
          ]}
        >
        </Pressable>

        <Text style={styles.spaceLabel}>
          SPACE
        </Text>
      </View>

      <Modal
        visible={spacePromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSpacePromptVisible(false)
        }
      >
        <View style={styles.modalBackground}>
          <View style={styles.prompt}>
            <Text style={styles.promptIcon}>
              
            </Text>

            <Text style={styles.promptTitle}>
              Let's enter space?
            </Text>

            <Text style={styles.promptSubtitle}>
              Explore your constellation and discover
              new learning worlds.
            </Text>

            <View style={styles.promptButtons}>
              <Pressable
                onPress={() =>
                  setSpacePromptVisible(false)
                }
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>
                  NOT YET
                </Text>
              </Pressable>

              <Pressable
                onPress={enterSpace}
                style={styles.enterButton}
              >
                <Text style={styles.enterText}>
                  LET'S GO
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020713',
  },

  spaceButtonContainer: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  spaceButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(220, 235, 255, 0.4)',
    backgroundColor: 'rgba(8, 20, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  spaceButtonPressed: {
    transform: [{ scale: 0.92 }],
  },

  spaceIcon: {
    color: '#eef5ff',
    fontSize: 28,
  },

  spaceLabel: {
    marginTop: 5,
    color: 'rgba(220, 233, 255, 0.55)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  prompt: {
    width: '100%',
    maxWidth: 360,
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(190, 215, 255, 0.2)',
    backgroundColor: '#071225',
    alignItems: 'center',
  },

  promptIcon: {
    color: '#dce9ff',
    fontSize: 34,
    marginBottom: 12,
  },

  promptTitle: {
    color: '#f4f8ff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  promptSubtitle: {
    marginTop: 10,
    color: 'rgba(220, 233, 255, 0.62)',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  promptButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
  },

  cancelButton: {
    minWidth: 105,
    minHeight: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(220, 235, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  cancelText: {
    color: 'rgba(220, 233, 255, 0.65)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  enterButton: {
    minWidth: 105,
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: '#dce9ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  enterText: {
    color: '#071225',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});