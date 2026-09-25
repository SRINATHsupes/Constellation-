import { View, Text } from 'react-native';

export default function ConstellationRoute() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ff00ff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: 'bold',
          color: '#000000',
        }}
      >
        EXPERIMENT CONSTELLATION
      </Text>
    </View>
  );
}
