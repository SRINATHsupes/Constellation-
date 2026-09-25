import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    Line,
    LinearGradient,
    RadialGradient,
    Rect,
    Stop,
} from 'react-native-svg';

import { colors, fontFamilies, radius } from '@/theme';

export type VedicNodeType =
  | 'game'
  | 'music'
  | 'spatial'
  | 'practical'
  | 'challenge'
  | 'creative';

export type VedicMathNode = {
  id: string;
  title: string;
  x: number;
  y: number;
  type: VedicNodeType;
  completed?: boolean;
};

type VedicMathConnection = {
  from: string;
  to: string;
};

type VedicMathsMapProps = {
  onNodePress?: (node: VedicMathNode) => void;
};

const WIDTH = 360;
const HEIGHT = 620;

const NODE_COLORS: Record<VedicNodeType, string> = {
  game: '#79B9FF',
  music: '#FFD166',
  spatial: '#78E3FF',
  practical: '#7ED957',
  challenge: '#FF9F5B',
  creative: '#D9A7FF',
};

const NODES: VedicMathNode[] = [
  {
    id: 'numbers',
    title: 'Numbers',
    x: 180,
    y: 130,
    type: 'game',
    completed: true,
  },
  {
    id: 'addition',
    title: 'Addition',
    x: 100,
    y: 240,
    type: 'game',
    completed: true,
  },
  {
    id: 'number-bonds',
    title: 'Number Bonds',
    x: 260,
    y: 240,
    type: 'music',
  },
  {
    id: 'subtraction',
    title: 'Subtraction',
    x: 95,
    y: 360,
    type: 'spatial',
  },
  {
    id: 'real-world',
    title: 'Real World',
    x: 265,
    y: 360,
    type: 'practical',
  },
  {
    id: 'vedic-patterns',
    title: 'Vedic Patterns',
    x: 180,
    y: 485,
    type: 'challenge',
  },
];

const CONNECTIONS: VedicMathConnection[] = [
  { from: 'numbers', to: 'addition' },
  { from: 'numbers', to: 'number-bonds' },
  { from: 'addition', to: 'subtraction' },
  { from: 'number-bonds', to: 'real-world' },
  { from: 'subtraction', to: 'vedic-patterns' },
  { from: 'real-world', to: 'vedic-patterns' },
];

function getNode(id: string) {
  return NODES.find((node) => node.id === id);
}

function LabelText({
  children,
  x,
  y,
}: {
  children: string;
  x: number;
  y: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.label,
        {
          left: `${(x / WIDTH) * 100}%`,
          top: `${((y + 22) / HEIGHT) * 100}%`,
        },
      ]}
    >
      <Text>{children}</Text>
    </View>
  );
}

function Text({ children }: { children: string }) {
  return (
    <View>
      <TextNative>{children}</TextNative>
    </View>
  );
}

function TextNative({ children }: { children: string }) {
  return (
    <RNText
      numberOfLines={1}
      style={styles.labelText}
    >
      {children}
    </RNText>
  );
}

export function VedicMathsMap({
  onNodePress,
}: VedicMathsMapProps) {
  return (
    <View
      accessibilityLabel="Vedic Maths constellation map"
      accessibilityRole="image"
      style={styles.container}
    >
      <Svg
        height="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
      >
        <Defs>
          <RadialGradient id="spaceGlow" cx="50%" cy="42%">
            <Stop
              offset="0%"
              stopColor="#284A78"
              stopOpacity="0.42"
            />
            <Stop
              offset="55%"
              stopColor="#10243F"
              stopOpacity="0.18"
            />
            <Stop
              offset="100%"
              stopColor="#050A14"
              stopOpacity="0"
            />
          </RadialGradient>

          <RadialGradient id="sunGlow" cx="50%" cy="50%">
            <Stop
              offset="0%"
              stopColor="#FFF4B0"
              stopOpacity="0.95"
            />
            <Stop
              offset="45%"
              stopColor="#FFB347"
              stopOpacity="0.55"
            />
            <Stop
              offset="100%"
              stopColor="#FF8A3D"
              stopOpacity="0"
            />
          </RadialGradient>

          <LinearGradient id="mathSun" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop
              offset="0%"
              stopColor="#FFF7C2"
            />
            <Stop
              offset="55%"
              stopColor="#FFC45C"
            />
            <Stop
              offset="100%"
              stopColor="#FF8C42"
            />
          </LinearGradient>
        </Defs>

        <Rect
          fill={colors.midnight}
          height={HEIGHT}
          rx={radius.large}
          width={WIDTH}
        />

        <Rect
          fill="url(#spaceGlow)"
          height={HEIGHT}
          width={WIDTH}
        />

        {/* Background stars */}
        {[
          [32, 76],
          [72, 112],
          [314, 90],
          [292, 148],
          [25, 285],
          [330, 300],
          [45, 440],
          [310, 455],
          [76, 535],
          [292, 550],
          [130, 72],
          [230, 75],
        ].map(([x, y], index) => (
          <Circle
            key={`background-${index}`}
            cx={x}
            cy={y}
            fill={colors.onMidnightMuted}
            opacity={0.35 + (index % 3) * 0.12}
            r={index % 2 === 0 ? 1.2 : 1.7}
          />
        ))}

        {/* Warm solar atmosphere */}
        <Circle
          cx="180"
          cy="305"
          fill="url(#sunGlow)"
          opacity="0.32"
          r="125"
        />

        {/* Connections */}
        {CONNECTIONS.map((connection) => {
          const from = getNode(connection.from);
          const to = getNode(connection.to);

          if (!from || !to) {
            return null;
          }

          const active = Boolean(from.completed && to.completed);

          return (
            <Line
              key={`${connection.from}-${connection.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={active ? '#FFD166' : '#66809E'}
              strokeDasharray={active ? undefined : '2 7'}
              strokeLinecap="round"
              strokeOpacity={active ? 0.8 : 0.35}
              strokeWidth={active ? 2.5 : 1.5}
            />
          );
        })}

        {/* Central mathematical sun */}
        <Circle
          cx="180"
          cy="305"
          fill="url(#mathSun)"
          opacity="0.9"
          r="46"
        />

        <Circle
          cx="180"
          cy="305"
          fill="none"
          r="62"
          stroke="#FFD166"
          strokeOpacity="0.24"
          strokeWidth="2"
        />

        <Circle
          cx="180"
          cy="305"
          fill="none"
          r="82"
          stroke="#FFB347"
          strokeDasharray="2 9"
          strokeOpacity="0.22"
          strokeWidth="2"
        />

        {/* Flower / mandala geometry */}
        {[0, 45, 90, 135].map((rotation) => (
          <Line
            key={`cross-${rotation}`}
            x1="180"
            y1="270"
            x2="180"
            y2="340"
            stroke="#FFF2B8"
            strokeOpacity="0.45"
            strokeWidth="1"
            transform={`rotate(${rotation} 180 305)`}
          />
        ))}

        {[0, 60, 120].map((rotation) => (
          <Circle
            key={`petal-${rotation}`}
            cx="180"
            cy="270"
            fill="none"
            r="28"
            stroke="#FFE6A1"
            strokeOpacity="0.42"
            strokeWidth="1.4"
            transform={`rotate(${rotation} 180 305)`}
          />
        ))}

        <Circle
          cx="180"
          cy="305"
          fill="#FFF4BC"
          r="8"
        />

        <Circle
          cx="180"
          cy="305"
          fill="none"
          r="12"
          stroke="#FFFFFF"
          strokeOpacity="0.7"
        />

        {/* Orbit points */}
        {[
          [180, 222],
          [180, 388],
          [97, 305],
          [263, 305],
        ].map(([x, y], index) => (
          <Circle
            key={`orbit-${index}`}
            cx={x}
            cy={y}
            fill="#FFD166"
            opacity="0.65"
            r="3"
          />
        ))}

        {/* Learning nodes */}
        {NODES.map((node) => {
          const nodeColor = NODE_COLORS[node.type];
          const isCompleted = Boolean(node.completed);

          return (
            <View key={node.id}>
              <Circle
                cx={node.x}
                cy={node.y}
                fill={nodeColor}
                opacity={isCompleted ? 0.18 : 0.1}
                r="26"
              />

              <Circle
                cx={node.x}
                cy={node.y}
                fill={isCompleted ? nodeColor : '#17283D'}
                r={isCompleted ? 10 : 8}
                stroke={nodeColor}
                strokeOpacity={isCompleted ? 0.95 : 0.65}
                strokeWidth={2}
              />

              {isCompleted ? (
                <Circle
                  cx={node.x}
                  cy={node.y}
                  fill="#FFFFFF"
                  r="3"
                />
              ) : null}
            </View>
          );
        })}
      </Svg>

      {/* Touchable node layer */}
      {NODES.map((node) => (
        <Pressable
          key={`button-${node.id}`}
          accessibilityHint={`Open ${node.title}`}
          accessibilityLabel={`${node.title}${node.completed ? ', completed' : ''}`}
          accessibilityRole="button"
          onPress={() => onNodePress?.(node)}
          style={({ pressed }) => [
            styles.nodeButton,
            {
              left: `${((node.x - 24) / WIDTH) * 100}%`,
              top: `${((node.y - 24) / HEIGHT) * 100}%`,
            },
            pressed && styles.nodePressed,
          ]}
        />
      ))}

      {/* Labels */}
      {NODES.map((node) => (
        <LabelText
          key={`label-${node.id}`}
          x={node.x}
          y={node.y}
        >
          {node.title}
        </LabelText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    aspectRatio: WIDTH / HEIGHT,
    maxWidth: WIDTH,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },

  nodeButton: {
    height: 48,
    position: 'absolute',
    width: 48,
  },

  nodePressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },

  label: {
    alignItems: 'center',
    position: 'absolute',
    transform: [{ translateX: -50 }],
    width: 100,
  },

  labelText: {
    color: colors.onMidnight,
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    textAlign: 'center',
  },
});