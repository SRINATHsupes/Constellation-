import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CUSTOMIZATION_PRESETS,
  DEFAULT_CUSTOMIZATION,
  RoomCustomization,
  BackgroundStyle,
} from './customization-types';

const STORAGE_KEY = 'constellation-room-customization';

export async function getRoomCustomization(
  roomId: string,
): Promise<RoomCustomization> {
  try {
    const raw = await AsyncStorage.getItem(
      `${STORAGE_KEY}:${roomId}`,
    );

    if (!raw) {
      return DEFAULT_CUSTOMIZATION;
    }

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_CUSTOMIZATION,
      ...parsed,
    };
  } catch {
    return DEFAULT_CUSTOMIZATION;
  }
}

export async function saveRoomCustomization(
  roomId: string,
  customization: RoomCustomization,
): Promise<void> {
  await AsyncStorage.setItem(
    `${STORAGE_KEY}:${roomId}`,
    JSON.stringify(customization),
  );
}

export async function applyRoomPreset(
  roomId: string,
  presetId: string,
): Promise<RoomCustomization> {
  const validPresetIds = Object.keys(
    CUSTOMIZATION_PRESETS,
  ) as BackgroundStyle[];

  const selectedPreset: BackgroundStyle =
    validPresetIds.includes(
      presetId as BackgroundStyle,
    )
      ? (presetId as BackgroundStyle)
      : 'cosmic';

  const preset =
    CUSTOMIZATION_PRESETS[selectedPreset];

  await saveRoomCustomization(roomId, preset);

  return preset;
}
