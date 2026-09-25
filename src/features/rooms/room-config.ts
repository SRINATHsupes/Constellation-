export type RoomConfig = {
  id: string;
  name: string;
  background?: any;
  roomArtwork?: any;
  music?: any;
  accent: string;
  escapeType:
    | 'vedic-locks'
    | 'electronics-circuit'
    | 'physics-station'
    | 'manufacturing-factory'
    | 'arts-drawing'
    | 'arts-diy'
    | 'arts-models'
    | 'music-sound'
    | 'nutrition-kitchen'
    | 'humanity-community'
    | 'nature-ecosystem';
};

export const ROOM_CONFIGS: Record<string, RoomConfig> = {
  vedic: {
    id: 'vedic',
    name: 'Ancient Mathematics Chamber',
    accent: '#BFA2FF',
    escapeType: 'vedic-locks',
  },

  electronics: {
    id: 'electronics',
    name: 'Logic Laboratory',
    accent: '#53E8FF',
    escapeType: 'electronics-circuit',
  },

  physics: {
    id: 'physics',
    name: 'Physics Station',
    accent: '#7DE7FF',
    escapeType: 'physics-station',
  },

  manufacturing: {
    id: 'manufacturing',
    name: 'Mini Factory',
    accent: '#FFB86B',
    escapeType: 'manufacturing-factory',
  },

  music: {
    id: 'music',
    name: 'Sound Chamber',
    accent: '#FFB7F0',
    escapeType: 'music-sound',
  },

  nutrition: {
    id: 'nutrition',
    name: 'Kitchen Laboratory',
    accent: '#B9F27C',
    escapeType: 'nutrition-kitchen',
  },

  humanity: {
    id: 'humanity',
    name: 'Community Hub',
    accent: '#FFD2B8',
    escapeType: 'humanity-community',
  },

  nature: {
    id: 'nature',
    name: 'Living Ecosystem',
    accent: '#9EF2B5',
    escapeType: 'nature-ecosystem',
  },

  'arts-drawing': {
    id: 'arts-drawing',
    name: 'Artist Workshop',
    accent: '#FFD166',
    escapeType: 'arts-drawing',
  },

  'arts-diy': {
    id: 'arts-diy',
    name: 'Maker Workshop',
    accent: '#FFD166',
    escapeType: 'arts-diy',
  },

  'arts-models': {
    id: 'arts-models',
    name: 'Model Workshop',
    accent: '#FFD166',
    escapeType: 'arts-models',
  },
};

export function getRoomConfig(
  subject: string,
  branch?: string,
): RoomConfig {
  if (subject === 'arts') {
    return (
      ROOM_CONFIGS[`arts-${branch ?? 'drawing'}`] ??
      ROOM_CONFIGS['arts-drawing']
    );
  }

  return ROOM_CONFIGS[subject] ?? ROOM_CONFIGS.vedic;
}
