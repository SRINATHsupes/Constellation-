import { Stack } from 'expo-router';

import LessonScreen from '@/screens/lessons/lesson-screen';

export default function LessonRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />

      <LessonScreen />
    </>
  );
}