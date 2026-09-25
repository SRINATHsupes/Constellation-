import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  completeLevel,
  getCompletedLevels,
} from '@/features/progression/progression-store';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer } from 'expo-audio';
import { SvgUri } from 'react-native-svg';
import VisualLesson from '@/features/lessons/VisualLesson';
import { LESSON_CONTENT } from '@/features/lessons/lesson-content';

import { collectStar } from '@/features/stars/star-store';
import VedicEscape from '@/features/rooms/games/VedicEscape';
import MaterialsGame from '@/features/rooms/games/manufacturing/MaterialsGame';
import ToolsGame from '@/features/rooms/games/manufacturing/ToolsGame';
import MachinesGame from '@/features/rooms/games/manufacturing/MachinesGame';
import GearsGame from '@/features/rooms/games/manufacturing/GearsGame';
import ProductionLineGame from '@/features/rooms/games/manufacturing/ProductionLineGame';
import QualityInspectorGame from '@/features/rooms/games/manufacturing/QualityInspectorGame';
import ManufacturingChallengeGame from '@/features/rooms/games/manufacturing/ManufacturingChallengeGame';
import GearDrawingGame from '@/features/rooms/games/manufacturing/GearDrawingGame';
import PhysicsChallengeGame from '@/features/rooms/games/physics/PhysicsChallengeGame';
import NatureChallengeGame from '@/features/rooms/games/nature/NatureChallengeGame';
import WaterLogicGame from '@/features/rooms/games/electronics/WaterLogicGame';
import ComplexPipesGame from '@/features/rooms/games/electronics/ComplexPipesGame';
import LogicGateGame from '@/features/rooms/games/electronics/LogicGateGame';
import CircuitRepairGame from '@/features/rooms/games/electronics/CircuitRepairGame';
import BinaryGame from '@/features/rooms/games/electronics/BinaryGame';
import BinaryCodeGame from '@/features/rooms/games/electronics/BinaryCodeGame';



const { width } = Dimensions.get('window');

type Stage = 'learn' | 'experiment' | 'game' | 'build' | 'mission' | 'complete';

type Level = {
  id: string;
  title: string;
  subtitle: string;
  learn: string[];
  experiment: string;
  game: string;
  build: string;
  mission: string;
};

type Theme = {
  colors: readonly [string, string, string];
  accent: string;
  icon: string;
};

const THEMES: Record<string, Theme> = {
  vedic: {
    colors: ['#070B2A', '#32105E', '#1168C7'],
    accent: '#BFA2FF',
    icon: '∿',
  },
  arts: {
    colors: ['#26072F', '#9C2467', '#F07842'],
    accent: '#FFD166',
    icon: '✎',
  },
  physics: {
    colors: ['#06142E', '#243B83', '#613ED1'],
    accent: '#7DE7FF',
    icon: '◌',
  },
  electronics: {
    colors: ['#020713', '#063E63', '#612CFF'],
    accent: '#53E8FF',
    icon: '⚡',
  },
  nutrition: {
    colors: ['#061E18', '#08634E', '#B58C27'],
    accent: '#B9F27C',
    icon: '◒',
  },
  manufacturing: {
    colors: ['#091321', '#19456A', '#A65C2D'],
    accent: '#FFB86B',
    icon: '⚙',
  },
  music: {
    colors: ['#160827', '#522078', '#D13B9C'],
    accent: '#FFB7F0',
    icon: '♫',
  },
  humanity: {
    colors: ['#07152C', '#49305F', '#B75C68'],
    accent: '#FFD2B8',
    icon: '♡',
  },
  nature: {
    colors: ['#031812', '#096048', '#168C72'],
    accent: '#9EF2B5',
    icon: '❧',
  },
};

const LEVELS: Record<string, Level[]> = {
  vedic: [
  {
    id: 'vedic-number-sense-01',
    title: 'Number Relationships',
    subtitle: 'See how numbers connect',
    learn: [
      'Numbers are not isolated; they have relationships with other numbers.',
      'Place value helps us understand what each digit represents.',
      'Seeing these relationships makes mental calculation easier.',
    ],
    experiment: 'Move digits around and observe how the value of a number changes.',
    game: 'Connect numbers that have the relationship shown by the chamber.',
    build: 'Write a few numbers and mark the tens and ones.',
    mission: 'Notice one number relationship in everyday life today.',
  },
  {
    id: 'vedic-number-sense-02',
    title: 'Complements',
    subtitle: 'Discover the number that completes another',
    learn: [
      'A complement is the amount needed to reach a chosen base.',
      'For 8 and 10, the complement of 8 is 2.',
      'Complements can make mental calculations much faster.',
    ],
    experiment: 'Change a number and watch its complement to 10 or 100 appear.',
    game: 'Find the missing number that completes the base.',
    build: 'Make your own complement pairs for 10 and 100.',
    mission: 'Use complements when making a quick calculation today.',
  },
  {
    id: 'vedic-number-sense-03',
    title: 'Mental Estimation',
    subtitle: 'Think about the answer before calculating',
    learn: [
      'Estimation gives us a quick idea of what an answer should be.',
      'Nearby numbers can make difficult calculations easier to imagine.',
      'A good estimate helps us notice unreasonable answers.',
    ],
    experiment: 'Move numbers closer to simple values and compare the estimate.',
    game: 'Choose the answer range that the calculation should fall into.',
    build: 'Estimate the total of a few safe everyday objects.',
    mission: 'Estimate a price or quantity before checking the actual value.',
  },

  {
    id: 'vedic-near-base-01',
    title: 'Base 10',
    subtitle: 'Discover numbers close to a base',
    learn: [
      'A base gives us a convenient number to calculate around.',
      '10 is a simple base for small numbers.',
      'Thinking around a base can simplify multiplication.',
    ],
    experiment: 'Move numbers around 10 and observe their distance from the base.',
    game: 'Use the base to solve the multiplication chamber.',
    build: 'Write numbers near 10 and mark how far each is from it.',
    mission: 'Find a calculation where using 10 as a reference helps.',
  },
  {
    id: 'vedic-near-base-02',
    title: 'Base 100',
    subtitle: 'Work with numbers near 100',
    learn: [
      'The same base idea can be used with 100.',
      '98 is two below 100, while 103 is three above 100.',
      'These differences become useful parts of a Vedic calculation.',
    ],
    experiment: 'Move numbers around 100 and reveal their differences from the base.',
    game: 'Solve near-100 multiplication using the displayed differences.',
    build: 'Create three numbers close to 100 and write their differences.',
    mission: 'Use a near-100 estimate when checking an everyday calculation.',
  },
  {
    id: 'vedic-near-base-03',
    title: 'Nikhilam',
    subtitle: 'Multiply quickly using the base',
    learn: [
      'Nikhilam uses a nearby base and the differences from that base.',
      'Numbers such as 98 and 97 are both close to 100.',
      'The method turns the calculation into smaller parts.',
    ],
    experiment: 'Watch 98 and 97 move around the base 100 and reveal their differences.',
    game: 'Open the lock by solving near-100 multiplication with Nikhilam.',
    build: 'Write one near-base multiplication and show the differences.',
    mission: 'Use a simple near-base calculation in a real-world estimate.',
  },

  {
    id: 'vedic-crosswise-01',
    title: 'Vertical',
    subtitle: 'Build multiplication from the place values',
    learn: [
      'Multiplication can be built from separate place-value parts.',
      'Vertical multiplication begins with corresponding digits.',
      'The pieces can then be combined into one answer.',
    ],
    experiment: 'Separate two numbers into their place-value parts and recombine them.',
    game: 'Complete the vertical calculation one part at a time.',
    build: 'Draw the place-value structure of a two-digit multiplication.',
    mission: 'Break one multiplication into smaller parts before solving it.',
  },
  {
    id: 'vedic-crosswise-02',
    title: 'Crosswise',
    subtitle: 'Let the digits work across each other',
    learn: [
      'Crosswise multiplication combines products from different digit positions.',
      'Each digit contributes to more than one part of the answer.',
      'The method creates a structured mental calculation.',
    ],
    experiment: 'Animate the vertical and crosswise paths between the digits.',
    game: 'Follow the correct crosswise paths to unlock the answer.',
    build: 'Draw arrows showing the crosswise multiplication paths.',
    mission: 'Try explaining the crosswise idea using your own drawing.',
  },
  {
    id: 'vedic-crosswise-03',
    title: 'Urdhva Tiryak',
    subtitle: 'Use the vertical-and-crosswise method',
    learn: [
      'Urdhva Tiryak means a vertical-and-crosswise approach.',
      'The method organizes multiplication into a sequence of partial products.',
      'The same structure can extend to larger numbers.',
    ],
    experiment: 'Watch the multiplication build from right to left.',
    game: 'Repair the calculation by placing each partial product correctly.',
    build: 'Create your own two-digit Urdhva Tiryak diagram.',
    mission: 'Use the method on a small multiplication and explain the steps.',
  },

  {
    id: 'vedic-mental-01',
    title: 'Yavadunam',
    subtitle: 'Use the amount a number is away',
    learn: [
      'Yavadunam uses how much a number differs from a nearby base.',
      'The difference can become part of a faster calculation.',
      'The idea is especially useful with numbers close to a base.',
    ],
    experiment: 'Move a number toward a base and watch its difference change.',
    game: 'Use the difference from the base to open the mental-maths lock.',
    build: 'Draw a number, its base and the difference between them.',
    mission: 'Look for a number close to 10 or 100 and identify its difference.',
  },
  {
    id: 'vedic-mental-02',
    title: 'Antyayordashakepi',
    subtitle: 'Discover a special ending pattern',
    learn: [
      'Some Vedic methods use relationships between the final digits.',
      'Antyayordashakepi is associated with numbers whose final digits combine to 10.',
      'Recognising the pattern can simplify particular calculations.',
    ],
    experiment: 'Change the final digits and observe when the pattern becomes active.',
    game: 'Find the pair whose final digits satisfy the required pattern.',
    build: 'Create several pairs whose final digits add to 10.',
    mission: 'Look for a real calculation where a useful ending pattern appears.',
  },
  {
    id: 'vedic-mental-03',
    title: 'Fast Calculation',
    subtitle: 'Choose the right mental pathway',
    learn: [
      'Different calculations can benefit from different mental strategies.',
      'The goal is not one trick for everything.',
      'Good mental maths means recognising which structure is useful.',
    ],
    experiment: 'Try the same calculation using two different mental pathways.',
    game: 'Choose the pathway that makes the calculation simplest.',
    build: 'Write down your own fastest method for a small calculation.',
    mission: 'Solve one everyday calculation mentally before reaching for a calculator.',
  },

  {
    id: 'vedic-patterns-01',
    title: 'Number Patterns',
    subtitle: 'Discover what changes and what stays',
    learn: [
      'Numbers can follow repeating or growing patterns.',
      'A pattern can help us predict the next value.',
      'Finding the rule is more important than memorising the sequence.',
    ],
    experiment: 'Change the pattern rule and watch the sequence grow.',
    game: 'Repair the broken number pattern.',
    build: 'Create your own short number pattern.',
    mission: 'Find a number pattern in something you see today.',
  },
  {
    id: 'vedic-patterns-02',
    title: 'Relationships',
    subtitle: 'Find the hidden connection',
    learn: [
      'Mathematical relationships describe how numbers change together.',
      'The same relationship can appear in different forms.',
      'Recognising a relationship helps us calculate and predict.',
    ],
    experiment: 'Change one number and observe how the related number responds.',
    game: 'Discover the hidden rule connecting the number pairs.',
    build: 'Draw three number pairs that follow one rule.',
    mission: 'Explain one number relationship to another person.',
  },
  {
    id: 'vedic-patterns-03',
    title: 'Algebra Patterns',
    subtitle: 'Turn number patterns into rules',
    learn: [
      'A pattern can be described using a rule.',
      'A letter can represent a number that changes.',
      'This is the beginning of algebraic thinking.',
    ],
    experiment: 'Change the input and watch the rule produce a new output.',
    game: 'Discover the rule that controls the number machine.',
    build: 'Create a simple input-and-output number machine.',
    mission: 'Find a repeating or changing rule in everyday life.',
  },

  {
    id: 'vedic-real-world-01',
    title: 'Shopping',
    subtitle: 'Use mental maths with prices',
    learn: [
      'Mental calculation can help us estimate shopping totals.',
      'Grouping prices can make addition easier.',
      'Estimation helps us check whether a total makes sense.',
    ],
    experiment: 'Add several item prices and compare the exact total with an estimate.',
    game: 'Reach the correct shopping total before the timer closes the checkout.',
    build: 'Make a small pretend shopping list and calculate the total.',
    mission: 'Estimate the total of a few items before checking the receipt.',
  },
  {
    id: 'vedic-real-world-02',
    title: 'Money',
    subtitle: 'Calculate change and totals',
    learn: [
      'Complements can help calculate change quickly.',
      'Breaking a price into simple amounts can make mental calculation easier.',
      'Checking the answer helps prevent mistakes.',
    ],
    experiment: 'Give a virtual payment and watch the change build back to the price.',
    game: 'Return the correct change using the fewest mental steps.',
    build: 'Practise making change with safe pretend money.',
    mission: 'Notice how change is calculated during a real purchase with a grown-up.',
  },
  {
    id: 'vedic-real-world-03',
    title: 'Estimation',
    subtitle: 'Use numbers to make quick decisions',
    learn: [
      'Estimation is useful when an exact answer is not necessary.',
      'A good estimate should be close enough for the purpose.',
      'Mental maths helps us make quick everyday comparisons.',
    ],
    experiment: 'Compare exact values with rounded estimates and see how close they are.',
    game: 'Choose the estimate that is useful enough for the situation.',
    build: 'Estimate the number of objects in a small group, then count them.',
    mission: 'Make one useful estimate today and check it afterward.',
  },
],

nutrition: [
    {
      id: 'nutrition-01',
      title: 'Food Explorer',
      subtitle: 'What does food give us?',
      learn: [
        'Food gives the body energy and nutrients needed for normal growth and everyday functions.',
        'Different foods provide different combinations of carbohydrates, proteins, fats, vitamins, minerals, and fibre.',
        'A varied diet is more useful than relying on one “perfect” food.',
      ],
      experiment: 'Move foods into groups and watch the plate become more varied.',
      game: 'Build a varied meal from the available foods.',
      build: 'Draw your own balanced meal using foods you actually eat.',
      mission: 'Look at one family meal and identify several different food groups.',
    },
    {
      id: 'nutrition-02',
      title: 'Vitamin & Mineral Lab',
      subtitle: 'Small nutrients, important jobs',
      learn: [
        'Vitamins and minerals help the body perform many normal functions.',
        'For example, calcium supports bones and teeth, iron is needed for haemoglobin, and vitamin C has several roles including supporting normal connective tissue formation.',
        'Different foods provide different micronutrients.',
      ],
      experiment: 'Connect nutrients to their body roles and food sources.',
      game: 'Run the nutrient laboratory by matching each nutrient to suitable sources.',
      build: 'Make a simple nutrient chart using foods available at home.',
      mission: 'Find three foods and identify one nutrient each commonly provides.',
    },
    {
      id: 'nutrition-03',
      title: 'Food Detective',
      subtitle: 'Look beyond the front of the packet',
      learn: [
        'Highly processed foods can contain substantial added sugar, sodium, or saturated fat.',
        'The front of a package does not tell the whole story.',
        'Learning to compare ingredients and nutrition information helps us make informed choices.',
      ],
      experiment: 'Reveal the hidden information on several imaginary food packages.',
      game: 'Inspect labels and identify which foods need closer attention.',
      build: 'Create a pretend food label for a snack.',
      mission: 'With an adult, compare two real packaged foods using their labels.',
    },
    {
      id: 'nutrition-04',
      title: 'Build a Balanced Plate',
      subtitle: 'Design the meal',
      learn: [
        'A useful meal can combine vegetables or fruits, protein-rich foods, grains or other carbohydrate sources, and suitable fats.',
        'The exact meal can vary with culture, availability, age, and dietary needs.',
        'Variety matters across the day, not just in one plate.',
      ],
      experiment: 'Assemble a plate and see how changing one component changes the overall variety.',
      game: 'Complete the meal-building challenge.',
      build: 'Design a real meal that your family could prepare.',
      mission: 'Help an adult choose or prepare one component of a family meal.',
    },
  ],

  physics: [
    {
      id: 'physics-01',
      title: 'Motion',
      subtitle: 'Things change position',
      learn: [
        'Motion means an object changes position relative to a reference point.',
        'Speed describes how quickly position changes.',
        'A moving object can speed up, slow down, or change direction.',
      ],
      experiment: 'Drag the object and change its speed. Watch its position change.',
      game: 'Guide a rover through checkpoints while controlling its motion.',
      build: 'Make a simple paper ramp and test a small object on it.',
      mission: 'Observe something moving and describe how its position changes.',
    },
    {
      id: 'physics-02',
      title: 'Force',
      subtitle: 'Pushes and pulls',
      learn: [
        'A force is a push or pull.',
        'Forces can change an object’s motion.',
        'A stronger push does not always produce the same result because mass and other forces matter.',
      ],
      experiment: 'Push objects with different strengths and observe their motion.',
      game: 'Move objects to targets using controlled pushes.',
      build: 'Test how far different objects travel from the same push.',
      mission: 'Find three pushes or pulls used in everyday life.',
    },
    {
      id: 'physics-03',
      title: 'Friction',
      subtitle: 'Surfaces resist sliding',
      learn: [
        'Friction acts between surfaces in contact.',
        'Roughness, materials, and the force pressing surfaces together can affect friction.',
        'Friction can be useful, such as when walking or braking, and can also waste energy.',
      ],
      experiment: 'Change the surface and slide the same object.',
      game: 'Choose surfaces that let a machine move safely.',
      build: 'Test the same object on two or three surfaces.',
      mission: 'Find one place where friction helps and one where it causes a problem.',
    },
    {
      id: 'physics-04',
      title: 'Gravity',
      subtitle: 'Falling and weight',
      learn: [
        'Gravity attracts objects toward Earth.',
        'Gravity gives falling objects acceleration when other effects do not dominate.',
        'A ramp lets us change the direction and distance over which an object moves downward.',
      ],
      experiment: 'Change the ramp angle and observe the object’s motion.',
      game: 'Guide falling objects safely through a gravity maze.',
      build: 'Make a paper ramp and test different angles.',
      mission: 'Observe a falling or rolling object and describe what gravity is doing.',
    },
    {
      id: 'physics-05',
      title: 'Energy',
      subtitle: 'Energy changes form',
      learn: [
        'Energy can be transferred and transformed.',
        'A battery can transfer electrical energy; a moving object has kinetic energy; a raised object has gravitational potential energy.',
        'Machines often involve several energy transformations.',
      ],
      experiment: 'Trace energy through a simple machine.',
      game: 'Repair an energy-transfer chain by connecting the correct stages.',
      build: 'Draw one everyday energy transformation.',
      mission: 'Identify three energy transformations around your home.',
    },
    {
      id: 'physics-06',
      title: 'Momentum',
      subtitle: 'Motion carried by mass',
      learn: [
        'Momentum depends on mass and velocity.',
        'Changing mass or velocity changes momentum.',
        'Collisions transfer momentum between objects.',
      ],
      experiment: 'Change the mass and speed of two carts and observe their collision.',
      game: 'Control carts to transfer momentum safely.',
      build: 'Make a simple rolling-cart experiment using safe household objects.',
      mission: 'Observe a collision in sport or everyday life and describe the motion before and after.',
    },
    {
      id: 'physics-07',
      title: 'Machines',
      subtitle: 'Put physics together',
      learn: [
        'Real machines combine forces, motion, friction, energy, and materials.',
        'A lever, wheel, gear, ramp, or pulley can change how a force is applied.',
        'Engineering is about choosing a useful arrangement for a purpose.',
      ],
      experiment: 'Change a machine’s parts and observe what happens.',
      game: 'Build a working machine from the available components.',
      build: 'Design a simple paper or household-object machine.',
      mission: 'Find one machine at home and explain what physics ideas it uses.',
    },
  ],

  electronics: [
    {
      id: 'electronics-01',
      title: 'Water Logic',
      subtitle: 'Open and blocked',
      learn: [
        'Imagine a pipe carrying water.',
        'An open path lets water through. We can represent that state as 1.',
        'A blocked path stops the flow. We can represent that state as 0.',
      ],
      experiment: 'Open and close virtual valves and watch the water flow.',
      game: 'Route water through the correct pipe network.',
      build: 'Draw a pipe system with open and blocked paths.',
      mission: 'Find switches around you and think about how they create two states.',
    },
    {
      id: 'electronics-02',
      title: 'Complex Pipes',
      subtitle: 'Combining conditions',
      learn: [
        'Several open and blocked paths can create more complicated behaviour.',
        'The arrangement of paths determines whether water can reach the output.',
        'This is a useful bridge from physical flow to logical circuits.',
      ],
      experiment: 'Change several valves and observe which routes remain connected.',
      game: 'Solve increasingly complex water networks.',
      build: 'Design a small two-input pipe puzzle.',
      mission: 'Explain a real system where several conditions must be satisfied before something works.',
    },
    {
      id: 'electronics-03',
      title: 'Logic Gates',
      subtitle: 'AND, OR, NOT',
      learn: [
        'AND needs both inputs to be 1.',
        'OR needs at least one input to be 1.',
        'NOT reverses the input.',
      ],
      experiment: 'Toggle the inputs and watch each gate respond.',
      game: 'Connect gates to make the required output.',
      build: 'Draw an AND, OR, and NOT gate using simple symbols.',
      mission: 'Find an everyday decision that behaves like an AND or OR condition.',
    },
    {
      id: 'electronics-04',
      title: 'Circuits',
      subtitle: 'A complete electrical path',
      learn: [
        'A circuit needs a complete path for current to flow.',
        'A source provides electrical energy, while components use or control it.',
        'An open circuit breaks the path.',
      ],
      experiment: 'Connect a source, switch, and lamp until the circuit works.',
      game: 'Repair a broken circuit.',
      build: 'With an adult and safe low-voltage parts, assemble a simple circuit.',
      mission: 'Identify the source, path, control, and load in a safe electronic device.',
    },
    {
      id: 'electronics-05',
      title: 'Binary',
      subtitle: 'Numbers made from two states',
      learn: [
        'Digital systems often represent information using two states.',
        'Binary uses 0 and 1.',
        'Different positions represent different powers of two.',
      ],
      experiment: 'Toggle binary switches and watch the decimal value change.',
      game: 'Decode binary signals.',
      build: 'Make a paper binary switch board.',
      mission: 'Encode a small number in binary.',
    },
    {
      id: 'electronics-06',
      title: 'From Binary to Code',
      subtitle: 'Computers represent information',
      learn: [
        'Computers store and process information using digital representations.',
        'Character encodings map symbols to numbers.',
        'For example, in ASCII, lowercase and uppercase letters have specific numeric codes.',
      ],
      experiment: 'Change a character and inspect its numeric representation.',
      game: 'Decode a short computer message.',
      build: 'Create a tiny ASCII code chart.',
      mission: 'Encode one letter, such as A, using its ASCII value and explain the idea.',
    },
  ],

  manufacturing: [
    {
      id: 'manufacturing-01',
      title: 'Meet the Gear',
      subtitle: 'A simple machine that transfers motion',
      learn: [
        'A gear is a toothed wheel that transfers rotational motion.',
        'When one gear turns, its teeth push the next gear.',
      ],
      experiment: 'Turn one gear and watch the connected gear move.',
      game: 'Start the gear system and make the mechanism move.',
      build: 'Draw two connected gears with their centres marked.',
      mission: 'Find a real gear mechanism and observe how its parts move.',
    },
    {
      id: 'manufacturing-02',
      title: 'Gear Direction',
      subtitle: 'Which way does it turn?',
      learn: [
        'Two directly connected gears rotate in opposite directions.',
        'The teeth of one gear push against the teeth of the other.',
      ],
      experiment: 'Turn the first gear and predict the direction of the second.',
      game: 'Repair the gear system by choosing the correct rotation directions.',
      build: 'Draw two gears and add arrows showing their directions.',
      mission: 'Observe a real gear mechanism and identify the direction of rotation.',
    },
    {
      id: 'manufacturing-03',
      title: 'Gear Size',
      subtitle: 'Small and large gears behave differently',
      learn: [
        'Changing gear size changes the relationship between rotation speed and turning force.',
        'A smaller gear and a larger gear do not complete the same number of rotations.',
      ],
      experiment: 'Swap the gear sizes and observe how the movement changes.',
      game: 'Choose gear sizes to create the required movement.',
      build: 'Draw one small gear connected to one large gear.',
      mission: 'Find gears of different sizes in an everyday machine.',
    },
    {
      id: 'manufacturing-04',
      title: 'Gear Train',
      subtitle: 'Many gears working together',
      learn: [
        'Several connected gears form a gear train.',
        'The arrangement determines how motion travels through the system.',
      ],
      experiment: 'Add gears one at a time and follow the motion through the train.',
      game: 'Build a working gear train from the available gears.',
      build: 'Draw a three-gear system with arrows between the gears.',
      mission: 'Look for a mechanism that uses more than one gear.',
    },
    {
      id: 'manufacturing-05',
      title: 'Observe the Machine',
      subtitle: 'See the mechanism in action',
      learn: [
        'Real machines combine mechanisms to perform useful tasks.',
        'Observation helps us understand where motion enters, travels, changes, and leaves.',
      ],
      experiment: 'Inspect a virtual machine and trace its movement from input to output.',
      game: 'Follow the moving parts and identify the gear path.',
      build: 'Sketch the important moving parts of the machine.',
      mission: 'Observe a safe everyday machine and identify its moving parts.',
    },
    {
      id: 'manufacturing-06',
      title: 'Draw the Gear System',
      subtitle: 'Turn observation into a design',
      learn: [
        'Engineers use drawings to communicate how mechanisms are arranged.',
        'A useful gear drawing can show gear size, connection, and direction.',
      ],
      experiment: 'Arrange gears and watch the drawing update as the system moves.',
      game: 'Recreate the observed gear system using a simple drawing.',
      build: 'Draw your own gear system with sizes and rotation arrows.',
      mission: 'Draw one real gear mechanism you observed.',
    },
  ],

  music: [
    {
      id: 'music-01',
      title: 'Vibration',
      subtitle: 'Where sound begins',
      learn: [
        'Sound is produced by vibrating sources and travels through a medium.',
        'A vibrating string, membrane, or air column can create sound.',
      ],
      experiment: 'Change the vibration and watch the sound wave respond.',
      game: 'Match vibrations to their visible wave patterns.',
      build: 'Make a safe simple string vibration experiment.',
      mission: 'Find three things that produce sound through vibration.',
    },
    {
      id: 'music-02',
      title: 'Frequency',
      subtitle: 'Fast and slow vibrations',
      learn: [
        'Frequency describes how many cycles occur per second.',
        'Higher frequency is associated with higher pitch.',
      ],
      experiment: 'Move the frequency control and observe the waveform.',
      game: 'Arrange tones from lower to higher frequency.',
      build: 'Create a simple visual frequency chart.',
      mission: 'Compare two everyday sounds and describe which has the higher pitch.',
    },
    {
      id: 'music-03',
      title: 'Rhythm',
      subtitle: 'Time organised into patterns',
      learn: [
        'Rhythm organizes sounds and silences in time.',
        'Repeating patterns can make music predictable and expressive.',
      ],
      experiment: 'Watch a rhythm pattern animate and tap along.',
      game: 'Reproduce changing rhythm patterns.',
      build: 'Create your own four-beat rhythm.',
      mission: 'Tap your rhythm on a table or safe surface for someone else.',
    },
    {
      id: 'music-04',
      title: 'Melody',
      subtitle: 'Notes become a sequence',
      learn: [
        'A melody is an organized sequence of pitches.',
        'Changing pitch or rhythm changes how a melody feels.',
      ],
      experiment: 'Move notes and listen to the sequence.',
      game: 'Reconstruct a short melody.',
      build: 'Create a four- or eight-note melody.',
      mission: 'Hum or play your melody for someone.',
    },
  ],

  humanity: [
    {
      id: 'humanity-01',
      title: 'Human Needs',
      subtitle: 'What people need to live well',
      learn: [
        'People need basics such as food, water, shelter, safety, care, and connection.',
        'Different people can have different needs in different situations.',
      ],
      experiment: 'Change a person’s situation and observe which needs become urgent.',
      game: 'Prepare resources for different scenarios.',
      build: 'Create a simple human-needs map.',
      mission: 'Notice one practical need someone around you has today.',
    },
    {
      id: 'humanity-02',
      title: 'Empathy',
      subtitle: 'Understanding another perspective',
      learn: [
        'Empathy involves trying to understand another person’s feelings or perspective.',
        'It does not require us to have exactly the same experience.',
      ],
      experiment: 'Explore a situation from two different perspectives.',
      game: 'Choose helpful responses in changing situations.',
      build: 'Write or draw two perspectives of the same event.',
      mission: 'Listen carefully to someone without interrupting and summarize what they said.',
    },
    {
      id: 'humanity-03',
      title: 'Communication',
      subtitle: 'Ideas move between people',
      learn: [
        'Communication can use words, gestures, drawings, signs, and other signals.',
        'Clear communication includes checking whether the other person understood.',
      ],
      experiment: 'Send the same message through different communication methods.',
      game: 'Repair unclear messages.',
      build: 'Create a visual instruction card.',
      mission: 'Teach someone a simple task using clear instructions.',
    },
    {
      id: 'humanity-04',
      title: 'Cooperation',
      subtitle: 'Working together',
      learn: [
        'Cooperation means people coordinate their actions toward a shared purpose.',
        'Different people can contribute different skills.',
      ],
      experiment: 'Change team roles and observe the effect on a shared task.',
      game: 'Coordinate a team to solve a practical problem.',
      build: 'Plan a small task with roles for two or more people.',
      mission: 'Complete a household task together and notice how coordination helped.',
    },
    {
      id: 'humanity-05',
      title: 'Community',
      subtitle: 'People connected by shared spaces',
      learn: [
        'Communities depend on people, systems, shared spaces, and responsibilities.',
        'Small actions can affect other people.',
      ],
      experiment: 'Change one community resource and observe who is affected.',
      game: 'Balance the needs of a small community.',
      build: 'Draw your local community as a system of connected people and places.',
      mission: 'Identify one small action that improves a shared space.',
    },
    {
      id: 'humanity-06',
      title: 'Help in Action',
      subtitle: 'Knowledge becomes behaviour',
      learn: [
        'Helping does not always mean solving everything for someone.',
        'Sometimes the best action is listening, asking what is needed, or connecting someone with appropriate help.',
      ],
      experiment: 'Explore several situations and compare possible responses.',
      game: 'Coordinate help safely in a changing scenario.',
      build: 'Create a simple “how I can help” plan for home or school.',
      mission: 'Perform one safe, useful act of help without expecting a reward.',
    },
  ],

  nature: [
    {
      id: 'nature-01',
      title: 'Plants',
      subtitle: 'Living systems around us',
      learn: [
        'Plants use light energy to make sugars through photosynthesis.',
        'Roots, stems, leaves, flowers, and seeds have different roles.',
      ],
      experiment: 'Explore how changing light, water, and plant parts affects the model.',
      game: 'Help a virtual plant complete its life cycle.',
      build: 'Draw and label a plant.',
      mission: 'Observe a real plant and record what you notice.',
    },
    {
      id: 'nature-02',
      title: 'Food Webs',
      subtitle: 'Who depends on whom?',
      learn: [
        'Living organisms are connected through feeding relationships.',
        'Food chains can connect into larger food webs.',
      ],
      experiment: 'Add or remove organisms and watch the food web change.',
      game: 'Repair a damaged food web.',
      build: 'Draw a small local food web.',
      mission: 'Observe living things outdoors and identify one possible feeding relationship.',
    },
    {
      id: 'nature-03',
      title: 'Ecosystems',
      subtitle: 'Many parts working together',
      learn: [
        'An ecosystem includes living organisms and their physical environment.',
        'Changes to one part can affect other parts.',
      ],
      experiment: 'Change water, plants, predators, or habitat conditions.',
      game: 'Keep a virtual ecosystem stable.',
      build: 'Design a small ecosystem diagram.',
      mission: 'Observe one local environment and list living and non-living parts.',
    },
    {
      id: 'nature-04',
      title: 'Restore',
      subtitle: 'Repairing a changing ecosystem',
      learn: [
        'Human actions can alter habitats and resource availability.',
        'Restoration can involve protecting habitat, reducing pollution, and supporting native biodiversity.',
      ],
      experiment: 'Test different restoration actions in a virtual habitat.',
      game: 'Restore a damaged ecosystem.',
      build: 'Design a simple local restoration idea.',
      mission: 'Do one safe action that helps keep a shared natural space clean or healthy.',
    },
  ],
};

const ARTS_LEVELS: Record<string, Level[]> = {
  drawing: [
    {
      id: 'arts-drawing-01',
      title: 'Circle Family',
      subtitle: 'Build drawings from curves',
      learn: [
        'A circle is more than a shape to copy.',
        'Curves and circles can become wheels, eyes, faces, flowers, suns, bubbles, and many other structures.',
        'Artists simplify complicated objects into basic forms before adding detail.',
      ],
      experiment: 'Watch a circle transform into several familiar drawings.',
      game: 'Build an object by placing circles and curves in the correct construction positions.',
      build: 'Draw a circle, then turn it into three different objects.',
      mission: 'Look around and find three real objects that contain circular forms.',
    },
    {
      id: 'arts-drawing-02',
      title: 'Triangle Family',
      subtitle: 'Pointed forms and structures',
      learn: [
        'Triangles create strong visual structures.',
        'They can become roofs, mountains, arrows, leaves, trees, and many designed forms.',
        'Changing their height, width, and direction changes the character of the drawing.',
      ],
      experiment: 'Stretch, rotate, and combine triangles to see what forms appear.',
      game: 'Construct a picture using triangle families.',
      build: 'Draw three different objects beginning with triangles.',
      mission: 'Find triangle-like structures around you.',
    },
    {
      id: 'arts-drawing-03',
      title: 'Square & Rectangle Family',
      subtitle: 'Structures and objects',
      learn: [
        'Squares and rectangles create stable structural forms.',
        'Buildings, windows, books, screens, boxes, machines, and many objects can begin from these forms.',
      ],
      experiment: 'Change proportions and combine rectangles into objects.',
      game: 'Construct a robot, building, or object from rectangular forms.',
      build: 'Draw an object beginning with rectangles.',
      mission: 'Identify rectangular structures in your environment.',
    },
    {
      id: 'arts-drawing-04',
      title: 'Build a Drawing',
      subtitle: 'Combine simple forms',
      learn: [
        'Complex drawings can be constructed from simple forms.',
        'Start with large structures, then add smaller forms and details.',
      ],
      experiment: 'Watch a simple set of shapes transform into a finished illustration.',
      game: 'Construct a complete drawing in stages.',
      build: 'Create your own drawing using circles, triangles, and rectangles.',
      mission: 'Show your drawing to someone and explain which basic forms you used.',
    },
  ],

  diy: [
    {
      id: 'arts-diy-01',
      title: 'See Before You Build',
      subtitle: 'Objects have structure',
      learn: [
        'Before making something, observe the finished object.',
        'Look for its parts, materials, joints, folds, and purpose.',
      ],
      experiment: 'Explore a virtual object and reveal its construction layers.',
      game: 'Put the construction steps in order.',
      build: 'Choose a simple household object and sketch its parts.',
      mission: 'Observe a real object and identify how its pieces connect.',
    },
    {
      id: 'arts-diy-02',
      title: 'Paper Engineering',
      subtitle: 'Fold, cut, join',
      learn: [
        'Paper can become stronger or more useful through folds and structures.',
        'Tabs, folds, tubes, and layered pieces can create useful shapes.',
      ],
      experiment: 'Fold virtual paper and watch its strength/shape change.',
      game: 'Assemble a paper structure from the demonstrated steps.',
      build: 'Make a simple paper structure with safe materials.',
      mission: 'Test which fold makes your paper structure stronger.',
    },
    {
      id: 'arts-diy-03',
      title: 'Build From Pictures',
      subtitle: 'Visual instructions',
      learn: [
        'A picture can communicate construction information without long text.',
        'Look for sequence, orientation, repeated parts, and attachment points.',
      ],
      experiment: 'Reveal a picture-based construction sequence.',
      game: 'Follow visual instructions to assemble the object.',
      build: 'Make the real object from the visual instructions.',
      mission: 'Take your finished object and explain its construction to someone.',
    },
  ],

  models: [
    {
      id: 'arts-models-01',
      title: 'Template to Model',
      subtitle: 'Flat paper becomes 3D',
      learn: [
        'A template, or net, represents the surfaces of a 3D object in a flat form.',
        'Cutting, folding, and joining can turn it into a model.',
      ],
      experiment: 'Fold a virtual template into a 3D shape.',
      game: 'Choose the folds needed to build the model.',
      build: 'Print or copy a simple template onto paper and make the model.',
      mission: 'Show the finished model and identify its faces and edges.',
    },
    {
      id: 'arts-models-02',
      title: 'Cardboard Structure',
      subtitle: 'Strong forms',
      learn: [
        'Cardboard can be cut and joined into larger structures.',
        'Triangles, boxes, beams, and folded edges can make structures stronger.',
      ],
      experiment: 'Change the structure and observe how it behaves under a simple load.',
      game: 'Build a stable virtual cardboard structure.',
      build: 'Make a small structure from cardboard or thick paper with adult supervision.',
      mission: 'Test the structure safely and identify what made it stable.',
    },
    {
      id: 'arts-models-03',
      title: 'Build a Machine Model',
      subtitle: 'Model something that moves',
      learn: [
        'Models can represent machines, vehicles, buildings, or natural systems.',
        'A useful model shows important parts clearly, even if it does not perform every real function.',
      ],
      experiment: 'Explore the parts of a simple machine model.',
      game: 'Assemble the model from templates.',
      build: 'Build a paper/cardboard model of a machine, vehicle, or structure.',
      mission: 'Explain what each visible part represents.',
    },
  ],
};

function getTheme(subject: string) {
  return THEMES[subject] ?? THEMES.vedic;
}

const VEDIC_BRANCH_LEVELS: Record<string, Level[]> = {
  'number-sense': LEVELS.vedic.filter((level) =>
    level.id.startsWith('vedic-number-sense-'),
  ),
  'near-base': LEVELS.vedic.filter((level) =>
    level.id.startsWith('vedic-near-base-'),
  ),
  crosswise: LEVELS.vedic.filter((level) =>
    level.id.startsWith('vedic-crosswise-'),
  ),
  mental: LEVELS.vedic.filter((level) =>
    level.id.startsWith('vedic-mental-'),
  ),
  patterns: LEVELS.vedic.filter((level) =>
    level.id.startsWith('vedic-patterns-'),
  ),
  'real-world': LEVELS.vedic.filter((level) =>
    level.id.startsWith('vedic-real-world-'),
  ),
};

function getLevels(subject: string, branch?: string) {
  if (subject === 'arts') {
    return ARTS_LEVELS[branch ?? 'drawing'];
  }

  if (subject === 'vedic') {
    return VEDIC_BRANCH_LEVELS[branch ?? 'number-sense'] ?? VEDIC_BRANCH_LEVELS['number-sense'];
  }

  return LEVELS[subject] ?? LEVELS.vedic;
}

function useFloatAnimation() {
  const [value] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [value]);

  return value;
}


function MusicLessonVisual({
  level,
  content,
}: {
  level: Level;
  content?: import('@/features/lessons/lesson-content').LessonContent;
}) {
  const lowPlayer = useAudioPlayer(
    require('../../../../assets/audio/music/low.wav'),
  );
  const middlePlayer = useAudioPlayer(
    require('../../../../assets/audio/music/middle.wav'),
  );
  const highPlayer = useAudioPlayer(
    require('../../../../assets/audio/music/high.wav'),
  );
  const clickPlayer = useAudioPlayer(
    require('../../../../assets/audio/music/click.wav'),
  );

  const float = useFloatAnimation();

  const [musicPlaying, setMusicPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [rhythmStep, setRhythmStep] = useState(0);
  const [rhythmPlaying, setRhythmPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [melodyNote, setMelodyNote] = useState(1);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -8],
  });

  const playNote = (note: number) => {
    const player =
      note === 0 ? lowPlayer : note === 1 ? middlePlayer : highPlayer;

    player.seekTo(0);
    player.play();
  };

  const rhythmPatterns = [
    ['●', '—', '●', '—'],
    ['●', '●', '—', '●'],
    ['●', '—', '●●', '—'],
  ];

  const notes = ['LOW', 'MID', 'HIGH'];

  const isVibration = level.id === 'music-01';
  const isFrequency = level.id === 'music-02';
  const isRhythm = level.id === 'music-03';
  const isMelody = level.id === 'music-04';

  const currentPattern = rhythmPatterns[rhythmStep];

  const playRhythm = () => {
    if (rhythmPlaying) return;

    setRhythmPlaying(true);
    setActiveBeat(-1);

    currentPattern.forEach((beat, index) => {
      setTimeout(() => {
        setActiveBeat(index);

        if (beat !== '—') {
          clickPlayer.seekTo(0);
          clickPlayer.play();
        }
      }, index * 500);
    });

    setTimeout(() => {
      setActiveBeat(-1);
      setRhythmPlaying(false);
    }, currentPattern.length * 500 + 100);
  };

  return (
    <View style={styles.visualArea}>

      <Text style={styles.visualTitle}>{level.title}</Text>
      <Text style={styles.visualCaption}>WATCH THE IDEA FIRST</Text>

      {content && (
        <VisualLesson content={content} />
      )}

      {isVibration && (
        <View style={styles.musicLessonBox}>
          <Text style={styles.musicLessonText}>
            Sound begins with vibration. Watch the wave move, then hear it.
          </Text>

          <Pressable
            onPress={() => {
              setMusicPlaying((value) => !value);
              playNote(1);
            }}
            style={styles.musicLessonButton}
          >
            <Text style={styles.musicLessonButtonText}>
              {musicPlaying ? 'PAUSE VIBRATION' : 'PLAY VIBRATION'}
            </Text>
          </Pressable>
        </View>
      )}

      {isFrequency && (
        <View style={styles.musicLessonBox}>
          <Text style={styles.musicLessonText}>
            Slow vibration makes a lower sound. Fast vibration makes a higher sound.
          </Text>

          <View style={styles.musicControlRow}>
            {[1, 2, 3].map((value) => (
              <Pressable
                key={value}
                onPress={() => {
                  setSpeed(value);
                  playNote(value - 1);
                }}
                style={[
                  styles.musicSpeedButton,
                  speed === value && styles.musicSpeedButtonActive,
                ]}
              >
                <Text style={styles.musicSpeedText}>
                  {value === 1 ? 'SLOW' : value === 2 ? 'MEDIUM' : 'FAST'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {isRhythm && (
        <View style={styles.musicLessonBox}>
          <Text style={styles.musicLessonText}>
            Rhythm is a pattern of sounds and pauses. Watch the pattern, then listen.
          </Text>

          <View style={styles.rhythmSequence}>
            {currentPattern.map((beat, index) => (
              <View
                key={`${beat}-${index}`}
                style={[
                  styles.rhythmBeat,
                  activeBeat === index && styles.rhythmBeatActive,
                ]}
              >
                <Text style={styles.rhythmBeatText}>
                  {beat}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            disabled={rhythmPlaying}
            onPress={playRhythm}
            style={[
              styles.musicLessonButton,
              rhythmPlaying && styles.musicLessonButtonDisabled,
            ]}
          >
            <Text style={styles.musicLessonButtonText}>
              {rhythmPlaying ? 'LISTENING...' : 'PLAY RHYTHM'}
            </Text>
          </Pressable>

          <Pressable
            disabled={rhythmPlaying}
            onPress={() => {
              setRhythmStep((value) => (value + 1) % rhythmPatterns.length);
              setActiveBeat(-1);
            }}
            style={styles.musicSecondaryButton}
          >
            <Text style={styles.musicLessonButtonText}>
              TRY ANOTHER PATTERN
            </Text>
          </Pressable>
        </View>
      )}

      {isMelody && (
        <View style={styles.musicLessonBox}>
          <Text style={styles.musicLessonText}>
            Melody is a sequence of different pitches. Tap each one and listen.
          </Text>

          <Text style={styles.melodyNote}>{notes[melodyNote]}</Text>

          <View style={styles.musicControlRow}>
            {notes.map((note, index) => (
              <Pressable
                key={note}
                onPress={() => {
                  setMelodyNote(index);
                  playNote(index);
                }}
                style={[
                  styles.musicSpeedButton,
                  melodyNote === index && styles.musicSpeedButtonActive,
                ]}
              >
                <Text style={styles.musicSpeedText}>{note}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function LearnVisual({
  subject,
  level,
}: {
  subject: string;
  level: Level;
}) {
  const float = useFloatAnimation();

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -8],
  });

  if (subject === 'music') {
    return (
      <MusicLessonVisual
        level={level}
        content={
          LESSON_CONTENT[level.id] ?? LESSON_CONTENT.music
        }
      />
    );
  }

  const lessonContent =
    LESSON_CONTENT[level.id] ??
    LESSON_CONTENT[subject as keyof typeof LESSON_CONTENT];

  return (
    <View style={styles.visualArea}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {lessonContent && (
        <VisualLesson content={lessonContent} />
      )}
      </Animated.View>

      <Text style={styles.visualTitle}>{level.title}</Text>
      <Text style={styles.visualCaption}>WATCH THE IDEA FIRST</Text>
    </View>
  );
}

function VedicBranchPicker({
  branch,
  onChange,
  theme,
}: {
  branch: string;
  onChange: (value: string) => void;
  theme: Theme;
}) {
  return (
    <View style={styles.branchRow}>
      {[
        ['number-sense', '🔢', 'Number Sense'],
        ['near-base', '🎯', 'Near the Base'],
        ['crosswise', '✖️', 'Crosswise'],
        ['mental', '🧠', 'Mental Maths'],
        ['patterns', '🧩', 'Patterns'],
        ['real-world', '🛒', 'Real-World Maths'],
      ].map(([id, icon, label]) => {
        const active = branch === id;

        return (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            style={[
              styles.branchButton,
              active && {
                borderColor: theme.accent,
                backgroundColor: 'rgba(255,255,255,0.13)',
              },
            ]}
          >
            <Text style={styles.branchIcon}>{icon}</Text>
            <Text style={styles.branchText}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ArtsBranchPicker({
  branch,
  onChange,
  theme,
}: {
  branch: string;
  onChange: (value: string) => void;
  theme: Theme;
}) {
  return (
    <View style={styles.branchRow}>
      {[
        ['drawing', '✎', 'Drawing'],
        ['diy', '🛠', 'DIY'],
        ['models', '▣', 'Models'],
      ].map(([id, icon, label]) => {
        const active = branch === id;

        return (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            style={[
              styles.branchButton,
              active && {
                borderColor: theme.accent,
                backgroundColor: 'rgba(255,255,255,0.13)',
              },
            ]}
          >
            <Text style={styles.branchIcon}>{icon}</Text>
            <Text style={styles.branchText}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ExperimentVisual({
  subject,
  levelIndex,
  theme,
}: {
  subject: string;
  levelIndex: number;
  theme: Theme;
}) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    progress.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => progress.stopAnimation();
  }, [levelIndex, progress]);

  const move = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 60],
  });

  let content = '●';

  if (subject === 'electronics') content = '💧';
  if (subject === 'physics') content = '●';
  if (subject === 'manufacturing') content = '⚙';
  if (subject === 'music') content = '〰';
  if (subject === 'nutrition') content = '🥗';
  if (subject === 'arts') content = '✎';
  if (subject === 'nature') content = '🌿';
  if (subject === 'humanity') content = '●';
  if (subject === 'vedic') content = '98';

  return (
    <View style={styles.experimentBox}>
      <Animated.View style={{ transform: [{ translateX: move }] }}>
        <Text style={[styles.experimentObject, { color: theme.accent }]}>
          {content}
        </Text>
      </Animated.View>

      <View style={styles.experimentTrack}>
        <View
          style={[
            styles.experimentFill,
            { backgroundColor: theme.accent },
          ]}
        />
      </View>

      <Text style={styles.experimentHint}>CHANGE IT • WATCH IT • UNDERSTAND IT</Text>
    </View>
  );
}

export default function SubjectGameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    subject?: string;
    branch?: string;
  }>();

  const subject = String(params.subject ?? 'vedic').toLowerCase();
  const initialBranch = String(
    params.branch ?? (subject === 'vedic' ? 'number-sense' : 'drawing'),
  ).toLowerCase();

  const [branch, setBranch] = useState(initialBranch);
  const [levelIndex, setLevelIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('learn');
  const [, setProgress] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  useEffect(() => {
    let active = true;

    getCompletedLevels()
      .then((completed) => {
        if (active) {
          setCompletedLevels(completed);
        }
      })
      .catch(() => {
        if (active) {
          setCompletedLevels([]);
        }
      });

    return () => {
      active = false;
    };
  }, [subject, branch]);




  const theme = getTheme(subject);
  const levels = useMemo(
    () => getLevels(subject, branch),
    [subject, branch],
  );

  const level = levels[levelIndex] ?? levels[0];


  if (!level) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>This learning world is not ready yet.</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>BACK TO SPACE</Text>
        </Pressable>
      </View>
    );
  }

  const subjectTitle =
    subject === 'arts'
      ? 'ARTS'
      : subject === 'vedic'
        ? 'VEDIC MATHS'
        : subject.toUpperCase();

  async function finishLevel() {
    const currentLevelId = level.id;

    await completeLevel({
      levelId: currentLevelId,
      subject,
      branch,
      level: levelIndex + 1,
      title: level.title,
    });

    setCompletedLevels((current) => {
      if (current.includes(currentLevelId)) {
        return current;
      }

      return [...current, currentLevelId];
    });

    setStage('complete');
    setProgress(5);
  }

  function isLevelUnlocked(index: number) {
    if (index <= 0) {
      return true;
    }

    const previousLevel = levels[index - 1];

    return Boolean(
      previousLevel &&
      completedLevels.includes(previousLevel.id),
    );
  }

  function nextLevel() {
    if (stage !== 'complete') {
      return;
    }

    if (!completedLevels.includes(level.id)) {
      return;
    }

    if (levelIndex >= levels.length - 1) {
      router.back();
      return;
    }

    const nextIndex = levelIndex + 1;

    if (!isLevelUnlocked(nextIndex)) {
      return;
    }

    setLevelIndex(nextIndex);
    setStage('learn');
    setProgress(0);
  }

  function goToPreviousLevel() {
    if (levelIndex <= 0) {
      return;
    }

    const previousIndex = levelIndex - 1;

    setLevelIndex(previousIndex);
    setStage('learn');
    setProgress(0);
  }

  function goToNextLevel() {
    if (stage !== 'complete') {
      return;
    }

    const nextIndex = levelIndex + 1;

    if (nextIndex >= levels.length) {
      router.back();
      return;
    }

    if (!isLevelUnlocked(nextIndex)) {
      return;
    }

    setLevelIndex(nextIndex);
    setStage('learn');
    setProgress(0);
  }

  function selectLevel(index: number) {
    if (index < 0 || index >= levels.length) {
      return;
    }

    if (!isLevelUnlocked(index)) {
      return;
    }

    setLevelIndex(index);
    setStage('learn');
    setProgress(0);
  }

  function continueStage() {
    if (stage === 'learn') {
      setStage('experiment');
      setProgress(1);
    } else if (stage === 'experiment') {
      setStage('game');
      setProgress(2);
    } else if (stage === 'game') {
      setStage('build');
      setProgress(3);
    } else if (stage === 'build') {
      setStage('mission');
      setProgress(4);
    } else if (stage === 'mission') {
      void finishLevel();
    }
  }

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />

      <LinearGradient colors={theme.colors} style={StyleSheet.absoluteFill}>
        <View style={styles.backgroundOrbOne} />
        <View style={styles.backgroundOrbTwo} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.spaceButton}>
              <Text style={styles.spaceButtonText}>✦ SPACE</Text>
            </Pressable>

            <View style={styles.subjectTitleWrap}>
              <Text style={[styles.subjectIcon, { color: theme.accent }]}>
                {theme.icon}
              </Text>
              <Text style={styles.subjectTitle}>{subjectTitle}</Text>
            </View>

            <Text style={styles.levelCounter}>
              {levelIndex + 1}/{levels.length}
            </Text>
          </View>

          {subject === 'arts' && (
            <ArtsBranchPicker
              branch={branch}
              onChange={(value) => {
                setBranch(value);
                setLevelIndex(0);
                setStage('learn');
              }}
              theme={theme}
            />
          )}

          {subject === 'vedic' && (
            <VedicBranchPicker
              branch={branch}
              onChange={(value) => {
                setBranch(value);
                setLevelIndex(0);
                setStage('learn');
              }}
              theme={theme}
            />
          )}

          <View style={styles.levelMap}>
            {levels.map((item, index) => {
              const unlocked = isLevelUnlocked(index);
              const completed = completedLevels.includes(item.id);
              const active = index === levelIndex;

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={
                    completed
                      ? `Level ${index + 1}, completed`
                      : unlocked
                        ? `Level ${index + 1}, unlocked`
                        : `Level ${index + 1}, locked`
                  }
                  disabled={!unlocked}
                  onPress={() => selectLevel(index)}
                  style={[
                    styles.levelDot,
                    active && {
                      backgroundColor: theme.accent,
                      borderColor: theme.accent,
                    },
                    completed &&
                      !active && {
                        backgroundColor: 'rgba(255,255,255,0.75)',
                      },
                    !unlocked && styles.levelDotLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelDotText,
                      active && { color: '#101020' },
                      !unlocked && styles.levelDotLockedText,
                    ]}
                  >
                    {completed ? '✓' : unlocked ? index + 1 : '•'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.room}>
            <Text style={styles.stageLabel}>
              {stage === 'learn'
                ? '01 • WATCH THE IDEA'
                : stage === 'experiment'
                  ? '02 • TRY IT'
                  : stage === 'game'
                    ? '03 • PLAY WITH THE IDEA'
                    : stage === 'build'
                      ? '04 • MAKE SOMETHING'
                      : stage === 'mission'
                        ? '05 • TAKE IT OUTSIDE'
                        : '✦ EXPERIENCE COMPLETE'}
            </Text>

            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.levelSubtitle}>{level.subtitle}</Text>

            {stage === 'learn' && (
              <>
                <LearnVisual subject={subject} level={level} />

                <View style={styles.lessonBox}>
                  <Text style={styles.instructionTitle}>NOTICE THIS</Text>

                  {level.learn.map((paragraph) => (
                    <View key={paragraph} style={styles.lessonRow}>
                      <Text
                        style={[
                          styles.lessonBullet,
                          { color: theme.accent },
                        ]}
                      >
                        ✦
                      </Text>

                      <Text style={styles.lessonText}>
                        {paragraph}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {stage === 'experiment' && (
              <>
                <ExperimentVisual
                  subject={subject}
                  levelIndex={levelIndex}
                  theme={theme}
                />

                <View style={styles.instructionBox}>
                  <Text style={styles.instructionTitle}>
                    CHANGE IT • WATCH IT
                  </Text>

                  <Text style={styles.instructionText}>
                    {level.experiment}
                  </Text>
                </View>
              </>
            )}

            {stage === 'game' && (
              <View style={styles.gamePanel}>
                <Text style={styles.gameStatus}>
                  ACTIVE CHALLENGE
                </Text>

                {subject === 'vedic' ? (
                  <VedicEscape
                    levelNumber={levelIndex + 1}
                    onComplete={() => setStage('build')}
                  />
                ) : subject === 'manufacturing' ? (
                  levelIndex === 0 ? (
                    <ManufacturingChallengeGame
                      mode="meet"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 1 ? (
                    <ManufacturingChallengeGame
                      mode="direction"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 2 ? (
                    <ManufacturingChallengeGame
                      mode="size"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 3 ? (
                    <ManufacturingChallengeGame
                      mode="train"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 4 ? (
                    <MachinesGame
                      onComplete={() => setStage('build')}
                    />
                  ) : (
                    <GearDrawingGame
                      onComplete={() => setStage('build')}
                    />
                  )
                ) : subject === 'electronics' ? (
                  levelIndex === 0 ? (
                    <WaterLogicGame
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 1 ? (
                    <ComplexPipesGame
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 2 ? (
                    <LogicGateGame
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 3 ? (
                    <CircuitRepairGame
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 4 ? (
                    <BinaryGame
                      onComplete={() => setStage('build')}
                    />
                  ) : (
                    <BinaryCodeGame
                      onComplete={() => setStage('build')}
                    />
                  )
                ) : subject === 'physics' ? (
                  levelIndex === 0 ? (
                    <PhysicsChallengeGame
                      mode="motion"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 1 ? (
                    <PhysicsChallengeGame
                      mode="force"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 2 ? (
                    <PhysicsChallengeGame
                      mode="friction"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 3 ? (
                    <PhysicsChallengeGame
                      mode="gravity"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 4 ? (
                    <PhysicsChallengeGame
                      mode="energy"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 5 ? (
                    <PhysicsChallengeGame
                      mode="momentum"
                      onComplete={() => setStage('build')}
                    />
                  ) : (
                    <PhysicsChallengeGame
                      mode="machines"
                      onComplete={() => setStage('build')}
                    />
                  )
                ) : subject === 'nature' ? (
                  levelIndex === 0 ? (
                    <NatureChallengeGame
                      mode="plants"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 1 ? (
                    <NatureChallengeGame
                      mode="foodweb"
                      onComplete={() => setStage('build')}
                    />
                  ) : levelIndex === 2 ? (
                    <NatureChallengeGame
                      mode="ecosystem"
                      onComplete={() => setStage('build')}
                    />
                  ) : (
                    <NatureChallengeGame
                      mode="restore"
                      onComplete={() => setStage('build')}
                    />
                  )
                ) : (
                  <>
                    <Text style={styles.gameIcon}>
                      {theme.icon}
                    </Text>

                    <Text style={styles.gameText}>
                      {level.game}
                    </Text>

                    <Pressable
                      onPress={() => setStage('build')}
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.accent },
                      ]}
                    >
                      <Text style={styles.actionButtonText}>
                        CHALLENGE COMPLETE →
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}

            {stage === 'build' && (
              <>
                <View style={styles.buildBoard}>
                  <Text style={styles.buildBoardTitle}>
                    MAKE IT YOURSELF
                  </Text>

                  <View style={styles.buildObjects}>
                    <Text style={styles.buildObject}>□</Text>
                    <Text style={styles.buildObject}>△</Text>
                    <Text style={styles.buildObject}>○</Text>
                    <Text style={styles.buildObject}>⚙</Text>
                  </View>
                </View>

                <View style={styles.instructionBox}>
                  <Text style={styles.instructionTitle}>
                    CREATE
                  </Text>

                  <Text style={styles.instructionText}>
                    {level.build}
                  </Text>
                </View>
              </>
            )}

            {stage === 'mission' && (
              <>
                <View style={styles.missionVisual}>
                  <Text style={styles.missionIcon}>⌂</Text>

                  <Text style={styles.missionSmall}>
                    THE IDEA LEAVES THE SCREEN
                  </Text>
                </View>

                <View style={styles.missionBox}>
                  <Text style={styles.missionTitle}>
                    REAL-WORLD MISSION
                  </Text>

                  <Text style={styles.missionText}>
                    {level.mission}
                  </Text>
                </View>

                <Text style={styles.guardianText}>
                  Ask a grown-up when the activity involves tools, heat,
                  electricity, food preparation, or anything unsafe to do alone.
                </Text>
              </>
            )}

            <View style={styles.levelConsole}>
  <View style={styles.levelConsoleHeader}>
    <View>
      <Text style={styles.levelConsoleEyebrow}>
        DISCOVERY PATH
      </Text>
      <Text style={styles.levelConsoleTitle}>
        LEVEL {levelIndex + 1}
        <Text style={styles.levelConsoleMuted}>
          {'  '}OF {levels.length}
        </Text>
      </Text>
    </View>

    <View
      style={[
        styles.levelStateOrb,
        {
          borderColor: theme.accent,
          backgroundColor: `${theme.accent}18`,
        },
      ]}
    >
      <Text
        style={[
          styles.levelStateOrbText,
          { color: theme.accent },
        ]}
      >
        {completedLevels.includes(level.id) ? '✦' : '○'}
      </Text>
    </View>
  </View>

  <View style={styles.levelConstellation}>
    {levels.map((item, index) => {
      const unlocked = isLevelUnlocked(index);
      const completed = completedLevels.includes(item.id);
      const active = index === levelIndex;

      return (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={
            completed
              ? `Level ${index + 1}, completed`
              : unlocked
                ? `Level ${index + 1}, unlocked`
                : `Level ${index + 1}, locked`
          }
          disabled={!unlocked}
          onPress={() => selectLevel(index)}
          style={({ pressed }) => [
            styles.levelNode,
            active && {
              borderColor: theme.accent,
              backgroundColor: `${theme.accent}22`,
              shadowColor: theme.accent,
            },
            completed && !active && styles.levelNodeCompleted,
            !unlocked && styles.levelNodeLocked,
            pressed && unlocked && styles.levelNodePressed,
          ]}
        >
          <Text
            style={[
              styles.levelNodeSymbol,
              active && { color: theme.accent },
              completed && !active && styles.levelNodeCompletedText,
              !unlocked && styles.levelNodeLockedText,
            ]}
          >
            {completed ? '✦' : unlocked ? '◇' : '•'}
          </Text>

          <Text
            style={[
              styles.levelNodeNumber,
              active && { color: theme.accent },
              !unlocked && styles.levelNodeLockedText,
            ]}
          >
            {String(index + 1).padStart(2, '0')}
          </Text>
        </Pressable>
      );
    })}
  </View>

  <View style={styles.levelConsoleActions}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Previous level"
      disabled={levelIndex === 0}
      onPress={goToPreviousLevel}
      style={({ pressed }) => [
        styles.consoleAction,
        levelIndex === 0 && styles.consoleActionDisabled,
        pressed &&
          levelIndex > 0 &&
          styles.consoleActionPressed,
      ]}
    >
      <Text
        style={[
          styles.consoleActionArrow,
          levelIndex === 0 && styles.consoleActionDisabledText,
        ]}
      >
        ←
      </Text>
      <View>
        <Text
          style={[
            styles.consoleActionSmall,
            levelIndex === 0 && styles.consoleActionDisabledText,
          ]}
        >
          PREVIOUS
        </Text>
        <Text
          style={[
            styles.consoleActionHint,
            levelIndex === 0 && styles.consoleActionDisabledText,
          ]}
        >
          Earlier discovery
        </Text>
      </View>
    </Pressable>

    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Next level"
      disabled={
        stage !== 'complete' ||
        levelIndex >= levels.length - 1 ||
        !isLevelUnlocked(levelIndex + 1)
      }
      onPress={goToNextLevel}
      style={({ pressed }) => [
        styles.consoleAction,
        styles.consoleActionNext,
        (
          stage !== 'complete' ||
          levelIndex >= levels.length - 1 ||
          !isLevelUnlocked(levelIndex + 1)
        ) && styles.consoleActionDisabled,
        pressed &&
          stage === 'complete' &&
          levelIndex < levels.length - 1 &&
          isLevelUnlocked(levelIndex + 1) &&
          styles.consoleActionPressed,
      ]}
    >
      <View style={styles.consoleActionTextRight}>
        <Text
          style={[
            styles.consoleActionSmall,
            (
              stage !== 'complete' ||
              levelIndex >= levels.length - 1 ||
              !isLevelUnlocked(levelIndex + 1)
            ) && styles.consoleActionDisabledText,
          ]}
        >
          NEXT
        </Text>
        <Text
          style={[
            styles.consoleActionHint,
            (
              stage !== 'complete' ||
              levelIndex >= levels.length - 1 ||
              !isLevelUnlocked(levelIndex + 1)
            ) && styles.consoleActionDisabledText,
          ]}
        >
          {stage === 'complete'
            ? levelIndex >= levels.length - 1
              ? 'Path complete'
              : isLevelUnlocked(levelIndex + 1)
                ? 'Discovery unlocked'
                : 'Complete this level'
            : 'Finish discovery'}
        </Text>
      </View>

      <Text
        style={[
          styles.consoleActionArrow,
          (
            stage !== 'complete' ||
            levelIndex >= levels.length - 1 ||
            !isLevelUnlocked(levelIndex + 1)
          ) && styles.consoleActionDisabledText,
        ]}
      >
        →
      </Text>
    </Pressable>
  </View>
</View>

            {stage === 'complete' && (
              <View style={styles.completeBox}>
                <Text
                  style={[
                    styles.smallStar,
                    { color: theme.accent },
                  ]}
                >
                  ✦
                </Text>

                <Text style={styles.completeTitle}>
                  EXPERIENCE COMPLETE
                </Text>

                <Text style={styles.completeText}>
                  You watched the idea, experimented with it,
                  played with it, made something, and took it
                  into the real world.
                </Text>

                <Pressable
                  onPress={nextLevel}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <Text style={styles.actionButtonText}>
                    {levelIndex < levels.length - 1
                      ? 'NEXT DISCOVERY →'
                      : 'RETURN TO SPACE'}
                  </Text>
                </Pressable>
              </View>
            )}

            {stage !== 'complete' && (
              <Pressable
                onPress={continueStage}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.accent },
                ]}
              >
                <Text style={styles.actionButtonText}>
                  {stage === 'learn'
                    ? 'TRY THE IDEA →'
                    : stage === 'experiment'
                      ? 'ENTER THE CHALLENGE →'
                      : stage === 'build'
                        ? 'TAKE IT OUTSIDE →'
                        : stage === 'mission'
                          ? 'FIND SMALL STAR ✦'
                          : 'CONTINUE →'}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Learning is the journey. The star is only a memory of it.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gamePanel: {
    marginTop: 10,
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  gameStatus: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 8,
  },

  gameText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },


  root: {
    flex: 1,
    backgroundColor: '#030712',
  },

  scroll: {
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 48,
  },

  backgroundOrbOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(111,80,255,0.08)',
    top: 120,
    left: -130,
  },

  backgroundOrbTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,90,170,0.07)',
    bottom: 100,
    right: -100,
  },

  topBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  spaceButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  spaceButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },

  subjectTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  subjectIcon: {
    fontSize: 20,
  },

  subjectTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  levelCounter: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '800',
  },

  branchRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },

  branchButton: {
    flex: 1,
    minHeight: 66,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.14)',
  },

  branchIcon: {
    color: '#FFFFFF',
    fontSize: 21,
    marginBottom: 3,
  },

  branchText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    fontWeight: '800',
  },

  levelMap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 25,
    marginBottom: 18,
    flexWrap: 'wrap',
  },

  levelDot: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  room: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 28,
    backgroundColor: 'rgba(3,7,18,0.42)',
    padding: 20,
    overflow: 'hidden',
  },

  stageLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  levelTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '900',
  },

  levelSubtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 18,
  },

  musicLessonBox: {
    marginTop: 16,
    width: '100%',
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,183,240,0.28)',
    alignItems: 'center',
  },

  musicLessonText: {
    color: '#F5E9F8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },

  musicLessonButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,183,240,0.18)',
    borderWidth: 1,
    borderColor: '#FFB7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rhythmSequence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },

  rhythmBeat: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rhythmBeatActive: {
    borderColor: '#FFB7F0',
    backgroundColor: 'rgba(255,183,240,0.24)',
    transform: [{ scale: 1.08 }],
  },

  rhythmBeatText: {
    color: '#FFB7F0',
    fontSize: 24,
    fontWeight: '900',
  },

  musicLessonButtonDisabled: {
    opacity: 0.55,
  },

  musicSecondaryButton: {
    minHeight: 44,
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,183,240,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  musicLessonButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  musicControlRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  musicSpeedButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  musicSpeedButtonActive: {
    borderColor: '#FFB7F0',
    backgroundColor: 'rgba(255,183,240,0.18)',
  },

  musicSpeedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  rhythmPattern: {
    color: '#FFB7F0',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 5,
    marginBottom: 14,
  },

  melodyNote: {
    color: '#FFB7F0',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 14,
  },

  visualArea: {
    minHeight: 190,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },



  visualTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 20,
  },

  visualCaption: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 5,
  },

  lessonBox: {
    gap: 14,
    marginBottom: 20,
  },

  lessonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  lessonBullet: {
    fontSize: 9,
    marginTop: 6,
  },

  lessonText: {
    flex: 1,
    color: 'rgba(255,255,255,0.84)',
    fontSize: 15,
    lineHeight: 23,
  },

  experimentBox: {
    minHeight: 240,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },

  experimentObject: {
    fontSize: 48,
    fontWeight: '900',
  },

  experimentTrack: {
    height: 3,
    width: '72%',
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: 26,
    borderRadius: 3,
  },

  experimentFill: {
    height: 3,
    width: '100%',
    opacity: 0.35,
  },

  experimentHint: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 22,
  },

  instructionBox: {
    borderRadius: 19,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.065)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 18,
  },

  instructionTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  instructionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 23,
  },

  gameVisual: {
    minHeight: 210,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  gameIcon: {
    fontSize: 62,
    color: '#FFFFFF',
  },

  gamePulse: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  gamePulseText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  buildBoard: {
    minHeight: 210,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  buildBoardTitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 28,
  },

  buildObjects: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  buildObject: {
    color: '#FFFFFF',
    fontSize: 38,
  },

  missionVisual: {
    minHeight: 180,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  missionIcon: {
    color: '#FFFFFF',
    fontSize: 62,
  },

  missionSmall: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 18,
    textAlign: 'center',
  },

  missionBox: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    marginBottom: 12,
  },

  missionTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 9,
  },

  missionText: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 16,
    lineHeight: 24,
  },

  guardianText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 18,
  },













  levelDotLocked: {
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderColor: 'rgba(255,255,255,0.18)',
    opacity: 0.72,
  },

  levelDotLockedText: {
    color: 'rgba(255,255,255,0.5)',
  },

  completeBox: {
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallStar: {
    fontSize: 42,
    marginBottom: 20,
  },

  completeTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
  },

  completeText: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 330,
    marginBottom: 26,
  },

  actionButton: {
    minHeight: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 2,
  },

  actionButtonText: {
    color: '#090A14',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  footer: {
    paddingVertical: 22,
    alignItems: 'center',
  },

  footerText: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 10,
    textAlign: 'center',
  },

  center: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  backText: {
    color: '#080914',
    fontWeight: '900',
  },

  levelConsole: {
    marginTop: 18,
    marginBottom: 18,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(10,12,28,0.72)',
  },

  levelConsoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  levelConsoleEyebrow: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },

  levelConsoleTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
    letterSpacing: 1,
  },

  levelConsoleMuted: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 12,
    fontWeight: '700',
  },

  levelStateOrb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelStateOrbText: {
    fontSize: 19,
    fontWeight: '900',
  },

  levelConstellation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  levelNode: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelNodePressed: {
    transform: [{ scale: 0.92 }],
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  levelNodeCompleted: {
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  levelNodeLocked: {
    opacity: 0.34,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  levelNodeSymbol: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 18,
    lineHeight: 18,
  },

  levelNodeNumber: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },

  levelNodeCompletedText: {
    color: '#FFFFFF',
  },

  levelNodeLockedText: {
    color: 'rgba(255,255,255,0.25)',
  },

  levelConsoleActions: {
    flexDirection: 'row',
    gap: 10,
  },

  consoleAction: {
    flex: 1,
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.045)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  consoleActionNext: {
    justifyContent: 'flex-end',
  },

  consoleActionPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.24)',
  },

  consoleActionDisabled: {
    opacity: 0.38,
  },

  consoleActionArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  consoleActionSmall: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  consoleActionHint: {
    color: 'rgba(255,255,255,0.40)',
    fontSize: 9,
    marginTop: 2,
  },

  consoleActionTextRight: {
    alignItems: 'flex-end',
  },

  consoleActionDisabledText: {
    color: 'rgba(255,255,255,0.28)',
  },

});
