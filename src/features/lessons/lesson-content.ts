export type VisualType =
  | 'vibration'
  | 'frequency'
  | 'rhythm'
  | 'melody'
  | 'gear'
  | 'gear-direction'
  | 'gear-size'
  | 'gear-train'
  | 'machine'
  | 'gear-drawing'
  | 'motion'
  | 'force'
  | 'friction'
  | 'gravity'
  | 'energy'
  | 'momentum'
  | 'machines'
  | 'water'
  | 'pipes'
  | 'logic'
  | 'circuit'
  | 'binary'
  | 'code'
  | 'numbers'
  | 'base'
  | 'crosswise'
  | 'mental'
  | 'patterns'
  | 'shopping'
  | 'drawing'
  | 'paper'
  | 'model'
  | 'food'
  | 'body'
  | 'nature'
  | 'humanity';

export type LessonContent = {
  title: string;

  image?: any;
  showImage: boolean;

  showText: boolean;
  description?: string;

  showSound: boolean;
  sound?: any;

  visualType?: VisualType;
};

export const LESSON_CONTENT: Record<string, LessonContent> = {
  /*
   * ============================================================
   * MUSIC
   * ============================================================
   */

  music: {
    title: 'Vibration',
    image: require('../../../assets/images/music/vibration.svg'),
    showImage: true,
    showText: true,
    description: 'Sound begins when something vibrates.',
    showSound: true,
    sound: require('../../../assets/audio/music/middle.wav'),
    visualType: 'vibration',
  },

  'music-01': {
    title: 'Vibration',
    image: require('../../../assets/images/music/vibration.svg'),
    showImage: true,
    showText: true,
    description: 'Move the source and watch the vibration travel.',
    showSound: true,
    sound: require('../../../assets/audio/music/middle.wav'),
    visualType: 'vibration',
  },

  'music-02': {
    title: 'Pitch',
    image: require('../../../assets/images/music/frequency.svg'),
    showImage: true,
    showText: true,
    description: 'Faster vibrations create a higher pitch.',
    showSound: true,
    sound: require('../../../assets/audio/music/high.wav'),
    visualType: 'frequency',
  },

  'music-03': {
    title: 'Rhythm',
    image: require('../../../assets/images/music/rhythm.svg'),
    showImage: true,
    showText: true,
    description: 'Rhythm places sounds and silences into patterns.',
    showSound: true,
    sound: require('../../../assets/audio/music/click.wav'),
    visualType: 'rhythm',
  },

  'music-04': {
    title: 'Melody',
    image: require('../../../assets/images/music/melody.svg'),
    showImage: true,
    showText: true,
    description: 'A melody is a sequence of changing pitches.',
    showSound: true,
    sound: require('../../../assets/audio/music/middle.wav'),
    visualType: 'melody',
  },

  /*
   * ============================================================
   * MANUFACTURING
   * ============================================================
   */

  'manufacturing-01': {
    title: 'Meet the Gear',
    image: require('../../../assets/images/manufacturing/manufacturing.png'),
    showImage: true,
    showText: true,
    description: 'A gear transfers rotational motion through its teeth.',
    showSound: true,
    sound: require('../../../assets/audio/music/click.wav'),
    visualType: 'gear',
  },

  'manufacturing-02': {
    title: 'Gear Direction',
    image: require('../../../assets/images/manufacturing/gear-direction.png'),
    showImage: true,
    showText: true,
    description: 'Two connected gears rotate in opposite directions.',
    showSound: true,
    sound: require('../../../assets/audio/music/middle.wav'),
    visualType: 'gear-direction',
  },

  'manufacturing-03': {
    title: 'Gear Size',
    image: require('../../../assets/images/manufacturing/gear-size.png'),
    showImage: true,
    showText: true,
    description: 'Gear size changes the relationship between speed and turning force.',
    showSound: true,
    sound: require('../../../assets/audio/music/low.wav'),
    visualType: 'gear-size',
  },

  'manufacturing-04': {
    title: 'Gear Train',
    image: require('../../../assets/images/manufacturing/gear-train.png'),
    showImage: true,
    showText: true,
    description: 'Several gears can pass motion from one part to another.',
    showSound: true,
    sound: require('../../../assets/audio/music/middle.wav'),
    visualType: 'gear-train',
  },

  'manufacturing-05': {
    title: 'Observe the Machine',
    image: require('../../../assets/images/manufacturing/machine.png'),
    showImage: true,
    showText: true,
    description: 'Follow where motion enters, travels, changes and leaves.',
    showSound: true,
    sound: require('../../../assets/audio/music/low.wav'),
    visualType: 'machine',
  },

  'manufacturing-06': {
    title: 'Draw the Gear System',
    image: require('../../../assets/images/manufacturing/gear-drawing.png'),
    showImage: true,
    showText: true,
    description: 'Engineers use drawings to explain how mechanisms are arranged.',
    showSound: true,
    sound: require('../../../assets/audio/music/click.wav'),
    visualType: 'gear-drawing',
  },

  /*
   * ============================================================
   * PHYSICS
   * ============================================================
   */

  'physics-01': {
  image: require('../../../assets/images/physics/motion.png'),
    title: 'Motion',
    showImage: true,
    showText: true,
    description: 'Motion describes how an object changes position.',
    showSound: false,
    visualType: 'motion',
  },

  'physics-02': {
  image: require('../../../assets/images/physics/force.png'),
    title: 'Force',
    showImage: true,
    showText: true,
    description: "A push or pull can change an object's motion.",
    showSound: false,
    visualType: 'force',
  },

  'physics-03': {
  image: require('../../../assets/images/physics/friction.png'),
    title: 'Friction',
    showImage: true,
    showText: true,
    description: 'Surfaces can resist motion when they rub against each other.',
    showSound: false,
    visualType: 'friction',
  },

  'physics-04': {
  image: require('../../../assets/images/physics/gravity.png'),
    title: 'Gravity',
    showImage: true,
    showText: true,
    description: 'Gravity pulls objects toward Earth.',
    showSound: false,
    visualType: 'gravity',
  },

  'physics-05': {
  image: require('../../../assets/images/physics/energy.png'),
    title: 'Energy',
    showImage: true,
    showText: true,
    description: 'Energy can be stored, transferred and transformed.',
    showSound: false,
    visualType: 'energy',
  },

  'physics-06': {
  image: require('../../../assets/images/physics/momentum.png'),
    title: 'Momentum',
    showImage: true,
    showText: true,
    description: 'Moving objects carry momentum that depends on their motion.',
    showSound: false,
    visualType: 'momentum',
  },

  'physics-07': {
  image: require('../../../assets/images/physics/machines.png'),
    title: 'Machines',
    showImage: true,
    showText: true,
    description: 'Machines help us redirect or use forces in useful ways.',
    showSound: false,
    visualType: 'machines',
  },

  /*
   * ============================================================
   * ELECTRONICS
   * ============================================================
   */

  'electronics-01': {
    title: 'Water Logic',
    image: require('../../../assets/images/electronics/water-logic.png'),
    showImage: true,
    showText: true,
    description: 'Follow the path and see how a flow can represent logic.',
    showSound: false,
    visualType: 'water',
  },

  'electronics-02': {
    title: 'Complex Pipes',
    image: require('../../../assets/images/electronics/complex-pipes.png'),
    showImage: true,
    showText: true,
    description: 'Branches and blockages change where the flow can travel.',
    showSound: false,
    visualType: 'pipes',
  },

  'electronics-03': {
    title: 'Logic Gates',
    image: require('../../../assets/images/electronics/logic-gates.png'),
    showImage: true,
    showText: true,
    description: 'Inputs combine through rules to produce an output.',
    showSound: false,
    visualType: 'logic',
  },

  'electronics-04': {
    title: 'Circuits',
    image: require('../../../assets/images/electronics/circuits.png'),
    showImage: true,
    showText: true,
    description: 'A complete circuit gives current a path to travel.',
    showSound: false,
    visualType: 'circuit',
  },

  'electronics-05': {
    title: 'Binary',
    image: require('../../../assets/images/electronics/binary.png'),
    showImage: true,
    showText: true,
    description: 'Digital systems represent information using two states.',
    showSound: false,
    visualType: 'binary',
  },

  'electronics-06': {
    title: 'Binary to Code',
    image: require('../../../assets/images/electronics/binary-to-code.png'),
    showImage: true,
    showText: true,
    description: 'Binary patterns can represent instructions and information.',
    showSound: false,
    visualType: 'code',
  },

  /*
   * ============================================================
   * VEDIC MATHS
   * ============================================================
   */

  'vedic-number-sense-01': {
    title: 'Number Relationships',
    showImage: false,
    showText: true,
    description: 'Numbers can be grouped, compared and related in different ways.',
    showSound: false,
    visualType: 'numbers',
  },

  'vedic-number-sense-02': {
    title: 'Complements',
    showImage: false,
    showText: true,
    description: 'See how numbers complete a base such as 10 or 100.',
    showSound: false,
    visualType: 'base',
  },

  'vedic-number-sense-03': {
    title: 'Mental Estimation',
    showImage: false,
    showText: true,
    description: 'Estimate first, then calculate with confidence.',
    showSound: false,
    visualType: 'mental',
  },

  'vedic-near-base-01': {
    title: 'Base 10',
    showImage: false,
    showText: true,
    description: 'Numbers close to a base can be handled using their difference from it.',
    showSound: false,
    visualType: 'base',
  },

  'vedic-near-base-02': {
    title: 'Base 100',
    showImage: false,
    showText: true,
    description: 'A larger base makes near-base calculations easier to see.',
    showSound: false,
    visualType: 'base',
  },

  'vedic-near-base-03': {
    title: 'Nikhilam',
    showImage: false,
    showText: true,
    description: 'Use complements from the base to simplify multiplication.',
    showSound: false,
    visualType: 'base',
  },

  'vedic-crosswise-01': {
    title: 'Vertical',
    showImage: false,
    showText: true,
    description: 'Break multiplication into visible parts.',
    showSound: false,
    visualType: 'crosswise',
  },

  'vedic-crosswise-02': {
    title: 'Crosswise',
    showImage: false,
    showText: true,
    description: 'Crosswise multiplication connects the parts of two numbers.',
    showSound: false,
    visualType: 'crosswise',
  },

  'vedic-crosswise-03': {
    title: 'Urdhva Tiryak',
    showImage: false,
    showText: true,
    description: 'Watch the multiplication build step by step.',
    showSound: false,
    visualType: 'crosswise',
  },

  'vedic-mental-01': {
    title: 'Yavadunam',
    showImage: false,
    showText: true,
    description: 'Use the difference from a nearby base.',
    showSound: false,
    visualType: 'mental',
  },

  'vedic-mental-02': {
    title: 'Antyayordashakepi',
    showImage: false,
    showText: true,
    description: 'Look for useful relationships between the final digits.',
    showSound: false,
    visualType: 'mental',
  },

  'vedic-mental-03': {
    title: 'Fast Calculation',
    showImage: false,
    showText: true,
    description: 'Choose a useful mental shortcut instead of calculating blindly.',
    showSound: false,
    visualType: 'mental',
  },

  'vedic-patterns-01': {
    title: 'Number Patterns',
    showImage: false,
    showText: true,
    description: 'Watch numbers reveal repeating structures.',
    showSound: false,
    visualType: 'patterns',
  },

  'vedic-patterns-02': {
    title: 'Relationships',
    showImage: false,
    showText: true,
    description: 'Find how one number changes when another changes.',
    showSound: false,
    visualType: 'patterns',
  },

  'vedic-patterns-03': {
    title: 'Algebra Patterns',
    showImage: false,
    showText: true,
    description: 'A number pattern can reveal an algebraic relationship.',
    showSound: false,
    visualType: 'patterns',
  },

  'vedic-real-world-01': {
    title: 'Shopping',
    showImage: false,
    showText: true,
    description: 'Use mental maths while comparing prices.',
    showSound: false,
    visualType: 'shopping',
  },

  'vedic-real-world-02': {
    title: 'Money',
    showImage: false,
    showText: true,
    description: 'Calculate change and totals quickly.',
    showSound: false,
    visualType: 'shopping',
  },

  'vedic-real-world-03': {
    title: 'Estimation',
    showImage: false,
    showText: true,
    description: 'Estimate a real-world total before checking the exact answer.',
    showSound: false,
    visualType: 'shopping',
  },

  /*
   * ============================================================
   * ARTS
   * ============================================================
   */

  'arts-drawing-01': {
    image: require('../../../assets/images/arts/drawing.png'),
    title: 'Circle Family',
    showImage: true,
    showText: true,
    description: 'Simple circles can become the foundation of drawings.',
    showSound: false,
    visualType: 'drawing',
  },

  'arts-drawing-02': {
    title: 'Triangle Family',
    showImage: false,
    showText: true,
    description: 'Triangles can become structures, objects and characters.',
    showSound: false,
    visualType: 'drawing',
  },

  'arts-drawing-03': {
    title: 'Square and Rectangle Family',
    showImage: false,
    showText: true,
    description: 'Simple shapes can be combined into useful forms.',
    showSound: false,
    visualType: 'drawing',
  },

  'arts-drawing-04': {
    title: 'Build a Drawing',
    showImage: false,
    showText: true,
    description: 'Combine simple shapes into a complete drawing.',
    showSound: false,
    visualType: 'drawing',
  },

  'arts-diy-01': {
    image: require('../../../assets/images/arts/arts.png'),
    title: 'See Before You Build',
    showImage: true,
    showText: true,
    description: 'Good builders observe the object before choosing materials.',
    showSound: false,
    visualType: 'paper',
  },

  'arts-diy-02': {
    title: 'Paper Engineering',
    showImage: false,
    showText: true,
    description: 'Folds and structures can make flat paper useful.',
    showSound: false,
    visualType: 'paper',
  },

  'arts-diy-03': {
    title: 'Build From Pictures',
    showImage: false,
    showText: true,
    description: 'Turn a visual plan into a real object.',
    showSound: false,
    visualType: 'model',
  },

  'arts-models-01': {
    image: require('../../../assets/images/arts/3dmodel.jpeg'),
    title: 'Template to Model',
    showImage: true,
    showText: true,
    description: 'A flat template can become a three-dimensional form.',
    showSound: false,
    visualType: 'model',
  },

  'arts-models-02': {
    title: 'Cardboard Structure',
    showImage: false,
    showText: true,
    description: 'Structure determines whether a model stays strong.',
    showSound: false,
    visualType: 'model',
  },

  'arts-models-03': {
    title: 'Build a Machine Model',
    showImage: false,
    showText: true,
    description: 'Combine structure and moving parts into a simple model.',
    showSound: false,
    visualType: 'model',
  },

  /*
   * ============================================================
   * OTHER SUBJECTS
   * ============================================================
   */

  nutrition: {
    title: 'Food Explorer',
    showImage: false,
    showText: true,
    description: 'Explore how food supports an active body.',
    showSound: false,
    visualType: 'food',
  },

  'nutrition-01': {
  image: require('../../../assets/images/nutrition/food-explorer.png'),
    title: 'Food Explorer',
    showImage: true,
    showText: true,
    description: 'Different foods provide different useful nutrients.',
    showSound: false,
    visualType: 'food',
  },

  'nutrition-02': {
  image: require('../../../assets/images/nutrition/vitamin-mineral-lab.png'),
    title: 'Vitamin and Mineral Lab',
    showImage: true,
    showText: true,
    description: 'Small nutrients can play important roles in the body.',
    showSound: false,
    visualType: 'food',
  },

  'nutrition-03': {
  image: require('../../../assets/images/nutrition/food-detective.png'),
    title: 'Food Detective',
    showImage: true,
    showText: true,
    description: 'Look closely at what is inside everyday foods.',
    showSound: false,
    visualType: 'food',
  },

  'nutrition-04': {
  image: require('../../../assets/images/nutrition/Wbalanced-plate.png'),
    title: 'Build a Balanced Plate',
    showImage: true,
    showText: true,
    description: 'Combine different kinds of food into a balanced meal.',
    showSound: false,
    visualType: 'food',
  },

  humanity: {
    image: require('../../../assets/images/humanity/humanity.png'),
    title: 'Humanity',
    showImage: true,
    showText: true,
    description: 'People understand, communicate and help one another.',
    showSound: false,
    visualType: 'humanity',
  },

  nature: {
    image: require('../../../assets/images/nature/nature.png'),
    title: 'Nature',
    showImage: true,
    showText: true,
    description: 'Living systems are connected through relationships and cycles.',
    showSound: false,
    visualType: 'nature',
  },
};
