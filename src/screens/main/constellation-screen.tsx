import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Line,
  Polygon,
  Path,
} from 'react-native-svg';

import { Screen } from '@/components/screen';

type Node = {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  symbol: string;
  shape: 'star' | 'diamond' | 'hex' | 'orbit' | 'burst' | 'circle';
  unlocked: boolean;
  completed: boolean;
};

const VEDIC_NODES: Node[] = [
  {
    id: 'nikhilam',
    name: 'Nikhilam',
    subtitle: 'Base & complement',
    x: 75,
    y: 250,
    symbol: '',
    shape: 'star',
    unlocked: true,
    completed: false,
  },
  {
    id: 'ekadhikena',
    name: 'Ekadhikena',
    subtitle: 'One more than',
    x: 175,
    y: 125,
    symbol: '◆',
    shape: 'diamond',
    unlocked: false,
    completed: false,
  },
  {
    id: 'urdhva',
    name: 'Urdhva',
    subtitle: 'Vertical multiplication',
    x: 300,
    y: 180,
    symbol: '✧',
    shape: 'hex',
    unlocked: false,
    completed: false,
  },
  {
    id: 'yavadunam',
    name: 'Yavadunam',
    subtitle: 'Near a base',
    x: 400,
    y: 290,
    symbol: '∞',
    shape: 'orbit',
    unlocked: false,
    completed: false,
  },
  {
    id: 'antyayordashakepi',
    name: 'Antyayordashakepi',
    subtitle: 'Last digits',
    x: 285,
    y: 390,
    symbol: '⬡',
    shape: 'hex',
    unlocked: false,
    completed: false,
  },
  {
    id: 'mental-calculation',
    name: 'Mental Calculation',
    subtitle: 'Think faster',
    x: 130,
    y: 440,
    symbol: '✺',
    shape: 'burst',
    unlocked: false,
    completed: false,
  },
];

function ComplexNode({
  node,
  onPress,
}: {
  node: Node;
  onPress: () => void;
}) {
  const active = node.unlocked;
  const completed = node.completed;

  return (
    <Pressable
      onPress={onPress}
      disabled={!active}
      style={[
        styles.node,
        {
          left: node.x - 42,
          top: node.y - 42,
        },
      ]}
    >
      <View
        style={[
          styles.nodeGlow,
          active && styles.nodeGlowActive,
          completed && styles.nodeGlowCompleted,
        ]}
      />

      <View
        style={[
          styles.nodeOuter,
          active && styles.nodeOuterActive,
          completed && styles.nodeOuterCompleted,
        ]}
      >
        <View style={styles.innerOrbit} />

        <View
          style={[
            styles.nodeCore,
            active && styles.nodeCoreActive,
            completed && styles.nodeCoreCompleted,
          ]}
        >
          <Text style={styles.nodeSymbol}>
            {completed ? '★' : node.symbol}
          </Text>
        </View>

        <View style={styles.cornerA} />
        <View style={styles.cornerB} />
        <View style={styles.cornerC} />
        <View style={styles.cornerD} />
      </View>

      <View style={styles.nodeLabel}>
        <Text style={[styles.nodeName, active && styles.nodeNameActive]}>
          {node.name}
        </Text>

        <Text style={styles.nodeSubtitle}>
          {active ? node.subtitle : 'Discover later'}
        </Text>
      </View>
    </Pressable>
  );
}

function ConstellationMap() {
  const router = useRouter();

  const handleNodePress = (node: Node) => {
    if (!node.unlocked) return;

    if (node.id === 'nikhilam') {
      router.push('/curiosity/vedic/nikhilam');
      return;
    }

    // Other lessons can be connected here one by one.
  };

  return (
    <View style={styles.map}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 475 540"
        style={StyleSheet.absoluteFill}
      >
        {/* Main constellation paths */}
        <Line
          x1="75"
          y1="250"
          x2="175"
          y2="125"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2"
        />

        <Line
          x1="175"
          y1="125"
          x2="300"
          y2="180"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2"
        />

        <Line
          x1="300"
          y1="180"
          x2="400"
          y2="290"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
        />

        <Line
          x1="400"
          y1="290"
          x2="285"
          y2="390"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
        />

        <Line
          x1="285"
          y1="390"
          x2="130"
          y2="440"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2"
        />

        {/* Secondary mathematical geometry */}
        <Circle
          cx="238"
          cy="270"
          r="205"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        <Circle
          cx="238"
          cy="270"
          r="145"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        <Polygon
          points="238,30 265,75 238,120 211,75"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />

        <Path
          d="M 50 330 Q 238 80 425 330"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </Svg>

      {/* Central Vedic Maths symbol */}
      <View style={styles.center}>
        <View style={styles.centerRingOuter}>
          <View style={styles.centerRing}>
            <Text style={styles.centerSymbol}>∑</Text>
          </View>
        </View>

        <Text style={styles.centerTitle}>VEDIC MATHS</Text>
        <Text style={styles.centerSmall}>THE NUMBER SKY</Text>
      </View>

      {VEDIC_NODES.map((node) => (
        <ComplexNode
          key={node.id}
          node={node}
          onPress={() => handleNodePress(node)}
        />
      ))}
    </View>
  );
}

export function ConstellationScreen() {
  return (
    <Screen>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}> YOUR LEARNING UNIVERSE</Text>

          <Text style={styles.title}>Vedic Maths</Text>

          <Text style={styles.description}>
            Discover one mathematical idea at a time and build your constellation.
          </Text>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.legendDotActive} />
            <Text style={styles.legendText}>Ready to discover</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={styles.legendDotLocked} />
            <Text style={styles.legendText}>Waiting in the sky</Text>
          </View>
        </View>

        <ConstellationMap />

        <View style={styles.bottomCard}>

          <View style={styles.bottomCopy}>
            <Text style={styles.bottomTitle}>Your constellation grows</Text>

            <Text style={styles.bottomText}>
              Learn a concept, complete its challenge, and the next structure
              awakens.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 60,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 12,
  },

  kicker: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '800',
    color: '#BBA8FF',
    marginBottom: 8,
  },

  title: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.5,
    color: '#FFFFFF',
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.65)',
    maxWidth: 440,
  },

  legend: {
    flexDirection: 'row',
    gap: 18,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  legendDotActive: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: '#FFD86B',
  },

  legendDotLocked: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: '#756F91',
  },

  legendText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },

  map: {
    height: 560,
    marginTop: 8,
    marginHorizontal: 8,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#090A22',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  center: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 150,
    height: 150,
    marginLeft: -75,
    marginTop: -75,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerRingOuter: {
    width: 108,
    height: 108,
    borderRadius: 108,
    borderWidth: 1,
    borderColor: 'rgba(255,216,107,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerRing: {
    width: 78,
    height: 78,
    borderRadius: 78,
    backgroundColor: '#171533',
    borderWidth: 2,
    borderColor: '#FFD86B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerSymbol: {
    fontSize: 38,
    color: '#FFD86B',
    fontWeight: '900',
  },

  centerTitle: {
    marginTop: 8,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  centerSmall: {
    marginTop: 2,
    fontSize: 8,
    letterSpacing: 1.2,
    color: '#8C85AD',
  },

  node: {
    position: 'absolute',
    width: 84,
    height: 120,
    alignItems: 'center',
  },

  nodeGlow: {
    position: 'absolute',
    top: 3,
    width: 76,
    height: 76,
    borderRadius: 76,
    backgroundColor: 'rgba(92,82,140,0.12)',
  },

  nodeGlowActive: {
    backgroundColor: 'rgba(255,216,107,0.18)',
  },

  nodeGlowCompleted: {
    backgroundColor: 'rgba(116,255,203,0.22)',
  },

  nodeOuter: {
    width: 70,
    height: 70,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#55506F',
    backgroundColor: '#12132E',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },

  nodeOuterActive: {
    borderColor: '#FFD86B',
    backgroundColor: '#252044',
  },

  nodeOuterCompleted: {
    borderColor: '#74FFCB',
    backgroundColor: '#15352F',
  },

  innerOrbit: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  nodeCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#28243D',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },

  nodeCoreActive: {
    backgroundColor: '#5B4820',
  },

  nodeCoreCompleted: {
    backgroundColor: '#1D6651',
  },

  nodeSymbol: {
    fontSize: 25,
    color: '#AAA4C4',
    fontWeight: '900',
  },

  cornerA: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: '#756F91',
    top: -4,
    left: 31,
  },

  cornerB: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: '#756F91',
    bottom: -4,
    left: 31,
  },

  cornerC: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: '#756F91',
    left: -4,
    top: 31,
  },

  cornerD: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: '#756F91',
    right: -4,
    top: 31,
  },

  nodeLabel: {
    position: 'absolute',
    top: 78,
    width: 130,
    alignItems: 'center',
  },

  nodeName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C85AD',
    textAlign: 'center',
  },

  nodeNameActive: {
    color: '#FFFFFF',
  },

  nodeSubtitle: {
    marginTop: 2,
    fontSize: 8,
    color: '#6F6A88',
    textAlign: 'center',
  },

  bottomCard: {
    marginHorizontal: 18,
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#11122B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  bottomSymbol: {
    fontSize: 28,
    color: '#FFD86B',
  },

  bottomCopy: {
    flex: 1,
  },

  bottomTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  bottomText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.55)',
  },
});
