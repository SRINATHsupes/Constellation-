import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProgressRecord = {
  levelId: string;
  subject: string;
  branch: string;
  level: number;
  title: string;
  completedAt: number;
};

type ProgressData = {
  completed: string[];
  stars: ProgressRecord[];
};

const KEY = 'constellation.progression.v1';

function emptyProgress(): ProgressData {
  return {
    completed: [],
    stars: [],
  };
}

function isProgressRecord(value: unknown): value is ProgressRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.levelId === 'string' &&
    typeof record.subject === 'string' &&
    typeof record.branch === 'string' &&
    typeof record.level === 'number' &&
    typeof record.title === 'string' &&
    typeof record.completedAt === 'number'
  );
}

async function readProgress(): Promise<ProgressData> {
  try {
    const raw = await AsyncStorage.getItem(KEY);

    if (!raw) {
      return emptyProgress();
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return emptyProgress();
    }

    const data = parsed as Record<string, unknown>;

    const completed = Array.isArray(data.completed)
      ? data.completed.filter(
          (value): value is string => typeof value === 'string',
        )
      : [];

    const stars = Array.isArray(data.stars)
      ? data.stars.filter(isProgressRecord)
      : [];

    return {
      completed,
      stars,
    };
  } catch {
    return emptyProgress();
  }
}

async function writeProgress(data: ProgressData): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function completeLevel(
  record: Omit<ProgressRecord, 'completedAt'>,
): Promise<ProgressData> {
  const current = await readProgress();

  const completed = current.completed.includes(record.levelId)
    ? current.completed
    : [...current.completed, record.levelId];

  const alreadyRecorded = current.stars.some(
    (star) => star.levelId === record.levelId,
  );

  const stars = alreadyRecorded
    ? current.stars
    : [
        ...current.stars,
        {
          ...record,
          completedAt: Date.now(),
        },
      ];

  const next: ProgressData = {
    completed,
    stars,
  };

  await writeProgress(next);

  return next;
}

export async function isLevelCompleted(
  levelId: string,
): Promise<boolean> {
  const progress = await readProgress();

  return progress.completed.includes(levelId);
}

export async function getProgress(): Promise<ProgressData> {
  return readProgress();
}

export async function getCompletedLevels(): Promise<string[]> {
  const progress = await readProgress();

  return progress.completed;
}

export async function getStarRecords(): Promise<ProgressRecord[]> {
  const progress = await readProgress();

  return progress.stars;
}

export async function isLevelUnlocked(
  levels: Array<{ id: string }>,
  index: number,
): Promise<boolean> {
  if (index <= 0) {
    return true;
  }

  const previous = levels[index - 1];

  if (!previous) {
    return false;
  }

  return isLevelCompleted(previous.id);
}
