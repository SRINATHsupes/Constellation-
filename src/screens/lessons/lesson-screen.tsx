/* eslint-disable react/no-unescaped-entities */
import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const LESSONS: Record<
  string,
  Question[]
> = {
  'Number Patterns': [
    {
      question:
        'What comes next: 2, 4, 6, 8, ?',
      options: [
        '9',
        '10',
        '11',
        '12',
      ],
      answer: '10',
      explanation:
        'The numbers increase by 2 each time.',
    },
    {
      question:
        'What comes next: 5, 10, 15, 20, ?',
      options: [
        '22',
        '24',
        '25',
        '30',
      ],
      answer: '25',
      explanation:
        'The pattern adds 5 each time.',
    },
    {
      question:
        'What comes next: 3, 6, 12, 24, ?',
      options: [
        '30',
        '36',
        '42',
        '48',
      ],
      answer: '48',
      explanation:
        'Each number is multiplied by 2.',
    },
  ],

  Multiplication: [
    {
      question: 'What is 7 × 8?',
      options: [
        '54',
        '56',
        '58',
        '64',
      ],
      answer: '56',
      explanation:
        '7 groups of 8 make 56.',
    },
    {
      question: 'What is 12 × 5?',
      options: [
        '50',
        '55',
        '60',
        '65',
      ],
      answer: '60',
      explanation:
        '12 multiplied by 5 equals 60.',
    },
    {
      question: 'What is 9 × 9?',
      options: [
        '72',
        '81',
        '90',
        '99',
      ],
      answer: '81',
      explanation:
        '9 multiplied by 9 equals 81.',
    },
  ],

  Division: [
    {
      question: 'What is 24 ÷ 6?',
      options: [
        '3',
        '4',
        '5',
        '6',
      ],
      answer: '4',
      explanation:
        '6 × 4 = 24.',
    },
    {
      question: 'What is 45 ÷ 5?',
      options: [
        '7',
        '8',
        '9',
        '10',
      ],
      answer: '9',
      explanation:
        '5 × 9 = 45.',
    },
    {
      question: 'What is 72 ÷ 8?',
      options: [
        '7',
        '8',
        '9',
        '10',
      ],
      answer: '9',
      explanation:
        '8 × 9 = 72.',
    },
  ],

  'Mental Calculation': [
    {
      question: 'What is 25 + 25?',
      options: [
        '40',
        '45',
        '50',
        '55',
      ],
      answer: '50',
      explanation:
        'Two groups of 25 make 50.',
    },
    {
      question: 'What is 100 - 37?',
      options: [
        '53',
        '63',
        '67',
        '73',
      ],
      answer: '63',
      explanation:
        '100 - 37 = 63.',
    },
    {
      question: 'What is 15 × 4?',
      options: [
        '45',
        '50',
        '60',
        '75',
      ],
      answer: '60',
      explanation:
        '15 × 4 = 60.',
    },
  ],

  'Speed & Tricks': [
    {
      question: 'What is 50 × 2?',
      options: [
        '75',
        '90',
        '100',
        '120',
      ],
      answer: '100',
      explanation:
        'Multiplying by 2 doubles the number.',
    },
    {
      question: 'What is 25 × 4?',
      options: [
        '75',
        '90',
        '100',
        '125',
      ],
      answer: '100',
      explanation:
        '25 × 4 makes a complete 100.',
    },
    {
      question: 'What is 99 + 1?',
      options: [
        '90',
        '99',
        '100',
        '101',
      ],
      answer: '100',
      explanation:
        '99 is one away from 100.',
    },
  ],

  'Zero & Wholeness': [
    {
      question: 'What is 7 × 0?',
      options: [
        '0',
        '1',
        '7',
        '70',
      ],
      answer: '0',
      explanation:
        'Any number multiplied by zero is zero.',
    },
    {
      question: 'What is 0 + 8?',
      options: [
        '0',
        '1',
        '8',
        '80',
      ],
      answer: '8',
      explanation:
        'Adding zero does not change the number.',
    },
    {
      question: 'What is 10 × 0?',
      options: [
        '0',
        '1',
        '10',
        '100',
      ],
      answer: '0',
      explanation:
        'Zero times any number is zero.',
    },
  ],

  'Quick Addition': [
    {
      question: 'What is 18 + 12?',
      options: [
        '20',
        '25',
        '30',
        '35',
      ],
      answer: '30',
      explanation:
        '18 + 12 = 30.',
    },
    {
      question: 'What is 27 + 13?',
      options: [
        '30',
        '35',
        '40',
        '45',
      ],
      answer: '40',
      explanation:
        '27 + 13 = 40.',
    },
    {
      question: 'What is 45 + 15?',
      options: [
        '50',
        '55',
        '60',
        '65',
      ],
      answer: '60',
      explanation:
        '45 + 15 = 60.',
    },
  ],

  'Number Relationships': [
    {
      question:
        'Which number is double 12?',
      options: [
        '18',
        '20',
        '24',
        '26',
      ],
      answer: '24',
      explanation:
        'Double means multiply by 2.',
    },
    {
      question:
        'Which number is half of 50?',
      options: [
        '20',
        '25',
        '30',
        '35',
      ],
      answer: '25',
      explanation:
        '50 divided by 2 is 25.',
    },
    {
      question:
        'Which number is 10 more than 35?',
      options: [
        '40',
        '45',
        '50',
        '55',
      ],
      answer: '45',
      explanation:
        '35 + 10 = 45.',
    },
  ],

  'Mental Multiplication': [
    {
      question: 'What is 11 × 5?',
      options: [
        '45',
        '50',
        '55',
        '60',
      ],
      answer: '55',
      explanation:
        '11 groups of 5 make 55.',
    },
    {
      question: 'What is 11 × 7?',
      options: [
        '66',
        '77',
        '88',
        '99',
      ],
      answer: '77',
      explanation:
        '11 × 7 = 77.',
    },
    {
      question: 'What is 12 × 10?',
      options: [
        '100',
        '110',
        '120',
        '130',
      ],
      answer: '120',
      explanation:
        '12 × 10 = 120.',
    },
  ],
};

export default function LessonScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      title?: string;
    }>();

  const lessonTitle =
    typeof params.title === 'string'
      ? params.title
      : 'Number Patterns';

  const questions = useMemo(
    () =>
      LESSONS[lessonTitle] ??
      LESSONS['Number Patterns'],
    [lessonTitle],
  );

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const currentQuestion =
    questions[questionIndex];

  const chooseAnswer = (
    answer: string,
  ) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    if (
      answer === currentQuestion.answer
    ) {
      setScore(
        (previous) => previous + 1,
      );
    }
  };

  const nextQuestion = () => {
    if (
      questionIndex >=
      questions.length - 1
    ) {
      setFinished(true);
      return;
    }

    setQuestionIndex(
      (previous) => previous + 1,
    );

    setSelectedAnswer(null);
  };

  const retryLesson = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const returnToSpace = () => {
    router.replace('/(main)/world');
  };

  if (finished) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar style="light" />

        <View style={styles.result}>
          <Text style={styles.star}>
            
          </Text>

          <Text style={styles.resultLabel}>
            LESSON COMPLETE
          </Text>

          <Text style={styles.resultTitle}>
            {lessonTitle}
          </Text>

          <Text style={styles.score}>
            {score} / {questions.length}
          </Text>

          <Text style={styles.resultText}>
            You completed this star's
            learning path.
          </Text>

          <Pressable
            onPress={retryLesson}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>
              TRY AGAIN
            </Text>
          </Pressable>

          <Pressable
            onPress={returnToSpace}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>
              RETURN TO SPACE
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          onPress={returnToSpace}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.headerSmall}>
            VEDIC MATHS
          </Text>

          <Text
            numberOfLines={1}
            style={styles.headerTitle}
          >
            {lessonTitle}
          </Text>
        </View>

        <Text style={styles.progress}>
          {questionIndex + 1}/
          {questions.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                ((questionIndex + 1) /
                  questions.length) *
                100
              }%`,
            },
          ]}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.lessonSymbol}>
          <Text style={styles.symbolText}>
            
          </Text>
        </View>

        <Text style={styles.questionNumber}>
          QUESTION {questionIndex + 1}
        </Text>

        <Text style={styles.question}>
          {currentQuestion.question}
        </Text>

        <View style={styles.options}>
          {currentQuestion.options.map(
            (option) => {
              const isSelected =
                selectedAnswer === option;

              const isCorrect =
                option ===
                currentQuestion.answer;

              let optionStyle =
                styles.option;

              if (
                selectedAnswer !== null &&
                isCorrect
              ) {
                optionStyle =
                  styles.correctOption;
              } else if (isSelected) {
                optionStyle =
                  styles.wrongOption;
              }

              return (
                <Pressable
                  key={option}
                  disabled={
                    selectedAnswer !== null
                  }
                  onPress={() =>
                    chooseAnswer(option)
                  }
                  style={optionStyle}
                >
                  <Text
                    style={
                      styles.optionText
                    }
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>

        {selectedAnswer !== null && (
          <View style={styles.feedback}>
            <Text
              style={styles.feedbackTitle}
            >
              {selectedAnswer ===
              currentQuestion.answer
                ? 'CORRECT '
                : 'KEEP EXPLORING'}
            </Text>

            <Text
              style={styles.feedbackText}
            >
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </View>

      {selectedAnswer !== null && (
        <View style={styles.bottom}>
          <Pressable
            onPress={nextQuestion}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>
              {questionIndex >=
              questions.length - 1
                ? 'FINISH LESSON'
                : 'CONTINUE'}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020713',
  },

  header: {
    minHeight: 70,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor:
      'rgba(210,230,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    color: '#eaf2ff',
    fontSize: 30,
    fontWeight: '300',
    marginTop: -3,
  },

  headerText: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },

  headerSmall: {
    color:
      'rgba(180,205,240,0.5)',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2,
  },

  headerTitle: {
    marginTop: 3,
    color: '#f0f5ff',
    fontSize: 16,
    fontWeight: '700',
  },

  progress: {
    marginLeft: 10,
    color:
      'rgba(210,230,255,0.55)',
    fontSize: 11,
    fontWeight: '700',
  },

  progressTrack: {
    height: 2,
    marginHorizontal: 18,
    backgroundColor:
      'rgba(180,210,245,0.08)',
  },

  progressFill: {
    height: 2,
    backgroundColor: '#bcd7ff',
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 42,
  },

  lessonSymbol: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor:
      'rgba(185,215,255,0.18)',
    backgroundColor:
      'rgba(20,35,58,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },

  symbolText: {
    color: '#dceaff',
    fontSize: 27,
  },

  questionNumber: {
    color:
      'rgba(185,210,245,0.48)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },

  question: {
    marginTop: 12,
    color: '#f2f6ff',
    fontSize: 25,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
  },

  options: {
    marginTop: 34,
    gap: 11,
  },

  option: {
    minHeight: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      'rgba(200,220,250,0.12)',
    backgroundColor:
      'rgba(15,28,48,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  correctOption: {
    minHeight: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      'rgba(170,220,190,0.45)',
    backgroundColor:
      'rgba(45,85,65,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrongOption: {
    minHeight: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      'rgba(220,170,170,0.35)',
    backgroundColor:
      'rgba(75,35,45,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionText: {
    color: '#e9f1ff',
    fontSize: 17,
    fontWeight: '600',
  },

  feedback: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      'rgba(190,215,250,0.1)',
    backgroundColor:
      'rgba(12,24,42,0.65)',
  },

  feedbackTitle: {
    color: '#dceaff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  feedbackText: {
    marginTop: 7,
    color:
      'rgba(220,235,255,0.65)',
    fontSize: 13,
    lineHeight: 19,
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 26,
    backgroundColor: '#dce9ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  primaryText: {
    color: '#071225',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  secondaryButton: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor:
      'rgba(210,230,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryText: {
    color:
      'rgba(220,235,255,0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  result: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  star: {
    color: '#dceaff',
    fontSize: 45,
    marginBottom: 22,
  },

  resultLabel: {
    color:
      'rgba(190,215,250,0.55)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },

  resultTitle: {
    marginTop: 9,
    color: '#f2f6ff',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
  },

  score: {
    marginTop: 26,
    color: '#dceaff',
    fontSize: 46,
    fontWeight: '800',
  },

  resultText: {
    marginTop: 10,
    color:
      'rgba(210,230,255,0.58)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});