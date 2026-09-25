import { useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function AstronautCompanion() {
  const [position, setPosition] = useState({
    x: 28,
    y: 170,
  });

  const startPosition = useRef({
    x: 28,
    y: 170,
  });

  // eslint-disable-next-line react-hooks/refs
  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        startPosition.current = position;
      },

      onPanResponderMove: (_, gesture) => {
        setPosition({
          x: Math.max(
            0,
            startPosition.current.x + gesture.dx,
          ),
          y: Math.max(
            90,
            startPosition.current.y + gesture.dy,
          ),
        });
      },
    }),
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.character,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      <Text style={styles.astronaut}>👨‍🚀</Text>

      <View style={styles.shadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  character: {
    position: 'absolute',
    width: 70,
    height: 90,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  astronaut: {
    fontSize: 52,
  },

  shadow: {
    position: 'absolute',
    bottom: 4,
    width: 35,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
