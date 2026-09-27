import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';

type PartId = 'gear' | 'motor' | 'cycle' | 'motorCycle' | 'robot';

type Level = {
  id: number;
  title: string;
  subtitle: string;
  lesson: string;
  parts: PartId[];
};

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Gear',
    subtitle: 'How gears transfer motion',
    lesson: 'Place the gear on the machine.',
    parts: ['gear'],
  },
  {
    id: 2,
    title: 'Motor + Gear',
    subtitle: 'A motor creates rotation',
    lesson: 'Connect the motor to the gear.',
    parts: ['motor', 'gear'],
  },
  {
    id: 3,
    title: 'Cycle',
    subtitle: 'Pedals drive the wheel',
    lesson: 'Build the cycle mechanism.',
    parts: ['cycle'],
  },
  {
    id: 4,
    title: 'Motor + Cycle',
    subtitle: 'Power can drive a vehicle',
    lesson: 'Connect the motor to the cycle.',
    parts: ['motorCycle'],
  },
  {
    id: 5,
    title: 'Robot',
    subtitle: 'Machines come together',
    lesson: 'Assemble the robot and make it move.',
    parts: ['robot'],
  },
];

const COLORS = {
  background: '#FFF9F5',
  paper: '#FFFDFB',
  charcoal: '#34313A',
  muted: '#817985',
  purple: '#8B6FC7',
  purpleDark: '#7655B5',
  lavender: '#9B83D7',
  pink: '#E98FA3',
  peach: '#F2B38F',
  mint: '#86CDB1',
  sky: '#82B8E8',
  yellow: '#F2C96D',
  border: '#E8DDE7',
  softPurple: '#EEE7FA',
  softPink: '#FCE9EF',
  softBlue: '#E8F2FC',
  softMint: '#E4F4ED',
};

const PART_NAMES: Record<PartId, string> = {
  gear: 'Gear',
  motor: 'Motor',
  cycle: 'Cycle',
  motorCycle: 'Motor Cycle',
  robot: 'Robot',
};

const PART_COLORS: Record<PartId, string> = {
  gear: COLORS.lavender,
  motor: COLORS.peach,
  cycle: COLORS.sky,
  motorCycle: COLORS.mint,
  robot: COLORS.yellow,
};

function createGear(radius: number, teeth: number, depth: number) {
  const shape = new THREE.Shape();

  for (let i = 0; i < teeth * 4; i += 1) {
    const angle = (i / (teeth * 4)) * Math.PI * 2;
    const phase = i % 4;
    const r =
      phase === 0 || phase === 3
        ? radius
        : phase === 1 || phase === 2
          ? radius * 1.14
          : radius;

    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.035,
    bevelThickness: 0.04,
  });

  geometry.center();

  const material = new THREE.MeshStandardMaterial({
    color: COLORS.lavender,
    roughness: 0.55,
    metalness: 0.15,
  });

  const mesh = new THREE.Mesh(geometry, material);

  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, depth + 0.08, 24),
    new THREE.MeshStandardMaterial({
      color: COLORS.background,
      roughness: 0.8,
    }),
  );

  hole.rotation.x = Math.PI / 2;
  hole.position.z = 0;

  const group = new THREE.Group();
  group.add(mesh);
  group.add(hole);

  return group;
}

function createMotor() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.9, 0.8),
    new THREE.MeshStandardMaterial({
      color: COLORS.peach,
      roughness: 0.5,
    }),
  );

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.32, 24),
    new THREE.MeshStandardMaterial({
      color: COLORS.purple,
      roughness: 0.45,
    }),
  );

  cap.rotation.z = Math.PI / 2;
  cap.position.x = 0.76;

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.55, 16),
    new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      metalness: 0.65,
      roughness: 0.3,
    }),
  );

  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = 1.05;

  group.add(body);
  group.add(cap);
  group.add(shaft);

  return group;
}

function createWheel(radius: number) {
  const wheel = new THREE.Mesh(
    new THREE.TorusGeometry(radius, radius * 0.16, 12, 32),
    new THREE.MeshStandardMaterial({
      color: COLORS.sky,
      roughness: 0.5,
    }),
  );

  wheel.rotation.x = Math.PI / 2;

  return wheel;
}

function createCycle() {
  const group = new THREE.Group();

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.purple,
    roughness: 0.5,
  });

  const tube = (a: THREE.Vector3, b: THREE.Vector3) => {
    const direction = new THREE.Vector3().subVectors(b, a);
    const length = direction.length();

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, length, 10),
      frameMaterial,
    );

    mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );

    return mesh;
  };

  const left = new THREE.Vector3(-0.8, 0, 0);
  const right = new THREE.Vector3(0.8, 0, 0);
  const center = new THREE.Vector3(0, 0.72, 0);
  const top = new THREE.Vector3(0.5, 1.15, 0);

  group.add(tube(left, center));
  group.add(tube(center, right));
  group.add(tube(left, top));
  group.add(tube(top, center));
  group.add(tube(top, right));

  const wheelLeft = createWheel(0.62);
  wheelLeft.position.set(-0.85, -0.05, 0);

  const wheelRight = createWheel(0.62);
  wheelRight.position.set(0.85, -0.05, 0);

  group.add(wheelLeft);
  group.add(wheelRight);

  const pedal = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.035, 8, 20),
    new THREE.MeshStandardMaterial({
      color: COLORS.yellow,
      roughness: 0.45,
    }),
  );

  pedal.position.set(0, 0.72, 0);
  pedal.rotation.x = Math.PI / 2;

  group.add(pedal);

  return group;
}

function createRobot() {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: COLORS.yellow,
    roughness: 0.5,
  });

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.35, 0.75),
    material,
  );

  body.position.y = 0.05;

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.75, 0.7),
    new THREE.MeshStandardMaterial({
      color: COLORS.sky,
      roughness: 0.5,
    }),
  );

  head.position.y = 1.1;

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.purpleDark,
    emissive: COLORS.purple,
    emissiveIntensity: 0.25,
  });

  const eye1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    eyeMaterial,
  );

  const eye2 = eye1.clone();

  eye1.position.set(-0.22, 1.18, 0.38);
  eye2.position.set(0.22, 1.18, 0.38);

  const arm1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 1.0, 12),
    new THREE.MeshStandardMaterial({
      color: COLORS.peach,
      roughness: 0.5,
    }),
  );

  const arm2 = arm1.clone();

  arm1.position.set(-0.78, 0.05, 0);
  arm2.position.set(0.78, 0.05, 0);

  arm1.rotation.z = 0.25;
  arm2.rotation.z = -0.25;

  group.add(body);
  group.add(head);
  group.add(eye1);
  group.add(eye2);
  group.add(arm1);
  group.add(arm2);

  return group;
}

function createPart(part: PartId) {
  switch (part) {
    case 'gear':
      return createGear(0.72, 12, 0.22);
    case 'motor':
      return createMotor();
    case 'cycle':
      return createCycle();
    case 'motorCycle':
      return createMotor();
    case 'robot':
      return createRobot();
  }
}

export default function ManufacturingScreen() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [placed, setPlaced] = useState<PartId[]>([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('Touch a part and drag it into the machine.');
  const [ready, setReady] = useState(false);

  const level = LEVELS[levelIndex];

  const placedSet = useMemo(() => new Set(placed), [placed]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const machineRef = useRef<THREE.Group | null>(null);
  const trayRef = useRef<THREE.Group | null>(null);
  const targetsRef = useRef<Partial<Record<PartId, THREE.Group>>>({});
  const draggableRef = useRef<Partial<Record<PartId, THREE.Group>>>({});
  const activePartRef = useRef<PartId | null>(null);
  const animationRef = useRef<number | null>(null);

  const screenPoint = useRef({ x: 0, y: 0 });
  const mouseDownRef = useRef(false);

  const resetScene = () => {
    setPlaced([]);
    setRunning(false);
    setMessage('Touch a part and drag it into the machine.');

    Object.values(draggableRef.current).forEach((part) => {
      if (part) {
        part.visible = true;
      }
    });

    Object.values(targetsRef.current).forEach((target) => {
      if (target) {
        target.visible = false;
      }
    });
  };

  useEffect(() => {
    resetScene();
  }, [levelIndex]);

  useEffect(() => {
    const allPlaced = level.parts.every((part) => placedSet.has(part));

    if (allPlaced && !running) {
      setMessage('Great! Press RUN MACHINE.');
    }
  }, [placedSet, level.parts, running]);

  const onContextCreate = async (gl: any) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.background);

    const camera = new THREE.PerspectiveCamera(
      45,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100,
    );

    camera.position.set(0, 1.5, 8);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({
      context: gl,
      antialias: true,
    });

    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setPixelRatio(1);

    const ambient = new THREE.AmbientLight('#FFFFFF', 2.2);
    scene.add(ambient);

    const key = new THREE.DirectionalLight('#FFFFFF', 2.5);
    key.position.set(3, 6, 5);
    scene.add(key);

    const machine = new THREE.Group();

    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.28, 2.2),
      new THREE.MeshStandardMaterial({
        color: COLORS.paper,
        roughness: 0.75,
      }),
    );

    platform.position.y = -0.55;
    machine.add(platform);

    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 2.5, 0.3),
      new THREE.MeshStandardMaterial({
        color: COLORS.softBlue,
        roughness: 0.8,
      }),
    );

    panel.position.set(0, 0.65, -0.55);
    machine.add(panel);

    scene.add(machine);

    const tray = new THREE.Group();
    scene.add(tray);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    machineRef.current = machine;
    trayRef.current = tray;

    targetsRef.current = {};
    draggableRef.current = {};

    const xPositions = [-2.0, -0.7, 0.7, 2.0];

    level.parts.forEach((part, index) => {
      const object = createPart(part);
      object.position.set(xPositions[index] ?? 0, -0.05, 0.5);
      object.scale.setScalar(part === 'robot' ? 0.8 : 0.75);
      object.userData.partId = part;

      tray.add(object);
      draggableRef.current[part] = object;

      const target = new THREE.Group();
      target.position.set(
        part === 'motor' ? -0.9 : part === 'gear' ? 0.9 : 0,
        part === 'robot' ? 0.35 : 0.15,
        0.2,
      );

      target.scale.setScalar(part === 'robot' ? 0.8 : 0.75);
      target.userData.partId = part;

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.43, 32),
        new THREE.MeshBasicMaterial({
          color: PART_COLORS[part],
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        }),
      );

      ring.rotation.x = Math.PI / 2;
      target.add(ring);

      target.visible = false;
      machine.add(target);
      targetsRef.current[part] = target;
    });

    setReady(true);

    const render = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return;
      }

      if (running) {
        Object.values(targetsRef.current).forEach((target) => {
          if (target?.visible) {
            target.rotation.z += 0.025;
          }
        });
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
      animationRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const getPointerWorld = (x: number, y: number) => {
    const camera = cameraRef.current;
    if (!camera) return new THREE.Vector3();

    const vector = new THREE.Vector3(
      (x / 360) * 2 - 1,
      -(y / 360) * 2 + 1,
      0.5,
    );

    vector.unproject(camera);

    const direction = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / direction.z;

    return camera.position.clone().add(direction.multiplyScalar(distance));
  };

  const handleTouchStart = (event: any) => {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    mouseDownRef.current = true;

    screenPoint.current = { x, y };

    const camera = cameraRef.current;
    const tray = trayRef.current;

    if (!camera || !tray) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (x / 360) * 2 - 1,
      -(y / 360) * 2 + 1,
    );

    raycaster.setFromCamera(mouse, camera);

    const objects = Object.values(draggableRef.current).filter(
      (item): item is THREE.Group => Boolean(item && item.visible),
    );

    const hits = raycaster.intersectObjects(objects, true);

    if (hits.length === 0) return;

    let node: THREE.Object3D | null = hits[0].object;

    while (node && !node.userData.partId) {
      node = node.parent;
    }

    const part = node?.userData.partId as PartId | undefined;

    if (part && level.parts.includes(part)) {
      activePartRef.current = part;
      setMessage(`Move the ${PART_NAMES[part]} to its matching place.`);
    }
  };

  const handleTouchMove = (event: any) => {
    const part = activePartRef.current;
    const object = part ? draggableRef.current[part] : undefined;

    if (!part || !object) return;

    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    const world = getPointerWorld(x, y);

    object.position.x = THREE.MathUtils.clamp(world.x, -2.6, 2.6);
    object.position.y = THREE.MathUtils.clamp(world.y, -0.2, 2.0);
  };

  const handleTouchEnd = () => {
    mouseDownRef.current = false;
    const part = activePartRef.current;

    if (!part) return;

    const object = draggableRef.current[part];
    const target = targetsRef.current[part];

    if (!object || !target) {
      activePartRef.current = null;
      return;
    }

    const distance = object.position.distanceTo(target.position);

    if (distance < 1.15) {
      object.visible = false;
      target.visible = true;
      setPlaced((current) =>
        current.includes(part) ? current : [...current, part],
      );
      setMessage(`${PART_NAMES[part]} connected.`);
    } else {
      const trayIndex = level.parts.indexOf(part);
      const xPositions = [-2.0, -0.7, 0.7, 2.0];
      object.position.set(xPositions[trayIndex] ?? 0, -0.05, 0.5);
      setMessage('Try the matching machine area.');
    }

    activePartRef.current = null;
  };

  const runMachine = () => {
    const complete = level.parts.every((part) => placedSet.has(part));

    if (!complete) {
      setMessage('Finish connecting the parts first.');
      return;
    }

    setRunning(true);
    setMessage('Machine running! Watch the motion.');

    setTimeout(() => {
      setRunning(false);
      setMessage('Lesson complete. Move to the next machine.');
    }, 4500);
  };

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((value) => value + 1);
    }
  };

  const previousLevel = () => {
    if (levelIndex > 0) {
      setLevelIndex((value) => value - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event?.key === 'r' || event?.key === 'R') {
        resetScene();
      }

      if (event?.key === 'ArrowLeft') {
        previousLevel();
      }

      if (event?.key === 'ArrowRight') {
        nextLevel();
      }

      if (event?.key === 'Enter' || event?.key === ' ') {
        runMachine();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }

    return undefined;
  }, [levelIndex, placedSet, running]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>TECH WORKSHOP</Text>
            <Text style={styles.title}>{level.title}</Text>
            <Text style={styles.subtitle}>{level.subtitle}</Text>
          </View>

          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{level.id}</Text>
            <Text style={styles.levelTotal}>/ 5</Text>
          </View>
        </View>

        <View style={styles.lessonRow}>
          <View style={styles.lessonDot} />
          <Text style={styles.lessonText}>{level.lesson}</Text>
        </View>

        <View style={styles.progressRow}>
          {LEVELS.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.progressDot,
                index <= levelIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.partsLabelRow}>
          <Text style={styles.partsLabel}>PARTS</Text>
          <Text style={styles.partsHint}>Hold and drag</Text>
        </View>

        <View style={styles.partsRow}>
          {level.parts.map((part) => (
            <View
              key={part}
              style={[
                styles.partChip,
                {
                  backgroundColor: placedSet.has(part)
                    ? COLORS.softMint
                    : COLORS.paper,
                },
              ]}
            >
              <View
                style={[
                  styles.partDot,
                  { backgroundColor: PART_COLORS[part] },
                ]}
              />
              <Text style={styles.partName}>{PART_NAMES[part]}</Text>
              {placedSet.has(part) && (
                <Text style={styles.check}>✓</Text>
              )}
            </View>
          ))}
        </View>

        <View
          style={styles.machine}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        >
          <GLView
            style={styles.gl}
            onContextCreate={onContextCreate}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouchMove}
            onResponderRelease={handleTouchEnd}
            onResponderTerminate={handleTouchEnd}
          />

          <View pointerEvents="none" style={styles.machineCaption}>
            <Text style={styles.machineCaptionText}>
              {running ? 'MACHINE RUNNING' : 'WORKSHOP'}
            </Text>
          </View>

          {!ready && (
            <View pointerEvents="none" style={styles.loading}>
              <Text style={styles.loadingText}>Preparing workshop…</Text>
            </View>
          )}
        </View>

        <Text style={styles.status}>{message}</Text>

        <View style={styles.controls}>
          <Pressable
            style={[
              styles.secondaryButton,
              levelIndex === 0 && styles.disabledButton,
            ]}
            disabled={levelIndex === 0}
            onPress={previousLevel}
          >
            <Text style={styles.secondaryText}>BACK</Text>
          </Pressable>

          <Pressable
            style={[
              styles.runButton,
              (!level.parts.every((part) => placedSet.has(part)) || running) &&
                styles.runButtonDisabled,
            ]}
            disabled={
              !level.parts.every((part) => placedSet.has(part)) || running
            }
            onPress={runMachine}
          >
            <Text style={styles.runText}>
              {running ? 'RUNNING…' : 'RUN MACHINE'}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              levelIndex === LEVELS.length - 1 && styles.disabledButton,
            ]}
            disabled={levelIndex === LEVELS.length - 1}
            onPress={nextLevel}
          >
            <Text style={styles.secondaryText}>NEXT</Text>
          </Pressable>
        </View>

        <Pressable style={styles.resetButton} onPress={resetScene}>
          <Text style={styles.resetText}>Reset machine</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  root: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 2,
    color: COLORS.charcoal,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 14,
  },
  levelBadge: {
    minWidth: 58,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: COLORS.softPurple,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  levelNumber: {
    color: COLORS.purpleDark,
    fontSize: 20,
    fontWeight: '800',
  },
  levelTotal: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lessonDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.purple,
    marginRight: 9,
  },
  lessonText: {
    flex: 1,
    color: COLORS.charcoal,
    fontSize: 13,
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
  },
  progressDot: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.purple,
  },
  partsLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 7,
  },
  partsLabel: {
    color: COLORS.charcoal,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  partsHint: {
    color: COLORS.muted,
    fontSize: 11,
  },
  partsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  partChip: {
    minHeight: 40,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  partDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 7,
  },
  partName: {
    color: COLORS.charcoal,
    fontSize: 12,
    fontWeight: '700',
  },
  check: {
    color: COLORS.mint,
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 7,
  },
  machine: {
    flex: 1,
    minHeight: 300,
    marginTop: 12,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gl: {
    flex: 1,
  },
  machineCaption: {
    position: 'absolute',
    left: 16,
    top: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,253,251,0.9)',
  },
  machineCaptionText: {
    color: COLORS.purpleDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  status: {
    minHeight: 34,
    marginTop: 8,
    color: COLORS.muted,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryButton: {
    minWidth: 64,
    height: 46,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryText: {
    color: COLORS.charcoal,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  runButton: {
    flex: 1,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.purple,
  },
  runButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  runText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  disabledButton: {
    opacity: 0.45,
  },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  resetText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
  },
});
