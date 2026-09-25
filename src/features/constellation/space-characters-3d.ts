import * as THREE from 'three';

/* =========================================================
   MATERIALS
========================================================= */

const metal = new THREE.MeshStandardMaterial({
  color: '#b8c4d8',
  metalness: 0.85,
  roughness: 0.25,
});

const darkMetal = new THREE.MeshStandardMaterial({
  color: '#202a3d',
  metalness: 0.9,
  roughness: 0.2,
});

const white = new THREE.MeshStandardMaterial({
  color: '#e9f1ff',
  metalness: 0.25,
  roughness: 0.4,
});

const glass = new THREE.MeshPhysicalMaterial({
  color: '#42d9ff',
  metalness: 0.15,
  roughness: 0.05,
  transparent: true,
  opacity: 0.75,
});

const red = new THREE.MeshStandardMaterial({
  color: '#e84d5b',
  metalness: 0.5,
  roughness: 0.3,
});

const orange = new THREE.MeshStandardMaterial({
  color: '#ff8a32',
  emissive: '#ff3500',
  emissiveIntensity: 0.8,
});

const blue = new THREE.MeshStandardMaterial({
  color: '#4f8cff',
  emissive: '#123d99',
  emissiveIntensity: 0.5,
});


/* =========================================================
   HELPER
========================================================= */

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
) {
  return new THREE.Mesh(geometry, material);
}


/* =========================================================
   ROCKET
========================================================= */

export function createRocketModel() {
  const rocket = new THREE.Group();

  /*
    Main body
  */

  const body = mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 3.2, 32),
    white,
  );

  rocket.add(body);


  /*
    Nose cone
  */

  const nose = mesh(
    new THREE.ConeGeometry(0.62, 1.25, 32),
    white,
  );

  nose.position.y = 2.2;

  rocket.add(nose);


  /*
    Dark separation ring
  */

  const ring = mesh(
    new THREE.CylinderGeometry(0.66, 0.66, 0.15, 32),
    darkMetal,
  );

  ring.position.y = 1.25;

  rocket.add(ring);


  /*
    Rocket window
  */

  const windowOuter = mesh(
    new THREE.TorusGeometry(0.24, 0.07, 12, 32),
    darkMetal,
  );

  windowOuter.rotation.x = Math.PI / 2;
  windowOuter.position.set(0, 0.65, 0.58);

  rocket.add(windowOuter);

  const window = mesh(
    new THREE.SphereGeometry(0.21, 24, 16),
    glass,
  );

  window.scale.z = 0.35;
  window.position.set(0, 0.65, 0.61);

  rocket.add(window);


  /*
    Left fin
  */

  const finGeometry = new THREE.BufferGeometry();

  const finVertices = new Float32Array([
    0, 0, 0,
    0.9, -1.3, 0,
    0.65, 0.5, 0,
  ]);

  finGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(finVertices, 3),
  );

  finGeometry.computeVertexNormals();

  const leftFin = mesh(finGeometry, red);

  leftFin.position.x = -0.45;
  leftFin.rotation.y = Math.PI;

  rocket.add(leftFin);


  /*
    Right fin
  */

  const rightFin = mesh(
    finGeometry.clone(),
    red,
  );

  rightFin.position.x = 0.45;

  rocket.add(rightFin);


  /*
    Engine housing
  */

  const engine = mesh(
    new THREE.CylinderGeometry(0.48, 0.58, 0.5, 24),
    darkMetal,
  );

  engine.position.y = -1.8;

  rocket.add(engine);


  /*
    Engine nozzle
  */

  const nozzle = mesh(
    new THREE.ConeGeometry(0.32, 0.55, 24),
    metal,
  );

  nozzle.position.y = -2.25;

  rocket.add(nozzle);


  /*
    Flame
  */

  const flame = mesh(
    new THREE.ConeGeometry(0.28, 0.9, 20),
    orange,
  );

  flame.position.y = -2.85;

  rocket.add(flame);


  /*
    Small side antennas
  */

  for (const side of [-1, 1]) {
    const antenna = mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8),
      metal,
    );

    antenna.position.set(
      side * 0.65,
      0.15,
      0,
    );

    antenna.rotation.z = side * 0.35;

    rocket.add(antenna);
  }


  rocket.scale.setScalar(0.9);

  rocket.userData.spaceObject = 'rocket';

  return rocket;
}


/* =========================================================
   ASTRONAUT
========================================================= */

export function createAstronautModel() {
  const astronaut = new THREE.Group();


  /*
    Torso
  */

  const torso = mesh(
    new THREE.CapsuleGeometry(0.48, 0.85, 8, 16),
    white,
  );

  torso.position.y = 0;

  astronaut.add(torso);


  /*
    Life-support backpack
  */

  const backpack = mesh(
    new THREE.BoxGeometry(0.65, 0.95, 0.28),
    darkMetal,
  );

  backpack.position.set(0, 0, -0.48);

  astronaut.add(backpack);


  /*
    Helmet
  */

  const helmet = mesh(
    new THREE.SphereGeometry(0.58, 32, 24),
    white,
  );

  helmet.position.y = 0.95;

  astronaut.add(helmet);


  /*
    Helmet visor
  */

  const visor = mesh(
    new THREE.SphereGeometry(0.4, 32, 20),
    glass,
  );

  visor.scale.set(1, 0.72, 0.35);

  visor.position.set(
    0,
    0.95,
    0.48,
  );

  astronaut.add(visor);


  /*
    Chest control panel
  */

  const chest = mesh(
    new THREE.BoxGeometry(0.4, 0.3, 0.08),
    darkMetal,
  );

  chest.position.set(
    0,
    0.15,
    0.5,
  );

  astronaut.add(chest);


  /*
    Chest buttons
  */

  for (let i = 0; i < 3; i += 1) {
    const button = mesh(
      new THREE.SphereGeometry(0.035, 10, 10),
      i === 0 ? red : blue,
    );

    button.position.set(
      -0.12 + i * 0.12,
      0.15,
      0.56,
    );

    astronaut.add(button);
  }


  /*
    Arms
  */

  for (const side of [-1, 1]) {
    const arm = mesh(
      new THREE.CapsuleGeometry(0.16, 0.65, 6, 12),
      white,
    );

    arm.position.set(
      side * 0.7,
      0,
      0,
    );

    arm.rotation.z = side * 0.25;

    astronaut.add(arm);


    /*
      Gloves
    */

    const glove = mesh(
      new THREE.SphereGeometry(0.2, 16, 12),
      white,
    );

    glove.position.set(
      side * 0.88,
      -0.35,
      0,
    );

    astronaut.add(glove);
  }


  /*
    Legs
  */

  for (const side of [-1, 1]) {
    const leg = mesh(
      new THREE.CapsuleGeometry(0.18, 0.72, 6, 12),
      white,
    );

    leg.position.set(
      side * 0.27,
      -0.95,
      0,
    );

    astronaut.add(leg);


    /*
      Boots
    */

    const boot = mesh(
      new THREE.BoxGeometry(0.32, 0.22, 0.5),
      darkMetal,
    );

    boot.position.set(
      side * 0.27,
      -1.48,
      0.08,
    );

    astronaut.add(boot);
  }


  astronaut.scale.setScalar(0.85);

  astronaut.userData.spaceObject = 'astronaut';

  return astronaut;
}
