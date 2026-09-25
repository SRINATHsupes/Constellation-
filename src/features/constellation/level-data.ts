export type LevelNode = {
  id: string;
  level: number;
  title: string;
  route: string | null;
};

export const SUBJECT_LEVELS: Record<string, LevelNode[]> = {
  vedic: [
    { id: 'vedic-01', level: 1, title: 'Nikhilam', route: '/games/vedic' },
    { id: 'vedic-02', level: 2, title: 'Near-Base Mastery', route: '/games/vedic' },
    { id: 'vedic-03', level: 3, title: 'Urdhva Tiryak', route: '/games/vedic' },
    { id: 'vedic-04', level: 4, title: 'Yavadunam', route: '/games/vedic' },
    { id: 'vedic-05', level: 5, title: 'Antyayordashakepi', route: '/games/vedic' },
    { id: 'vedic-06', level: 6, title: 'Mental Calculation', route: '/games/vedic' },
  ],

  arts: [
    { id: 'arts-drawing-01', level: 1, title: 'Circle Family', route: '/games/arts?branch=drawing' },
    { id: 'arts-drawing-02', level: 2, title: 'Triangle Family', route: '/games/arts?branch=drawing' },
    { id: 'arts-drawing-03', level: 3, title: 'Square & Rectangle Family', route: '/games/arts?branch=drawing' },
    { id: 'arts-drawing-04', level: 4, title: 'Build a Drawing', route: '/games/arts?branch=drawing' },

    { id: 'arts-diy-01', level: 1, title: 'See Before You Build', route: '/games/arts?branch=diy' },
    { id: 'arts-diy-02', level: 2, title: 'Paper Engineering', route: '/games/arts?branch=diy' },
    { id: 'arts-diy-03', level: 3, title: 'Build From Pictures', route: '/games/arts?branch=diy' },

    { id: 'arts-models-01', level: 1, title: 'Template to Model', route: '/games/arts?branch=models' },
    { id: 'arts-models-02', level: 2, title: 'Cardboard Structure', route: '/games/arts?branch=models' },
    { id: 'arts-models-03', level: 3, title: 'Build a Machine Model', route: '/games/arts?branch=models' },
  ],

  physics: [
    { id: 'physics-01', level: 1, title: 'Motion', route: '/games/physics' },
    { id: 'physics-02', level: 2, title: 'Force', route: '/games/physics' },
    { id: 'physics-03', level: 3, title: 'Friction', route: '/games/physics' },
    { id: 'physics-04', level: 4, title: 'Gravity', route: '/games/physics' },
    { id: 'physics-05', level: 5, title: 'Energy', route: '/games/physics' },
    { id: 'physics-06', level: 6, title: 'Momentum', route: '/games/physics' },
    { id: 'physics-07', level: 7, title: 'Machines', route: '/games/physics' },
  ],

  nutrition: [
    { id: 'nutrition-01', level: 1, title: 'Food Explorer', route: '/games/nutrition' },
    { id: 'nutrition-02', level: 2, title: 'Vitamin & Mineral Lab', route: '/games/nutrition' },
    { id: 'nutrition-03', level: 3, title: 'Food Detective', route: '/games/nutrition' },
    { id: 'nutrition-04', level: 4, title: 'Build a Balanced Plate', route: '/games/nutrition' },
    { id: 'nutrition-05', level: 5, title: 'Label Detective', route: '/games/nutrition' },
    { id: 'nutrition-06', level: 6, title: 'Kitchen Mission', route: '/games/nutrition' },
  ],

  electronics: [
    { id: 'electronics-01', level: 1, title: 'Water Logic', route: '/games/electronics' },
    { id: 'electronics-02', level: 2, title: 'Complex Pipes', route: '/games/electronics' },
    { id: 'electronics-03', level: 3, title: 'Logic Gates', route: '/games/electronics' },
    { id: 'electronics-04', level: 4, title: 'Circuits', route: '/games/electronics' },
    { id: 'electronics-05', level: 5, title: 'Binary', route: '/games/electronics' },
    { id: 'electronics-06', level: 6, title: 'From Binary to Code', route: '/games/electronics' },
  ],

  manufacturing: [
    { id: 'manufacturing-01', level: 1, title: 'Materials', route: '/games/manufacturing' },
    { id: 'manufacturing-02', level: 2, title: 'Tools', route: '/games/manufacturing' },
    { id: 'manufacturing-03', level: 3, title: 'Machines', route: '/games/manufacturing' },
    { id: 'manufacturing-04', level: 4, title: 'Gears', route: '/games/manufacturing' },
    { id: 'manufacturing-05', level: 5, title: 'Production Line', route: '/games/manufacturing' },
    { id: 'manufacturing-06', level: 6, title: 'Quality Inspector', route: '/games/manufacturing' },
  ],

  music: [
    { id: 'music-01', level: 1, title: 'Vibration', route: '/games/music' },
    { id: 'music-02', level: 2, title: 'Frequency', route: '/games/music' },
    { id: 'music-03', level: 3, title: 'Rhythm', route: '/games/music' },
    { id: 'music-04', level: 4, title: 'Melody', route: '/games/music' },
  ],

  humanity: [
    { id: 'humanity-01', level: 1, title: 'Human Needs', route: '/games/humanity' },
    { id: 'humanity-02', level: 2, title: 'Empathy', route: '/games/humanity' },
    { id: 'humanity-03', level: 3, title: 'Communication', route: '/games/humanity' },
    { id: 'humanity-04', level: 4, title: 'Cooperation', route: '/games/humanity' },
    { id: 'humanity-05', level: 5, title: 'Community', route: '/games/humanity' },
    { id: 'humanity-06', level: 6, title: 'Help in Action', route: '/games/humanity' },
  ],

  nature: [
    { id: 'nature-01', level: 1, title: 'Plants', route: '/games/nature' },
    { id: 'nature-02', level: 2, title: 'Food Webs', route: '/games/nature' },
    { id: 'nature-03', level: 3, title: 'Ecosystems', route: '/games/nature' },
    { id: 'nature-04', level: 4, title: 'Restore', route: '/games/nature' },
  ],
};
