import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'constellation-collected-stars';

export type CollectedStar = {
  id: string;
  subject: string;
  level: number;
  title: string;
  collectedAt: number;
};

export async function getCollectedStars(): Promise<CollectedStar[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export async function collectStar(
  star: Omit<CollectedStar, 'collectedAt'>,
): Promise<CollectedStar[]> {
  const existing = await getCollectedStars();

  const alreadyCollected = existing.some((item) => item.id === star.id);

  if (alreadyCollected) {
    return existing;
  }

  const updated = [
    ...existing,
    {
      ...star,
      collectedAt: Date.now(),
    },
  ];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export async function hasCollectedStar(id: string): Promise<boolean> {
  const stars = await getCollectedStars();
  return stars.some((star) => star.id === id);
}

export async function clearCollectedStars(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
